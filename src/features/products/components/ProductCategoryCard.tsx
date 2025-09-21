import styles from './styles/ProductCategoryCard.module.css';
import categoryUrl from '../../../assets/book_cover.png'

export default function ProductCategoryCard() {
  return (
    <button className={styles['product-category-card']}>
      <div className={styles['product-category-content']}>
        <img className={styles['product-category-image']}
             src={categoryUrl}
        />
        <div className={styles['product-category-label']}>독서대</div>
      </div>
    </button>
  )
}