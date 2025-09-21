import ProductSummaryCard from './ProductSummaryCard';
import styles from './styles/ProductSummaryList.module.css';
import { productSummaryDummy } from './DummySummary';

export default function ProductSummaryList() {
  // 임시 더미 데이터 사용 (추후 API 연동 예정)
  const items = productSummaryDummy;
  const handleCardClick = (id: string) => {
    console.log('go detail:', id); // TODO: 상세 페이지로 이동
  }

  return (
    <section className={styles['product-list']}>
        <div className={styles['product-list-header']}></div>
        <div className={styles['product-list-body']}>
          {items.map(p => (
            <ProductSummaryCard
              key={p.id}
              imageSrc={p.imageSrc}
              name={p.name}
              price={p.price}
              salePrice={p.salePrice}
              rating={p.rating}
              reviewCount={p.reviewCount}
              onClick={() => handleCardClick(p.id)}
            />
          ))}
        </div>
    </section>
  )
}