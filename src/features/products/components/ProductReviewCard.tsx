import styles from './styles/ProductReviewCard.module.css';
import { renderStars } from '../../books/util';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import type { ProductReview } from '../types';

type Props = {
  item: ProductReview;                        
  onToggleLike: (id: string, next: boolean) => void;
};

export default function ProductReviewCard({ item, onToggleLike }: Props) {
  const handleClick = () => onToggleLike(item.reviewId, !item.liked); 

  return (
    <div className={styles['review-card']}>
      <div className={styles['meta-row-1']}>
        <div className={styles['meta-left']}>
          <span>{item.userId}</span>
          <span>|</span>
          <span>{item.createdAt}</span>
        </div>
        <div className={styles['meta-right']}>{renderStars(item.rating)}</div>
      </div>
      <div className={styles['meta-row-2']}>
        <div className={styles['meta-body-text']}>{item.content}</div>
      </div>
      <div className={styles['like-box']}>
        <button
          className={`${styles['like-icon']} ${item.liked ? styles['is-liked'] : ''}`}
          type="button"
          onClick={handleClick}
        >
          {item.liked ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
        </button>
        <div className={styles['like-count']}>{item.likesCount}</div>
      </div>
    </div>
  )
}
