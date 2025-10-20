import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./styles/FeedEditPopup.module.css";
import { FiX, FiChevronLeft, FiChevronRight, FiHeart, FiMoreHorizontal, FiTrash2 } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import FeedComment from "./FeedComment";
import type { FeedPostComment } from "../types";
import FeedProfileFallback from '../../../assets/feed_profile.jpg';
import { FeedService } from "../services/FeedService"; 
import { timeAgo } from "../util";

export type FeedEditPopupProps = {
  open: boolean;
  onClose: () => void;
  comments: FeedPostComment[];
  onCommentSubmit: (comment: string) => void;

  avatarUrl: string | null;
  displayName: string;
  createdAt: string;

  content: string;
  imageUrls: string[];

  likesCount: number;
  likedByMe: boolean;
  onLikeToggle: (liked: boolean) => void;
  showMore?: boolean;
  onDeleteClick?: () => void;
};

export default function FeedEditPopup({
  open,
  onClose,
  comments: items,
  onCommentSubmit,
  avatarUrl,
  displayName,
  createdAt,
  content,
  imageUrls,
  likesCount,
  likedByMe,
  onLikeToggle,
  showMore = false,
  onDeleteClick, 
}: FeedEditPopupProps) {
  const [text, setText] = useState("");
  const [isLiked, setIsLiked] = useState<boolean>(!!likedByMe);
  const [likeCount, setLikeCount] = useState<number>(likesCount);
  const [slide, setSlide] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localComments, setLocalComments] = useState(items);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) { document.addEventListener('mousedown', h); }
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  useEffect(() => { 
    if (open) setLocalComments(items); 
  }, [open, items]);

  const handleCommentLike = (commentId: string) => (next: boolean) => {
    if (next) FeedService.likeComment(commentId);
    else FeedService.unlikeComment(commentId);

    setLocalComments(prev =>
      prev.map(it =>
        it.commentId === commentId
          ? { ...it, likedByMe: next, likesCount: Number(it.likesCount) + (next ? 1 : -1) }
          : it
      )
    );
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setIsLiked(!!likedByMe);
    setLikeCount(Number(likesCount) || 0);
    setSlide(0);
  }, [open, likedByMe, likesCount]);

  const onBackdropPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const submitComment = () => {
    const v = text.trim();
    if (!v) return;
    onCommentSubmit(v);
    setText("");
  };

  const toggleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount(c => c + (next ? 1 : -1));
    onLikeToggle(next);
  };

  const nextSlide = () => setSlide((s) => (imageUrls.length ? (s + 1) % imageUrls.length : 0));
  const prevSlide = () => setSlide((s) => (imageUrls.length ? (s - 1 + imageUrls.length) % imageUrls.length : 0));

  const hasImages = Array.isArray(imageUrls) && imageUrls.length > 0;

  useEffect(() => {
    if (!hasImages) return;
    if (slide >= imageUrls.length) setSlide(0);
  }, [hasImages, imageUrls.length, slide]);

  const curr = useMemo<string>(() => {
    if (!hasImages) return "";
    const idx = Math.min(Math.max(slide, 0), imageUrls.length - 1);
    return imageUrls[idx] ?? "";
  }, [hasImages, imageUrls, slide]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onPointerDown={onBackdropPointerDown}>
      <div 
        className={styles.modal} 
        onPointerDown={(e) => e.stopPropagation()}>
        <section 
          className={styles.media}
          style={hasImages ? ({ ["--media-bg" as any]: `url("${curr}")` } as React.CSSProperties) : undefined}>
          <div className={styles.mobileTopBar}>
            <button className={styles.mobileCloseBtn} onClick={onClose} aria-label="닫기">
              <FiX />
            </button>
          </div>
          {hasImages ? (
            <div className={styles.mediaStage}>
              <img
                className={styles.mediaImg} 
                src={curr}
                alt="" />
              {imageUrls.length > 1 && (
                <>
                  <button 
                    className={`${styles.nav} ${styles.prev}`} 
                    onClick={prevSlide} 
                    aria-label="이전">
                    <FiChevronLeft />
                  </button>
                  <button 
                    className={`${styles.nav} ${styles.next}`} 
                    onClick={nextSlide} 
                    aria-label="다음">
                    <FiChevronRight />
                  </button>
                  <div 
                    className={styles.dots} 
                    aria-hidden>
                    {imageUrls.map((_, i) => (
                      <span
                        key={i}
                        className={`${styles.dot} ${i === slide ? styles.active : ""}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.noMedia}>
              <span>이미지가 없습니다</span>
            </div>
          )}
        </section>

        <section className={styles.sidebar}>
          <header className={styles.header}>
            <div className={styles.user}>
              <img 
                className={styles.avatar} 
                src={avatarUrl || FeedProfileFallback} 
                alt="" />
              <div className={styles.userMeta}>
                <strong className={styles.name}>
                  {displayName}
                </strong>
                <span className={styles.time}>
                  {timeAgo(createdAt)}
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.iconBtn}
                onClick={toggleLike} 
                aria-label={isLiked ? "좋아요 취소" : "좋아요"}>
                {isLiked ? <FaHeart className={styles.heartRed} /> : <FiHeart />}
                <span className={styles.likeNum}>
                  {likeCount}
                </span>
              </button>
              {showMore && (
                <div className={styles.moreWrap} ref={menuRef}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => setMenuOpen(v => !v)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    aria-label="더보기">
                    <FiMoreHorizontal />
                  </button>

                  {menuOpen && (
                    <div className={styles.menu} role="menu">
                      <button
                        className={styles.menuItemDanger}
                        role="menuitem"
                        onClick={() => { setMenuOpen(false); onDeleteClick?.(); }}>
                        <FiTrash2 className={styles.trashIcon} />
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>

          <p className={styles.content}>{content}</p>

          <div className={styles.comments}>
            {localComments.map((it) => (
              <FeedComment
                key={it.commentId}
                id={it.userId}
                commentId={it.commentId}
                displayName={it.displayName}
                avatarUrl={it.avatarUrl}
                body={it.body}
                createdAt={it.createdAt}
                likesCount={it.likesCount}
                likedByMe={it.likedByMe}
                onLikeToggle={handleCommentLike(it.commentId)}
                onDeleted={(cid) => setLocalComments(prev => prev.filter(c => c.commentId !== cid))}
              />
            ))}
          </div>

          <div className={styles.footer}>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="댓글을 달아주세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
            />
            <button className={styles.submit} onClick={submitComment}>
              작성완료
            </button>
          </div>
        </section>
      </div>
    </div>,
    document.body
  );
}
