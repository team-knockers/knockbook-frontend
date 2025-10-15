import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import s from './FeedProfilePage.module.css';
import OneWayButton from '../../components/forms/OneWayButton';
import { IoSunny } from "react-icons/io5";
import { IoMdArrowRoundForward } from "react-icons/io";
import { PATHS } from '../../routes/paths';
import { FeedService } from '../../features/feeds/services/FeedService';
import type { FeedPost, FeedProfileThumbnail } from '../../features/feeds/types';
import FeedProfileFallback from '../../assets/feed_profile.jpg';
import profileUrl from "../../assets/feed_profile.jpg";
import type { FeedCommentItem } from '../../features/feeds/components/FeedCommentBottomPopup';
import FeedEditPopup from '../../features/feeds/components/FeedEditPopup';

const PAGE_SIZE = 3; // number of posts per request


type OnCommentLike = (commentId: string, liked: boolean) => void;

function createDemoComments(
  post: FeedPost,
  onCommentLike?: OnCommentLike
): FeedCommentItem[] {
  const now = Date.now();
  const wrap = (id: string) => (liked: boolean) => {
    if (onCommentLike) onCommentLike(id, liked);
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
      onLikeToggle: wrap(`${post.postId}-c1`)
    },
    {
      id: `${post.postId}-c2`,
      profileUrl,
      displayName: "책벌레",
      createdAt: new Date(now - 1000 * 60 * 60 * 2),
      comment: "추천하신 책 바로 담았습니다 😊",
      likesCount: 5,
      onLikeToggle: wrap(`${post.postId}-c2`)
    },
    {
      id: `${post.postId}-c3`,
      profileUrl,
      displayName: "홍길동",
      createdAt: new Date(now - 1000 * 60 * 60 * 24),
      comment: "문장 너무 멋져요. 다음 글도 기대할게요!",
      likesCount: 1,
      onLikeToggle: wrap(`${post.postId}-c3`)
    }
  ];
}

export default function FeedProfilePage() {
  // profile area
  const [displayName, setDisplayName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [postsCount, setPostsCount] = useState<number>(0);

  // thumbnails + pagination
  const [thumbs, setThumbs] = useState<FeedProfileThumbnail[]>([]);
  const [nextAfter, setNextAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // bottom trigger
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // first load
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const r = await FeedService.getFeedProfile(PAGE_SIZE, null);
        if (!alive) return;
        setDisplayName(r.displayName ?? '');
        setAvatarUrl(r.avatarUrl ?? null);
        setBio(r.bio ?? null);
        setPostsCount(Number(r.postsCount ?? 0));
        setThumbs(r.profileThumbnails ?? []);
        setNextAfter(r.nextAfter ?? null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // load next page
  async function loadMore() {
    if (loading || !nextAfter) return;
    setLoading(true);
    try {
      const r = await FeedService.getFeedProfile(PAGE_SIZE, nextAfter);
      setThumbs(prev => [...prev, ...(r.profileThumbnails ?? [])]);
      setNextAfter(r.nextAfter ?? null);
    } finally {
      setLoading(false);
    }
  }

  // observe sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { root: null, rootMargin: '200px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [nextAfter, loading]);

  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);

  const onThumbnailClick = (postId: string) => async () => {
    try {
      // const p = await FeedService.getFeedPostDetail(postId);
      // setCurrentPost(p);

      const dummyPost: FeedPost = {
        postId,
        displayName: "임의의 유저",
        avatarUrl: profileUrl,
        createdAt: new Date().toISOString(),
        content: "테스트용 더미 포스트 내용입니다. 이 포스트만 계속 뜹니다.",
        images: [
          "https://picsum.photos/800/800?random=1",
          "https://picsum.photos/800/800?random=2",
          "https://picsum.photos/800/800?random=3"
        ],
        likesCount: 42,
        likedByMe: false,
        commentsCount: 3,
        userId: ''
      };
      setSelectedPost(dummyPost);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitComment = (feedId: string) => {
    return (text: string) => {
      console.log("[COMMENT SUBMIT]", feedId, text);
    };
  };

  const handlePostLike = (id: string) => {
    return (liked: boolean) => {
      console.log("[LIKE]", id, liked);
    };
  };

  const handleCommentLike: OnCommentLike = (commentId, liked) => {
    console.log("API Called:", commentId, liked);
  };

  const popupComments = useMemo(
    () => (selectedPost ? createDemoComments(selectedPost, handleCommentLike) : []),
    [selectedPost]
  );

  return (
    <div className={s['page-layout']}>
      <div className={s['feed-header']}>
        <div className={s['feed-header-left']}>
          <img 
            src={avatarUrl || FeedProfileFallback} 
            alt={`${displayName || '프로필'} 이미지`} />
        </div>
        <div className={s['feed-header-right']}>
          <div className={s['user-name']}>
            <span>{displayName || '사용자'}</span>
            <div className={s['user-profile-button']}>
              <OneWayButton
                content='프로필 편집'
                onClick={() => alert(`프로필 편집 버튼이 클릭되었습니다!`)}
                responsiveType='fluid'
                widthSizeType='sm'
                heightSizeType='xxs'
                colorType='dark'
              />
            </div>
          </div>

          <div className={s['user-description']}>
            <p>{bio ?? ''}</p>
          </div>
        </div>
      </div>

      <div className={s['insight']}>
        <button onClick={() => navigate(PATHS.insight)}>
          <span className={s['insight-left']}>
            <IoSunny />
            인사이트 보러가기
          </span>
          <IoMdArrowRoundForward />
        </button>
      </div>
      <div className={s['post-info']}>
        <div className={s['post-count']}>
          <span>{postsCount}</span>
          <span>건</span>
        </div>
        <div className={s['post-button']}>
          <OneWayButton
            content='+ 포스트 작성'
            onClick={() => alert(`포스트 버튼이 클릭되었습니다!`)}
            responsiveType='fluid'
            widthSizeType='sm'
            heightSizeType='xxxs'
            colorType='natural'
          />
        </div>
      </div>
      <div className={s['post-imges']}>
        {thumbs.map(t => (
          <img
            key={t.postId}
            src={t.thumbnailUrl}
            alt={`post-${t.postId}`}
            onClick={onThumbnailClick(t.postId)}
        />
        ))}
      </div>

      {selectedPost && (
        <FeedEditPopup
          open={true}
          onClose={() => setSelectedPost(null)}
          comments={popupComments}
          onCommentSubmit={handleSubmitComment(selectedPost.postId)}
          profileUrl={selectedPost.avatarUrl ?? avatarUrl ?? FeedProfileFallback}
          displayName={selectedPost.displayName || displayName}
          createdAt={selectedPost.createdAt}
          content={selectedPost.content}
          imageUrls={selectedPost.images}
          likesCount={selectedPost.likesCount}
          likedByMe={selectedPost.likedByMe}
          onLikeToggle={handlePostLike(selectedPost.postId)}
          onMoreClick={() => {/* TODO */}}
        />
      )}

      {/* invisible bottom trigger */}
      <div ref={sentinelRef} className={s['sentinel']} />
      {loading && <div className={s['loading']}>Loading…</div>}
    </div>
  );
}
