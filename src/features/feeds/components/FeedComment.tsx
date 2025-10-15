import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import styles from "./styles/FeedComment.module.css";

export type FeedCommentProps = {
  profileUrl: string;
  displayName: string;
  createdAt: string | Date;
  comment: string;
  likesCount: number | string;
  onLikeToggle: (value: boolean) => void;
};

export default function FeedComment({
  profileUrl,
  displayName,
  createdAt,
  comment,
  likesCount,
  onLikeToggle,
}: FeedCommentProps) {
  const [liked, setLiked] = useState(false);

  const label =
    typeof createdAt === "string"
      ? createdAt
      : new Intl.DateTimeFormat("ko", { hour: "2-digit", minute: "2-digit" })
          .format(createdAt);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    onLikeToggle(next);
  };

  return (
    <div className={styles.item}>
      <img className={styles.avatar} src={profileUrl} alt="" />
      <div className={styles.body}>
        <div className={styles.row1}>
          <strong className={styles.name}>{displayName}</strong>
          <span className={styles.time}>{label}</span>
        </div>
        <p className={styles.text}>{comment}</p>
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

