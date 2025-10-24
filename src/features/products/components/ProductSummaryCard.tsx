import styles from './styles/ProductSummaryCard.module.css';
import { FiStar, FiShoppingCart } from "react-icons/fi";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

type Props = {
  imageSrc: string;
  name: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  wishedByMe: boolean;
  onClick: () => void;
  onWishButtonClick: () => void;
  onCartButtonClick: () => void;
}

const formatWon = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export default function ProductSummaryCard({
  imageSrc, name, price, salePrice, rating, reviewCount, wishedByMe, onClick,
  onWishButtonClick, onCartButtonClick
}: Props) {
  const hasSale = typeof salePrice === 'number' && salePrice < price;
  const discountRate = hasSale ? Math.round((1 - (salePrice as number) / price) * 100) : undefined;

  return (
    <div className={styles['product-summary-card']}>
      <button 
          className={styles['product-main']}
          type="button"
          onClick={onClick}
      >
        <img 
          className={styles['product-image']}
          src={imageSrc}
          alt={name}
          loading="lazy"
        />

        <div className={styles['product-info']}>
          <div className={styles['product-name']}>{name}</div>

          <div className={styles['product-price']}>
            {hasSale ? (
              <>
                <div className={styles['original-price']}>
                  {formatWon(price)}
                </div>
                <div className={styles['discount-info']}>
                  {typeof discountRate === 'number' && (
                    <span className={styles['discount-rate']}>{discountRate}%</span>
                  )}
                  <span className={styles['discounted-price']}>
                    {formatWon(salePrice as number)}
                  </span>
                </div>
              </>
            ) : (
              <div className={styles['current-price']}>
                {formatWon(price)}
              </div>
            )}
          </div>

          <div className={styles['product-rating']}>
            <FiStar size={12} className={styles['star']} />
            <span className={styles['rating-value']}>{rating}</span>
            <span className={styles['review-count']}>{reviewCount}</span>
          </div>
        </div>
      </button>
      <div className={styles['product-actions']}>
        <button
          className={`${styles['wishlist-icon']} ${wishedByMe ? styles['active'] : ''}`}
          onClick={(e) => { e.stopPropagation(); onWishButtonClick(); }}>
          {wishedByMe ? <IoMdHeart size={16}/> : <IoMdHeartEmpty size={16}/>}
        </button>
        <button 
          className={styles['cart-icon']}
          onClick={onCartButtonClick}>
          <FiShoppingCart size={16} />
        </button>
      </div>
    </div>
  )
}
