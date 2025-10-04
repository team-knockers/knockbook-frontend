import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { formatDateToDot, renderStars } from '../util';
import styles from './styles/BookReviewListItem.module.css';
import { useState } from 'react';
import type { BookReview } from '../types';
import { toast } from 'react-toastify';

// TODO. BookDetailsReviewsPage 완료 시 onReviewLikeToggled 로직 밖으로 뺼 것
type BookReviewListItemProps = {
  reviewData: BookReview
};

export default function BookReviewListItem({
  reviewData
}: BookReviewListItemProps) {
  const [isReviewLiked, setIsReviewLiked] = useState(reviewData.likedByMe);
  const [likeCount, setLikeCount] = useState(reviewData.likeCount);
  const [isProcessing, setIsProcessing] = useState(false); // prevent duplicate executions
  
  const isPurchase = reviewData.transactionType.toLowerCase() === 'purchase';

   /* This is a sample code for test */
  const toastLikeAdd = (reviewId: string) => toast(`좋아요 추가 (id: ${reviewId})`);
  const toastLikeRemove = (reviewId: string) => toast(`좋아요 삭제 (id: ${reviewId})`);
  const toastRefreshLike = (reviewId: string) => toast(`좋아요 갱신 요청 (id: ${reviewId})`);
  const toastError = (msg: string) => toast.error(msg);

  const onReviewLikeToggled = async (reviewId: string) => {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);

    const prevLiked = isReviewLiked; // capture previous liked state
    const prevLikeCount = likeCount; // capture previous like count

    // Optimistic update
    const newLiked = !prevLiked; // flip liked state
    setIsReviewLiked(newLiked);
    setLikeCount(prevLikeCount + (newLiked ? 1 : -1));

    try {
      if (newLiked) {
        toastLikeAdd(reviewId);
      } else {
        toastLikeRemove(reviewId);
      }
      toastRefreshLike(reviewId);

    } catch (err) {
      // rollback on failure
      setIsReviewLiked(prevLiked);
      setLikeCount(prevLikeCount);
      toastError('요청 처리 중 오류가 발생했습니다');
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
            {`${reviewData.nickname} | ${formatDateToDot(reviewData.createdAt)}`}
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
      <div 
        className={styles['review-like']}
        onClick={() => onReviewLikeToggled(reviewData.id)}
      >
        {isReviewLiked ? (
          <>
            <IoMdHeart className={styles['is-liked-icon']}color="#f73936ff"/>
            <span className={styles['is-liked-count']}>
              {likeCount}
            </span>
          </>
        ) : (
          <>
            <IoMdHeartEmpty className={styles['not-liked-icon']}/>
            <span className={styles['not-liked-count']}>
              {likeCount}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
