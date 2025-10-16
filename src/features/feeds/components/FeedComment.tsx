import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import styles from "./styles/FeedComment.module.css";
import { timeAgo } from '../util';
import FeedProfileFallback from '../../../assets/feed_profile.jpg';

export type FeedCommentProps = {
  commentId: string;
  displayName: string | null;
  avatarUrl: string | null;          
  body: string;
  createdAt: string;          
  likesCount: number | string;
  likedByMe: boolean;
  onLikeToggle: (liked: boolean) => void;
};

export default function FeedComment({
  displayName, 
  avatarUrl, 
  body, 
  createdAt,
  likesCount, 
  likedByMe, 
  onLikeToggle,
}: FeedCommentProps) {
  const [liked, setLiked] = useState<boolean>(!!likedByMe);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    onLikeToggle(next);
  };

  return (
    <div className={styles.item}>
      <img className={styles.avatar} src={avatarUrl || FeedProfileFallback} alt="" />
      <div className={styles.body}>
        <div className={styles.row1}>
          <strong className={styles.name}>{displayName}</strong>
          <span className={styles.time}>{timeAgo(createdAt)}</span>
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
