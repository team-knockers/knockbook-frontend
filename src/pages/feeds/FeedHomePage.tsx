import profileUrl from "../../assets/feed_profile.jpg";
import { useEffect, useMemo, useRef, useState } from 'react';
import { timeAgo } from '../../features/feeds/util';

import SearchBar from '../../components/navigation/SearchBar';
import FeedCard from '../../features/feeds/components/FeedCard';
import s from './FeedHomePage.module.css';

import { FeedService } from '../../features/feeds/services/FeedService';
import type { FeedPostComment, FeedPost } from '../../features/feeds/types';

import FeedCommentBottomPopup from "../../features/feeds/components/FeedCommentBottomPopup";
import FeedEditPopup from "../../features/feeds/components/FeedEditPopup";
import FeedSlider from "../../features/feeds/components/FeedSlider";
import { UserService } from "../../features/account/services/UserService";
import type { GetMyProfileResponse } from "../../features/account/types";

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window === "undefined" ? false : window.innerWidth < breakpoint
  );
  useEffect(() => {
    if (typeof window === "undefined") { return; }
    const mq = window.matchMedia(`(max-width:${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

const POST_SIZE = 5; // number of posts per request 
const BANNER_SIZE=20; // 이거 api 어디서 부르면됨 얘는그냥 20개만 불르고 추가로딩안할건데 

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

  const [mbtiItems, setMbtiItems] = useState<FeedPost[]>([]);
  const [mbtiLoading, setMbtiLoading] = useState(false);

  const [popupLoading, setPopupLoading] = useState(false);
  const [selectedComments, setSelectedComments] = useState<FeedPostComment[] | null>(null);
  const [selectedFeed, setSelectedFeed] = useState<FeedPost | null>(null);
  const [userInfo, setUserInfo] = useState<GetMyProfileResponse | null>(null);

  const [forceEditPopup, setForceEditPopup] = useState(false);

  // 1) first load and reload when search keyword changes
  useEffect(() => {
    let alive = true; // ignore setState if unmounted
    (async () => {
      try {
        setLoading(true);
        // first page : (after = null)
        const res = await FeedService.getFeedPostList(POST_SIZE, null, keyword);
        if (!alive) { return; }
        setPosts(res.feedPosts);      // replace list
        setNextAfter(res.nextAfter);  // save next cursor 
        const userInfo = await UserService.getMyProfile();
        setUserInfo(userInfo);
      } finally {
        if (alive) { setLoading(false); }
      }
    })();
    return () => { alive = false; }; // cleanup on unmout 
  }, [keyword]);

  // 2) load next page (called when sentinel becomes visible)
  async function loadMore() {
    if (loading || !nextAfter) { return; } // guard: in-flight or no more
    try {
      setLoading(true);
      const res = await FeedService.getFeedPostList(POST_SIZE, nextAfter, keyword);
      setPosts(prev => [...prev, ...res.feedPosts]); // append 
      setNextAfter(res.nextAfter);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userInfo?.mbti || mbtiLoading || mbtiItems.length) return; // 이미 있으면 스킵
    let alive = true;
    (async () => {
      try {
        setMbtiLoading(true);
        const res = await FeedService.getFeedPostList(BANNER_SIZE, null, "", userInfo.mbti);
        if (!alive) return;
        setMbtiItems(res.feedPosts);
      } finally {
        if (alive) setMbtiLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [userInfo?.mbti]);

  // 3) observe the bottom sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) { return; }

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

  const handleSubmitComment = (postId: string) => {
    return async (text: string) => {
      const v = text.trim();
      if (!v) { return; }

      try {
        const created = await FeedService.createComment(postId, v);
        setSelectedComments(prev => (prev ? [created, ...prev] : [created]));
        setPosts(prev =>
          prev.map(p => (p.postId === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
        );
        setSelectedFeed(prev =>
          prev && prev.postId === postId ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev
        );
      } catch (e) {
        console.error(e);
      }
    };
  };

  const handleLikePost =
    (postId: string) =>
    (next: boolean) => {
      if (next) {
        FeedService.likePost(postId);
      } else {
        FeedService.unlikePost(postId);
      }

      setPosts(prev =>
        prev.map(p =>
          p.postId === postId
            ? { ...p, likedByMe: next, likesCount: p.likesCount + (next ? 1 : -1) }
            : p
        )
      );
      setSelectedFeed(prev =>
        prev && prev.postId === postId
          ? { ...prev, likedByMe: next, likesCount: prev.likesCount + (next ? 1 : -1) }
          : prev
      );
    };

  const handlePopupOpen = (postId: string) => {
    return async () => {
      if (popupLoading) { return; }
      try {
        setPopupLoading(true);
        setSelectedPostId(postId);
        setForceEditPopup(false); // 일반 카드에서는 강제 해제

        if (isMobile) {
          const res = await FeedService.getFeedPostCommentList(postId);
          setSelectedComments(res.feedComments);
          setSelectedFeed(null);
        } else {
          const res = await FeedService.getFeedPostWithCommentList(postId);
          setSelectedFeed(res.feedPost);
          setSelectedComments(res.feedComments);
        }
      } finally {
        setPopupLoading(false);
      }
    };
  };

  const handleSliderOpen = (postId: string) => {
    return async () => {
      if (popupLoading) return;
      try {
        setPopupLoading(true);
        setSelectedPostId(postId);
        setForceEditPopup(true); 

        const res = await FeedService.getFeedPostWithCommentList(postId);
        setSelectedFeed(res.feedPost);
        setSelectedComments(res.feedComments);
      } finally {
        setPopupLoading(false);
      }
    };
  };

  const isMobile = useIsMobile();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = useMemo(
    () => posts.find(p => p.postId === selectedPostId) ?? null,
    [selectedPostId, posts]
  );

  return (
    <div className={s['page-layout']}>
      <SearchBar placeholder={`${userInfo?.displayName}님, 무슨 생각을 하고 계신가요?`} onSearch={handleSearch} />
      <FeedSlider
        title={`${userInfo?.mbti} 유저들의 이야기 궁금하신가요?`}
        subtitle="회원님과 동일한 MBTI 유저들의 콘텐츠를 추천해드려요"
        items={mbtiItems} 
        onClickItem={(postId) => handleSliderOpen(postId)()}
      />

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
            likedByMe={p.likedByMe}
            onLikeToggled={handleLikePost(p.postId)}
            onCommentClick={handlePopupOpen(p.postId)}/>
        </div>
      ))}

      {/* mobile only : FeedCommentBottomPopup */}
      {!!selectedPostId && isMobile && !forceEditPopup && (
        <FeedCommentBottomPopup
          open={!!selectedPostId}
          onClose={() => { setSelectedPostId(null); setSelectedComments(null); }}
          title={`댓글 ${selectedPost?.commentsCount}개`}
          comments={selectedComments ?? []}
          onCommentSubmit={handleSubmitComment(selectedPostId!)}
          heightPct={60}
        />
      )}

      {/* desktop only : FeedEditPopup */}
      {selectedFeed && (!isMobile || forceEditPopup) && (
        <FeedEditPopup
          open={!!selectedFeed}
          onClose={() => { setSelectedPostId(null); setSelectedFeed(null); setSelectedComments(null); }}
          comments={selectedComments ?? []}                    
          onCommentSubmit={handleSubmitComment(selectedFeed.postId)}
          avatarUrl={selectedFeed.avatarUrl ?? profileUrl}     
          displayName={selectedFeed.displayName}
          createdAt={selectedFeed.createdAt}                    
          content={selectedFeed.content}
          imageUrls={selectedFeed.images}
          likesCount={selectedFeed.likesCount}
          likedByMe={selectedFeed.likedByMe}
          onLikeToggle={handleLikePost(selectedFeed.postId)}
        />
      )}

      {/* invisible bottom trigger */}
      <div ref={sentinelRef} className={s['sentinel']} />
      {loading && <div className={s['loading']}>Loading…</div>}
    </div>
  );
}
