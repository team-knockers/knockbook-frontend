import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import s from './FeedProfilePage.module.css';
import FeedButton from '../../features/feeds/components/FeedButton';
import { IoSunny, IoGrid, IoGridOutline, IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { IoMdArrowRoundForward } from "react-icons/io";
import { PATHS } from '../../routes/paths';
import { FeedService } from '../../features/feeds/services/FeedService';
import type { FeedPostComment, FeedPost, FeedProfileThumbnail } from '../../features/feeds/types';
import FeedProfileFallback from '../../assets/feed_profile.jpg';
import FeedEditPopup from '../../features/feeds/components/FeedEditPopup';
import FeedPostCreateModal from '../../features/feeds/components/FeedPostCreateModal';
import TwoButtonPopup from '../../components/overlay/TwoButtonPopup';
import SimplePopup from '../../components/overlay/SimplePopup';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import EditProfileForm from '../../features/feeds/components/EditProfleForm';
import { ensureUser } from '../../shared/authReady';

const PAGE_SIZE = 3; // number of posts per request
const NUM_MAX_FILES = 3;

type Tab = 'post' | 'save';

export default function FeedProfilePage() {

  // current tab 
  const [tab, setTab] = useState<Tab>('post');

  // profile area (user)
  const [displayName, setDisplayName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);

  // post tab states
  const [postsCount, setPostsCount] = useState<number>(0);
  const [thumbsPost, setThumbsPost] = useState<FeedProfileThumbnail[]>([]);
  const [nextAfterPost, setNextAfterPost] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);

  // save tab states
  const [savesCount, setSavesCount] = useState<number>(0);
  const [thumbsSave, setThumbsSave] = useState<FeedProfileThumbnail[]>([]);
  const [nextAfterSave, setNextAfterSave] = useState<string | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);

  // common
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState<string|null>(null);

  const [selectedFeed, setSelectedFeed] = useState<FeedPost | null>(null);
  const [selectedComments, setSelectedComments] = useState<FeedPostComment[] | null>(null);

  const aliveRef = useRef(true);
  useEffect(() => () => { aliveRef.current = false; }, []);

  const refreshMe = useCallback(async () => {
    const me = await ensureUser();
    if (!aliveRef.current) { return; }
    startTransition(() => {
      setDisplayName(me.displayName ?? "");
      setAvatarUrl(me.avatarUrl ?? null);
      setBio(me.bio ?? null);
    });
  }, []);

  // ===== User profile first load =====
  useEffect(() => {
    (async () => {
      try { await refreshMe(); }
      catch (e) { console.error(e); }
    })();
  }, [refreshMe]);

  // ===== Initial load for POST tab (default) =====
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingPost(true);
      try {
        const r = await FeedService.getProfilePostThumbnails(PAGE_SIZE, null);
        if (!alive) return;
        setPostsCount(r.postsCount ?? 0);
        setThumbsPost(r.profileThumbnails ?? []);
        setNextAfterPost(r.nextAfter ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoadingPost(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // ===== Load initial for SAVE tab when first switched =====
  useEffect(() => {
    if (tab !== 'save') return;
    if (thumbsSave.length > 0 || loadingSave) return;

    let alive = true;
    (async () => {
      setLoadingSave(true);
      try {
        const r = await FeedService.getProfileSavedThumbnails(PAGE_SIZE, null);
        if (!alive) return;
        setSavesCount(r.postsCount ?? 0);
        setThumbsSave(r.profileThumbnails ?? []);
        setNextAfterSave(r.nextAfter ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoadingSave(false);
      }
    })();

    return () => { alive = false; };
  }, [tab]);

  // ===== Load more depending on tab =====
  const loadMore = async () => {
    if (tab === 'post') {
      if (loadingPost || !nextAfterPost) return;
      setLoadingPost(true);
      try {
        const r = await FeedService.getProfilePostThumbnails(PAGE_SIZE, nextAfterPost);
        setThumbsPost(prev => [...prev, ...(r.profileThumbnails ?? [])]);
        setNextAfterPost(r.nextAfter ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPost(false);
      }
    } else {
      if (loadingSave || !nextAfterSave) return;
      setLoadingSave(true);
      try {
        const r = await FeedService.getProfileSavedThumbnails(PAGE_SIZE, nextAfterSave);
        setThumbsSave(prev => [...prev, ...(r.profileThumbnails ?? [])]);
        setNextAfterSave(r.nextAfter ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSave(false);
      }
    }
  };

  // ===== observe sentinel (react on current tab) =====
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { loadMore(); } },
      { root: null, rootMargin: '200px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();

    // tab, and each tab's paging/loads control when to re-bind
  }, [tab, nextAfterPost, nextAfterSave, loadingPost, loadingSave]);

  // ===== Create post handler (post tab only UI shows) =====
  async function handleShare({ text, files }: { text: string; files: File[] }) {
    try {
      const created = await FeedService.createPost(text, files);
      setCreateOpen(false);
      setThumbsPost(prev => [{ postId: created.postId, thumbnailUrl: created.thumbnailUrl }, ...prev]);
      setPostsCount(p => p + 1);
    } catch (e) {
      console.error(e);
      alert('업로드 실패');
    }
  }

  // ===== Thumbnail click → open modal =====
  const onThumbnailClick = (postId: string) => async () => {
    try {
      const res = await FeedService.getFeedPostWithCommentList(postId);
      setSelectedFeed(res.feedPost);
      setSelectedComments(res.feedComments);
    } catch (e) {
      console.error(e);
    }
  };

  // ===== Comment submit in modal =====
  const handleSubmitComment = (postId: string) => {
    return async (text: string) => {
      const v = text.trim();
      if (!v) return;

      try {
        const created = await FeedService.createComment(postId, v);
        setSelectedComments(prev => (prev ? [created, ...prev] : [created]));
        setSelectedFeed(prev =>
          prev && prev.postId === postId
            ? { ...prev, commentsCount: prev.commentsCount + 1 }
            : prev
        );
      } catch (e) {
        console.error(e);
      }
    };
  };

  const handleDeleteComment = (postId: string) => (commentId: string) => {
    setSelectedComments(prev =>
      prev ? prev.filter(c => c.commentId !== commentId) : prev
    );

    setSelectedFeed(prev =>
      prev && prev.postId === postId
        ? { ...prev, commentsCount: prev.commentsCount - 1 }
        : prev
    );
  };

  // ===== Like toggle in modal =====
  const handlePostLike =
    (postId: string) =>
    (next: boolean) => {
      if (next) { FeedService.likePost(postId); }
      else { FeedService.unlikePost(postId); }

      setSelectedFeed(prev =>
        prev && prev.postId === postId
          ? { ...prev, likedByMe: next, likesCount: prev.likesCount + (next ? 1 : -1) }
          : prev
      );
    };

  // ===== Delete confirm in modal =====
  const handleConfirmDelete = async () => {
    if (!selectedFeedId) return;
    try {
      await FeedService.deletePost(selectedFeedId);
      setThumbsPost(prev => prev.filter(t => t.postId !== selectedFeedId));
      setThumbsSave(prev => prev.filter(t => t.postId !== selectedFeedId));
      setPostsCount(p => Math.max(0, p - 1));
    } catch (e) {
      alert('삭제 실패');
      console.error(e);
    } finally {
      setConfirmOpen(false);
      setSelectedFeedId(null);
      setSelectedFeed(null);
      setSelectedComments(null);
    }
  };

  // ===== simple tab buttons (icons) =====
  const TabButtons = () => {
    const isPost = tab === 'post';
    const isSave = tab === 'save';
    return (
      <div className={s['tab-menu']}>
        <button
          type="button"
          className={`${s['tab-link']} ${isPost ? s['active'] : ''}`}
          onClick={() => setTab('post')}
        >
          <span className={s['icon']}>
            {isPost ? <IoGrid /> : <IoGridOutline />}
          </span>
          <span className={s['label']}>작성된 게시물</span>
        </button>

        <button
          type="button"
          className={`${s['tab-link']} ${isSave ? s['active'] : ''}`}
          onClick={() => setTab('save')}
        >
          <span className={s['icon']}>
            {isSave ? <IoBookmark /> : <IoBookmarkOutline />}
          </span>
          <span className={s['label']}>저장된 게시물</span>
        </button>
      </div>
    );
  };

  // ===== Render =====
  const isPost = tab === 'post';
  const thumbs = isPost ? thumbsPost : thumbsSave;
  const loading = isPost ? loadingPost : loadingSave;
  const count = isPost ? postsCount : savesCount;

  // profile popup helpers
  const isMobile = useMediaQuery('(max-width: 1023.98px)');
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

  return (
    <>
      <div className={s['page-layout']}>
        {/* profile popup  */}
        <SimplePopup
          open={isEditProfilePopupOpen}
          onClose={() => setIsEditProfilePopupOpen(false)}
          title="프로필 편집"
          fullScreen={isMobile}
          noBodyPadding
          showCloseButton>
          <EditProfileForm
            onSubmit={async () => {
              setIsEditProfilePopupOpen(false);
              try { await refreshMe(); } 
              finally {
                setIsEditProfilePopupOpen(false);
              }
            }}/>
        </SimplePopup>

        {/* Header */}
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
                <FeedButton
                  content='프로필 편집'
                  onClick={() => setIsEditProfilePopupOpen(true)}
                />
              </div>
            </div>
            <div className={s['user-description']}>
              <p>{bio ?? ''}</p>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className={s['insight']}>
          <button onClick={() => navigate(PATHS.insight)}>
            <span className={s['insight-left']}>
              <IoSunny />
              인사이트 보러가기
            </span>
            <IoMdArrowRoundForward />
          </button>
        </div>

        {/* Fake two-tab buttons (no router) */}
        <TabButtons />

        {/* Count + (post only) create button */}
        <div className={s['post-info']}>
          <div className={s['post-count']}>
            <span>{count}</span>
            <span>건</span>
          </div>
          <div className={s['post-button']}>
            {isPost ? (
              <FeedButton
                content='+ 포스트 작성'
                onClick={() => setCreateOpen(true)}
              />
            ) : (
              <div style={{ height: 30 }} /> 
            )}
          </div>
        </div>

        {/* Thumbs grid */}
        <div className={s['post-imges']}>
          {thumbs.map(t => (
            <div key={t.postId} className={s['thumb']} onClick={onThumbnailClick(t.postId)}>
      <img src={t.thumbnailUrl} alt={`${tab}-${t.postId}`} />
    </div>
          ))}
        </div>

        {/* infinite scroll sentinel */}
        <div ref={sentinelRef} className={s['sentinel']} />
        {loading && <div className={s['loading']}>Loading…</div>}
      </div>

      {/* Post view modal */}
      {selectedFeed && (
        <FeedEditPopup
          open={!!selectedFeed}
          onClose={() => { setSelectedFeed(null); setSelectedComments(null); }}
          comments={selectedComments ?? []}
          onCommentSubmit={handleSubmitComment(selectedFeed.postId)}
          avatarUrl={selectedFeed.avatarUrl || avatarUrl || FeedProfileFallback}
          displayName={selectedFeed.displayName || displayName}
          createdAt={selectedFeed.createdAt}
          content={selectedFeed.content}
          imageUrls={selectedFeed.images}
          likesCount={selectedFeed.likesCount}
          likedByMe={selectedFeed.likedByMe}
          onLikeToggle={handlePostLike(selectedFeed.postId)}
          showMore
          onDeleteClick={() => {
            setConfirmOpen(true);
            setSelectedFeedId(selectedFeed!.postId);
          }}
          onCommentDeleted={handleDeleteComment(selectedFeed.postId)} 
        />
      )}

      {/* Create modal (post tab only) */}
      <FeedPostCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onShare={handleShare}
        displayName={displayName}
        avatarUrl={avatarUrl ?? ''}
        maxFiles={NUM_MAX_FILES}
      />

      {/* Delete confirm */}
      {confirmOpen && (
        <TwoButtonPopup
          title="정말 삭제하시겠습니까?"
          description="이 작업은 되돌릴 수 없습니다."
          cancelText="취소"
          confirmText="삭제"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
