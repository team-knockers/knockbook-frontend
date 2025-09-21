import styles from './styles/ProductSummaryCard.module.css';
import { FiStar, FiHeart, FiShoppingCart } from "react-icons/fi";

export default function ProductSummaryCard() {
  return (
    <div className={styles['product-summary-card']}>
      <button className={styles['product-main']}>
        <img className={styles['product-image']}
             src="https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1759/hot1675653230988.jpg"
             alt="product image"
        />
        <div className={styles['product-info']}>
          <div className={styles['product-name']}>조개 독서링 북 홀더링</div>
          <div className={styles['product-price']}>
              <div className={styles['original-price']}>25000원</div>
              <div className={styles['discount-info']}>
                <span className={styles['discount-rate']}>10%</span>
                <span className={styles['discounted-price']}>9000원</span>
              </div>
          </div>
          <div className={styles['product-rating']}>
            <FiStar size={12} className={styles['star']} />4.9 (273)
          </div>
        </div>
      </button>
      <div className={styles['product-actions']}>
        <button className={styles['wishlist-icon']}>
          <FiHeart size={16} />
        </button>
        <button className={styles['cart-icon']}>
          <FiShoppingCart size={16} />
        </button>
      </div>
    </div>
  )
}