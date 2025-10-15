import styles from "./styles/FeedCard.module.css";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useState } from "react";
import FeedImageSlider from "./FeedImageSlider";
import type { FeedImages } from "../types";
import DefaultProfile from "../../../assets/feed_profile.jpg";

type FeedCardProps = {
  profileImgUrl?: string | null;
  displayName: string;
  timeAgo: string;
  postImgUrls: FeedImages[];
  likesCount: number;
  commentsCount: number;
  content: string;
  onLikeToggled: (liked: boolean) => void;
  onCommentClick: () => void;
};

export default function FeedCard({
  profileImgUrl: profileImage,
  displayName: username,
  timeAgo,
  postImgUrls: postImage,
  likesCount: likes,
  commentsCount: comments,
  content: description,
  onLikeToggled,
  onCommentClick
}: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    const next = !isLiked;
    setIsLiked(next);
    onLikeToggled(next);
  };

  const profileImgSrc =
    profileImage && profileImage.trim() !== "" ? profileImage : DefaultProfile;

  return (
    <article className={styles["fc-card"]}>
      <div className={styles["fc-content"]}>
        <header className={styles["fc-header"]}>
          <img
            className={styles["fc-avatar"]}
            src={profileImgSrc}
            alt={`${username}님의 프로필 사진`}
          />
          <div className={styles["fc-meta"]}>
            <span className={styles["fc-name"]}>{username}</span>
            <span className={styles["fc-time"]}>{timeAgo}</span>
          </div>
        </header>

        <div className={styles["fc-media"]}>
          <FeedImageSlider items={postImage} />
        </div>

        <section className={styles["fc-side"]}>
          <div className={styles["fc-footer"]}>
            <div className={styles["fc-actions"]}>
              <button
                type="button"
                className={`${styles["fc-action"]} ${isLiked ? styles["is-liked"] : ""}`}
                aria-pressed={isLiked}
                aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                onClick={handleLikeToggle}>
                {isLiked ? <IoMdHeart /> : <IoMdHeartEmpty />}
                <span className={styles["fc-count"]}>{likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button
                type="button"
                className={styles["fc-action"]}
                aria-label="댓글 보기"
                onClick={onCommentClick}>
                <IoChatbubblesOutline />
                <span className={styles["fc-count"]}>{comments}</span>
              </button>
            </div>

            <p className={styles["fc-desc"]}>{description}</p>
          </div>
        </section>
      </div>
    </article>
  );
}

