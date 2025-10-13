import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { formatDateToDot, isoToLocalYmd, renderStars } from '../util';
import styles from './styles/BookReviewListItem.module.css';
import { useState } from 'react';
import type { BookReview } from '../types';

type BookReviewListItemProps = {
  reviewData: BookReview;
  externalProcessing?: boolean;
  onToggleLike: (reviewId: string, newLiked: boolean) => Promise<void>;
};

export default function BookReviewListItem({
  reviewData,
  externalProcessing = false,
  onToggleLike
}: BookReviewListItemProps) {
  const [isReviewLiked, setIsReviewLiked] = useState(reviewData.likedByMe);
  const [likesCount, setLikesCount] = useState(reviewData.likesCount);
  const [isProcessing, setIsProcessing] = useState(false); // prevent duplicate executions
  
  const isPurchase = reviewData.transactionType.toLowerCase() === 'purchase';

  const handleClick = async () => {
    if (isProcessing || externalProcessing) {
      return;
    }
    setIsProcessing(true);

    const prevLiked = isReviewLiked; // capture previous liked state
    const prevCount = likesCount; // capture previous like count
    const nextLiked = !prevLiked; // flip liked state

    // Optimistic update
    setIsReviewLiked(nextLiked);
    setLikesCount(prev => Math.max(0, prev + (nextLiked ? 1 : -1)));

    try {
      // Handled by parent
      await onToggleLike(reviewData.id, nextLiked);

    } catch {
      // rollback on failure
      setIsReviewLiked(prevLiked);
      setLikesCount(prevCount);

    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles['review-list-item']}>
      <div className={styles['item-header']}>
        <div className={styles['meta-left']}>
          <div className={isPurchase ? styles['badge-purchase'] : styles['badge-rental']}>
            {isPurchase ? '구매' : '대여'}
          </div>
          <div className={styles['meta-info']}>
            <span className={styles['nickname']}>{reviewData.displayName}</span>
            <span className={styles['separator']} aria-hidden="true">|</span>

            <span className={styles['date']}>{formatDateToDot(isoToLocalYmd(reviewData.createdAt))}</span>
          </div>
        </div>
        <div className={styles['meta-right']}>
          <div className={styles['star-score']}>{renderStars(reviewData.rating)}</div>
          <div className={styles['badge-mbti']}>
            {reviewData.mbti}
          </div>
        </div>
      </div>
      <div className={styles['review-text']}>
        {reviewData.content}
      </div>
      <button
        className={styles['review-like']}
        onClick={handleClick}
        aria-pressed={isReviewLiked}
        disabled={isProcessing || externalProcessing}
      >
        {isReviewLiked ? (
          <>
            <IoMdHeart className={styles['is-liked-icon']}/>
            <span className={styles['is-liked-count']}>
              {likesCount}
            </span>
          </>
        ) : (
          <>
            <IoMdHeartEmpty className={styles['not-liked-icon']}/>
            <span className={styles['not-liked-count']}>
              {likesCount}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
