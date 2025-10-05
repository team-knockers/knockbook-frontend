import styles from './styles/ProductReviewCard.module.css';
import { renderStars } from '../../books/util';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type Props = {
  id: string; // Review identifier (used for toggling)
  userId: string;
  createdAt: string;     
  rating: number;
  content: string;
  likesCount: number;
  liked: boolean;  // Whether current user liked this review 
  onToggleLike: (id: string, next: boolean) => void; // Parent handler (optimistic update + API later)
};

export default function ProductReviewCard({
  id, userId, createdAt, rating, content, likesCount, liked, onToggleLike
}: Props) {
  // Local click handler : 
  // - Sends the next state (invert current) to parent
  // - Parent update state (and later calls API / rollback on failure)
  const handleClick = () => onToggleLike(id, !liked);

  return (
    <div className={styles['review-card']}>
      <div className={styles['meta-row-1']}>
        <div className={styles['meta-left']}>
          <span>{userId}</span>
          <span>|</span>
          <span>{createdAt}</span>
        </div>
        <div className={styles['meta-right']}>{renderStars(rating)}</div>
      </div>
      <div className={styles['meta-row-2']}>
        <div className={styles['meta-body-text']}>{content}</div>
      </div>
      <div className={styles['like-box']}>
        <button
          className={`${styles['like-icon']} ${liked ? styles['is-liked'] : ''}`}
          type="button"
          onClick={handleClick}
        >
          {liked ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
        </button>
        <div className={styles['like-count']}>{likesCount}</div>
      </div>
    </div>
  )
}
