import styles from "./styles/FeedCard.module.css";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useState } from "react";
import FeedImageSlider from "./FeedImageSlider";
import type { FeedImages } from "../types";
import DefaultProfile from "../../../assets/feed_profile.jpg"

type FeedCardProps = {
  profileImage?: string | null; // Profile image URL
  username: string; // User name
  timeAgo: string; // Upload time
  postImage: FeedImages[]; // Feed image URLs
  likes: number; // Number of likes
  comments: number; // Number of comments
  description: string; // Post text
};

export default function FeedCard({
  profileImage,
  username,
  timeAgo,
  postImage,
  likes,
  comments,
  description,
}: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const onWishlistToggled = () => {
  setIsLiked((prev) => {
    const next = !prev;
    console.log(next ? '좋아요' : '좋아요 해제');
    return next;
    });
  };

  const profileImgSrc = profileImage && profileImage.trim() !== '' ? profileImage : DefaultProfile;

  return (
    <div className={styles['feed-card']}>
      <div className={styles['feed-card-content']}>
        <div className={styles['feed-card-header']}>
          <img 
            className={styles['profile-image']}
            src={profileImgSrc} 
            alt={`${username}님의 프로필 사진`} />
          <div className={styles['user-info']}>
            <span className={styles['user-name']}>{username}</span>
            <span className={styles['time-ago']}>{timeAgo}</span>
          </div>
        </div>

        <div className={styles['feed-card-slider-wrapper']}>
          <FeedImageSlider items={postImage} />
        </div>

        <div className={styles['right-column']}>
          <div className={styles['feed-card-footer']}>
            <div className={styles['feed-actions']}>
              <span>
                {isLiked ? (
                  <IoMdHeart
                    color="#f73936ff"
                    onClick={onWishlistToggled} />
                ) : (
                  <IoMdHeartEmpty
                    onClick={onWishlistToggled} />
                )}
                {likes}
              </span>
              <span>
                <IoChatbubblesOutline /> 
              {comments}
              </span>
            </div>
            <p className={styles['feed-description']}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
