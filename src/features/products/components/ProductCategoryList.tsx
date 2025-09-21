import ProductCategoryCard from './ProductCategoryCard';
import styles from './styles/ProductCategoryList.module.css';   

export default function ProductCategoryList() {
  return (
    <section className={styles['product-category-list']}>
      <div className={styles['product-category-wrapper']}>
        <div className={styles['product-category-row']}>
          <ProductCategoryCard />
          <ProductCategoryCard />
          <ProductCategoryCard />
          <ProductCategoryCard />
          <ProductCategoryCard />
        </div>
        <div className={styles['product-category-row']}>   
          <ProductCategoryCard />
          <ProductCategoryCard />
          <ProductCategoryCard />
          <ProductCategoryCard />
          <ProductCategoryCard />
        </div>
      </div>
    </section>
  )
}