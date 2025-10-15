import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./styles/FeedEditPopup.module.css";
import { FiX, FiChevronLeft, FiChevronRight, FiHeart, FiMoreHorizontal } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import type { FeedCommentItem } from "./FeedCommentBottomPopup";
import FeedComment from "./FeedComment";

export type FeedEditPopupProps = {
  open: boolean;
  onClose: () => void;
  comments: FeedCommentItem[];
  onCommentSubmit: (comment: string) => void;

  profileUrl: string;
  displayName: string;
  createdAt: string | Date;

  content: string;
  imageUrls: string[];

  likesCount: number | string;
  likedByMe?: boolean | undefined;
  onLikeToggle: (liked: boolean) => void;

  onMoreClick?: () => void;
};

export default function FeedEditPopup({
  open,
  onClose,
  comments: items,
  onCommentSubmit,
  profileUrl,
  displayName,
  createdAt,
  content,
  imageUrls,
  likesCount,
  likedByMe,
  onLikeToggle,
  onMoreClick,
}: FeedEditPopupProps) {
  const [text, setText] = useState("");
  const [liked, setLiked] = useState(likedByMe ?? false);
  const [likeCountLocal, setLikeCountLocal] = useState<number>(Number(likesCount) || 0);
  const [slide, setSlide] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dateLabel =
    typeof createdAt === "string"
      ? createdAt
      : new Intl.DateTimeFormat("ko", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(
          createdAt
        );

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
    if (open) {
      setLiked(false);
      setLikeCountLocal(Number(likesCount) || 0);
      setSlide(0);
    }
  }, [open, likesCount]);

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
    const next = !liked;
    setLiked(next);
    setLikeCountLocal((c) => c + (next ? 1 : -1));
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
                src={profileUrl} 
                alt="" />
              <div className={styles.userMeta}>
                <strong className={styles.name}>
                  {displayName}
                </strong>
                <span className={styles.time}>
                  {dateLabel}
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.iconBtn}
                onClick={toggleLike} 
                aria-label={liked ? "좋아요 취소" : "좋아요"}>
                {liked ? <FaHeart className={styles.heartRed} /> : <FiHeart />}
                <span className={styles.likeNum}>
                  {likeCountLocal}
                </span>
              </button>
              <button 
                className={styles.iconBtn}
                onClick={onMoreClick}
                aria-label="더보기">
                <FiMoreHorizontal />
              </button>
              <button 
                className={styles.iconBtn}
                onClick={onClose}
                aria-label="닫기">
                <FiX />
              </button>
            </div>
          </header>

          <p className={styles.content}>{content}</p>

          <div className={styles.comments}>
            {items.map((it) => (
              <FeedComment key={it.id} {...it} />
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
