import styles from './styles/ProductReviewCard.module.css';
import { renderStars } from '../../books/util';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import type { ProductReview } from '../types';
import { formatKstDate } from '../util';

type Props = {
  review: ProductReview;                        
  onToggleLike: (id: string, next: boolean) => void;
  disabled?: boolean; // disable while refreshing 
};

export default function ProductReviewCard({ review, onToggleLike, disabled }: Props) {
  const handleClick = () => {
    onToggleLike(review.reviewId, !review.likedByMe); 
  };

  return (
    <div className={styles['review-card']}>
      <div className={styles['meta-row-1']}>
        <div className={styles['meta-left']}>
          <span>{review.displayName}</span>
          <span>|</span>
          <span>{formatKstDate(review.createdAt)}</span>
        </div>
        <div className={styles['meta-right']}>{renderStars(review.rating)}</div>
      </div>
      <div className={styles['meta-row-2']}>
        <div className={styles['meta-body-text']}>{review.body}</div>
      </div>
      <div className={styles['like-box']}>
        <button
          className={`${styles['like-icon']} ${review.likedByMe ? styles['is-liked'] : ''}`}
          type="button"
          onClick={handleClick}
          disabled={disabled}
        >
          {review.likedByMe ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
        </button>
        <div className={styles['like-count']}>{review.likesCount}</div>
      </div>
    </div>
  )
}
