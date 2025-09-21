import ProductSummaryCard from './ProductSummaryCard';
import styles from './styles/ProductSummaryList.module.css';

export default function ProductSummaryList() {
  return (
    <section className={styles['product-list']}>
        <div className={styles['product-list-header']}></div>
        <div className={styles['product-list-body']}>
          {Array.from({ length: 30 }).map((_, i) => (
              <ProductSummaryCard key={i} />
          ))}
        </div>
    </section>
  )
}