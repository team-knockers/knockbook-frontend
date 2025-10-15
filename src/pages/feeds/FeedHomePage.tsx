import profileUrl from "../../assets/feed_profile.jpg";

import { useEffect, useMemo, useRef, useState } from 'react';
import { timeAgo } from '../../features/feeds/util';

import SearchBar from '../../components/navigation/SearchBar';
import FeedCard from '../../features/feeds/components/FeedCard';
import s from './FeedHomePage.module.css';

import { FeedService } from '../../features/feeds/services/FeedService';
import type { FeedPost } from '../../features/feeds/types';

import FeedCommentBottomPopup, { type FeedCommentItem } from "../../features/feeds/components/FeedCommentBottomPopup";
import FeedEditPopup from "../../features/feeds/components/FeedEditPopup";

type OnCommentLike = (commentId: string, liked: boolean) => void;

function createDemoComments(
  post: FeedPost,
  onCommentLike?: OnCommentLike
): FeedCommentItem[] {
  const now = Date.now();

  const wrap = (id: string) => (liked: boolean) => {
    if (onCommentLike) { onCommentLike(id, liked); }
    else console.log("[comment-like]", { id, liked });
  };

  return [
    {
      id: `${post.postId}-c1`,
      profileUrl,
      displayName: "독서왕",
      createdAt: new Date(now - 1000 * 60 * 7),
      comment: "와 사진 분위기 너무 좋네요! 어디서 찍으신 건가요?",
      likesCount: 2,
      onLikeToggle: wrap(`${post.postId}-c1`),
    },
    {
      id: `${post.postId}-c2`,
      profileUrl,
      displayName: "책벌레",
      createdAt: new Date(now - 1000 * 60 * 60 * 2),
      comment: "추천하신 책 바로 담았습니다 😊",
      likesCount: 5,
      onLikeToggle: wrap(`${post.postId}-c2`),
    },
    {
      id: `${post.postId}-c3`,
      profileUrl,
      displayName: "홍길동",
      createdAt: new Date(now - 1000 * 60 * 60 * 24),
      comment: "문장 너무 멋져요. 다음 글도 기대할게요!",
      likesCount: 1,
      onLikeToggle: wrap(`${post.postId}-c3`),
    },
  ];
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window === "undefined" ? false : window.innerWidth < breakpoint
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width:${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

const PAGE_SIZE = 3; // number of posts per request 

export default function FeedHomePage() {
  // list shown on the page
  const [posts, setPosts] = useState<FeedPost[]>([]);
  // cursor for next page (null = no more)
  const [nextAfter, setNextAfter] = useState<string | null>(null);
  // true while a fetch is running (prevents duplicates)
  const [loading, setLoading] = useState(false);
  // searchKeyword
  const [keyword, setKeyword] = useState<string>('');
  // bottom trigger element 
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  
  // 1) first load and reload when search keyword changes
  useEffect(() => {
    let alive = true; // ignore setState if unmounted
    (async () => {
      try {
        setLoading(true);
        // first page : (after = null)
        const res = await FeedService.getFeedPostList(PAGE_SIZE, null, keyword);
        if (!alive) return;
        setPosts(res.feedPosts);      // replace list
        setNextAfter(res.nextAfter);  // save next cursor 
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; }; // cleanup on unmout 
  }, [keyword]);

  // 2) load next page (called when sentinel becomes visible)
  async function loadMore() {
    if (loading || !nextAfter) return; // guard: in-flight or no more
    try {
      setLoading(true);
      const res = await FeedService.getFeedPostList(PAGE_SIZE, nextAfter, keyword);
      setPosts(prev => [...prev, ...res.feedPosts]); // append 
      setNextAfter(res.nextAfter);
    } finally {
      setLoading(false);
    }
  }

  // 3) observe the bottom sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // trigger when visible
          loadMore();
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0 }
    );
    // start
    io.observe(el);
    // stop on unmount/update
    return () => io.disconnect();
  }, [sentinelRef.current, nextAfter, loading]); 

  // 4) search handler
  const handleSearch = (searchKeyword: string)=> {
    setKeyword(searchKeyword.trim());
  }

  const handleSubmitComment = (feedId: string) => {
    return (text: string) => {
      console.log("[COMMENT SUBMIT]", feedId, text); // test code
      // TODO: call API
    }
  };

  const handleLikePost = (id: string) => {
    return (liked: boolean) => {
      console.log(`[LIKE] ${id}:`, liked); // test code
      // TODO: call API
    }
  };

  const handlePopupOpen = (id: string) => {
    return () => {
      if (isMobile) {
        setSelectedPostId(id);
      }
      else {
        setSelectedPostId(id);

      }
    }
  };

  const handleCommentLike: OnCommentLike = (commentId, liked) => {
    // TODO: call API
    // await FeedService.toggleCommentLike(commentId, liked)
    console.log("API Called:", commentId, liked); // for test
  };

  const isMobile = useIsMobile();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = useMemo(
    () => posts.find(p => p.postId === selectedPostId) ?? null,
    [selectedPostId]
  );

  return (
    <div className={s['page-layout']}>
      <SearchBar placeholder="검색어를 입력하세요" onSearch={handleSearch} />

      {posts.map(p => (
        <div 
          key={p.postId}
          style={{ cursor: isMobile ? "default" : "pointer" }}>
          <FeedCard
            profileImgUrl={p.avatarUrl ?? profileUrl}
            displayName={p.displayName}
            timeAgo={timeAgo(p.createdAt)}
            postImgUrls={p.images.map((url, i) => ({ id: String(i + 1), url }))}
            likesCount={p.likesCount}
            commentsCount={p.commentsCount}
            content={p.content}
            onLikeToggled={handleLikePost(p.postId)}
            onCommentClick={handlePopupOpen(p.postId)}/>
        </div>
      ))}

      {/* mobile only : FeedCommentBottomPopup */}
      {selectedPost && isMobile && (
        <FeedCommentBottomPopup
          open={!!selectedPost}
          onClose={() => setSelectedPostId(null)}
          title={`댓글 ${selectedPost.commentsCount}개`}
          comments={createDemoComments(selectedPost, handleCommentLike)}
          onCommentSubmit={handleSubmitComment(selectedPost.postId)}
          heightPct={60}
        />
      )}

      {/* desktop only : FeedEditPopup */}
      {selectedPost && !isMobile && (
        <FeedEditPopup
          open={!!selectedPostId}
          onClose={() => setSelectedPostId(null)}
          comments={createDemoComments(selectedPost, handleCommentLike)}
          onCommentSubmit={handleSubmitComment(selectedPost.postId)}
          profileUrl={selectedPost.avatarUrl ?? profileUrl}
          displayName={selectedPost.displayName}
          createdAt={selectedPost.createdAt}
          content={selectedPost.content}
          imageUrls={selectedPost.images}
          likesCount={selectedPost.likesCount}
          likedByMe={selectedPost?.likedByMe}
          onLikeToggle={handleLikePost(selectedPost.postId)}
          onMoreClick={() => {/* TODO */}}/>
      )}

      {/* invisible bottom trigger */}
      <div ref={sentinelRef} className={s['sentinel']} />
      {loading && <div className={s['loading']}>Loading…</div>}
    </div>
  );
}
