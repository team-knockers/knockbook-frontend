import ProductSummaryCard from './ProductSummaryCard';
import styles from './styles/ProductSummaryList.module.css';
import { productSummaryDummy } from './DummySummary';
import ProductSummaryListHeader from './ProductSummaryListHeader';
import { useState } from 'react';

export default function ProductSummaryList() {
  // 임시 더미 데이터 사용 (추후 API 연동 예정)
  const items = productSummaryDummy;
  const handleCardClick = (id: string) => {
    console.log('go detail:', id); // TODO: 상세 페이지로 이동
  }

  const [categoryLabel, setCategoryLabel] = useState('전체');
  const [sortLabel, setSortLabel] = useState('인기순'); 
  const openCategoryDropdown = () => {
    console.log('open category dropdown'); // TODO: 카테고리 드롭다운 열기
  }
  const openSortDropdown = () => {
    console.log('open sort dropdown'); // TODO: 정렬 드롭다운 열기
  } 

  return (
    <section className={styles['product-list']}>
        <ProductSummaryListHeader 
          categoryLabel={categoryLabel}
          sortLabel={sortLabel}
          totalCount={items.length}
          onCategoryClick={openCategoryDropdown}
          onSortClick={openSortDropdown}
        />
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
