import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import s from './FeedProfilePage.module.css';
import OneWayButton from '../../components/forms/OneWayButton';
import { IoSunny } from "react-icons/io5";
import { IoMdArrowRoundForward } from "react-icons/io";
import { PATHS } from '../../routes/paths';
import { FeedService } from '../../features/feeds/services/FeedService';
import type { FeedProfileThumbnail } from '../../features/feeds/types';
import FeedProfileFallback from '../../assets/feed_profile.jpg';

const PAGE_SIZE = 3; // number of posts per request

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
          <img key={t.postId} 
          src={t.thumbnailUrl} 
          alt={`post-${t.postId}`} 
        />
        ))}
      </div>

      {/* invisible bottom trigger */}
      <div ref={sentinelRef} className={s['sentinel']} />
      {loading && <div className={s['loading']}>Loading…</div>}
    </div>
  );
}
