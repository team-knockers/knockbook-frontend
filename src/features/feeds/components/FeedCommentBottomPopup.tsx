import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./styles/FeedCommentBottomPopup.module.css";
import type { FeedPostComment } from '../types';
import FeedComment from "./FeedComment";
import { FiX } from "react-icons/fi";

export type FeedCommentBottomPopupProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  comments: FeedPostComment[];
  onCommentSubmit: (comment: string) => void;
  heightPct?: number; // 30~95, default 70
};

export default function FeedCommentBottomPopup({
  open,
  onClose,
  title,
  comments: items,
  onCommentSubmit,
  heightPct = 70,
}: FeedCommentBottomPopupProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [localItems, setLocalItems] = useState<FeedPostComment[]>(items);
  useEffect(() => { if (open) setLocalItems(items); }, [open, items]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const onBackdropPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const submitComment = () => {
    const v = text.trim();
    if (!v) return;
    onCommentSubmit(v);
    setText("");
  };

  const handleLikeToggle = (commentId: string) => (liked: boolean) => {
    setLocalItems(prev =>
      prev.map(it =>
        it.commentId === commentId
          ? { ...it, likesCount: Number(it.likesCount) + (liked ? 1 : -1), likedByMe: liked }
          : it
      )
    );
  };

  if (!open) { 
    return null;
  }

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onPointerDown={onBackdropPointerDown}>
      <div
        className={styles.sheet}
        style={{ ["--sheet-h" as any]: `${Math.min(Math.max(heightPct, 30), 95)}dvh` }}>
        <div className={styles.grip} aria-hidden />
        <header className={styles.header}>
          <h3 className={styles.title}>
            {title}
          </h3>
          <button 
            className={styles.close} 
            onClick={onClose} 
            aria-label="닫기">
              <FiX size={13}/>
          </button>
        </header>

        <div 
          className={styles.content}
          onPointerDown={e => e.stopPropagation()}>
          {localItems.map((it) => (
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
              onLikeToggle={handleLikeToggle(it.commentId)}
              onDeleted={(cid) => setLocalItems(prev => prev.filter(c => c.commentId !== cid))}
            />
          ))}
        </div>

        <div 
          className={styles.footer}
          onPointerDown={e => e.stopPropagation()}>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="댓글을 달아주세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitComment()}/>
          <button 
            className={styles.submit} 
            onClick={submitComment}>
            작성완료
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
