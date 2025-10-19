import { useSession } from "../../../hooks/useSession";
import { useEffect, useState, useRef } from "react";
import { FiHeart, FiMoreHorizontal, FiTrash2, FiFlag } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import styles from "./styles/FeedComment.module.css";
import { timeAgo } from '../util';
import FeedProfileFallback from '../../../assets/feed_profile.jpg';
import { FeedService } from "../services/FeedService";

export type FeedCommentProps = {
  commentId: string;
  id: string; 
  displayName: string | null;
  avatarUrl: string | null;          
  body: string;
  createdAt: string;          
  likesCount: number | string;
  likedByMe: boolean;
  onLikeToggle: (liked: boolean) => void;
  onDeleted?: (commentId: string) => void;
};

export default function FeedComment({
  commentId,
  displayName, 
  id: authorId,
  avatarUrl, 
  body, 
  createdAt,
  likesCount, 
  likedByMe, 
  onLikeToggle,
  onDeleted,
}: FeedCommentProps) {
  const [liked, setLiked] = useState<boolean>(!!likedByMe);
  useEffect(() => { setLiked(!!likedByMe); }, [likedByMe]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState<"delete" | "report" | null>(null);

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

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    onLikeToggle(next);
  };

  const { userId } = useSession.getState();
  const byMe = !!userId && userId === authorId;

  const handleDelete = async () => {
    if (pending) { return; }
    setPending("delete");
    try {
      await FeedService.deleteComment(commentId);
      onDeleted?.(commentId);                  
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
    } finally {
      setPending(null);
      setMenuOpen(false);
    }
  };

  const handleReport = async () => {
    if (pending) { return; }
    setPending("report");
    try {
      // TODO
      await Promise.resolve();
    } catch (e) {
      console.error(e);
      alert("신고 실패");
    } finally {
      setPending(null);
      setMenuOpen(false);
    }
  };

  return (
    <div className={styles.item}>
      <img className={styles.avatar} src={avatarUrl || FeedProfileFallback} alt="" />
      <div className={styles.body}>
        <div className={styles.row1}>
          <strong className={styles.name}>{displayName}</strong>
          <span className={styles.time}>{timeAgo(createdAt)}</span>
          {!!userId && (
            <div className={styles.moreWrap} ref={menuRef}>
              <button
                className={styles.iconBtn}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="더보기"
                onClick={() => setMenuOpen(v => !v)}
              >
                <FiMoreHorizontal />
              </button>

              {menuOpen && (
                <div className={styles.menu} role="menu">
                  {byMe ? (
                    <button
                      className={styles.menuItemDanger}
                      role="menuitem"
                      onClick={handleDelete}
                      disabled={pending === "delete"}
                      title="삭제"
                    >
                      <FiTrash2 className={styles.trashIcon} />
                      삭제
                    </button>
                  ) : (
                    <button
                      className={styles.menuItemDanger}
                      role="menuitem"
                      onClick={handleReport}
                      disabled={pending === "report"}
                      title="신고"
                    >
                      <FiFlag className={styles.trashIcon} />
                      신고
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
  
        <p className={styles.text}>{body}</p>
      </div>
      <button 
        className={`${styles.like} ${liked ? styles.liked : ""}`}
        onClick={toggle}
        aria-label={liked ? "좋아요 취소" : "좋아요"}>
        {liked ? <FaHeart /> : <FiHeart />}
      </button>
      <span className={styles.count}>{likesCount}</span>
    </div>
  );
}
