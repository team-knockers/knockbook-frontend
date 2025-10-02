import styles from './styles/ProductDetailDescriptionPage.module.css';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { useState } from 'react';

export default function ProductDetailDescriptionPage() {
  // expand/collapse state for the image stack 
  const [expanded, setExpanded] = useState(false);
  // demo only: replace with API/loader data 
  const descriptionImages = [
    "http://contents.kyobobook.co.kr/gift/work/1740/1751260299268_%EB%B6%81%EC%BB%A4%EB%B2%84%EB%B0%B1-%EA%B3%B5%ED%86%B5-%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%800%20(3).jpg",
    "http://contents.kyobobook.co.kr/gift/work/1312/1751260314312_%EB%B6%81%EC%BB%A4%EB%B2%84%EB%B0%B1-%EC%8B%A4%EB%B2%84---%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%802.jpg",
    "http://contents.kyobobook.co.kr/gift/work/1791/1751260376505_%EB%B6%81%EC%BB%A4%EB%B2%84%EB%B0%B1-%EC%8B%A4%EB%B2%84---%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%803.jpg",
  ]

  return (
    <>
      {/* Collapsible description images */}
      <div className={`${styles['description-images']} ${expanded ? styles['is-expanded'] : ''}`}>
        {descriptionImages.map((src, i) => {
          return (
            <img
              key={i}
              className={styles['description-image']}
              src={src}
              alt="TODO"
            />    
          );
        })}
        {/* Toggle button */}
        <button
          type="button"
          className={styles['images-toggle-btn']}
          onClick={() => { setExpanded(prev => !prev); }}
        >
          {expanded ? '상품 정보 접기' : '상품 정보 펼치기'}
          {expanded ? <HiChevronUp /> : <HiChevronDown />}
        </button>
      </div>
      
      {/* Key specs: left = labels, right = values */}
      <div className={styles['spec-grid']}>
        <div className={styles['spec-labels']}>
          <div>제조사</div>
          <div>제조국</div>
          <div>품명</div>
          <div>수입여부</div>
        </div>
        <div className={styles['spec-values']}>
          <div>엘케이비주식회사</div>
          <div>대한민국</div>
          <div>북메이트 북커버백</div>
          <div>국산</div>
        </div>
      </div>
    </>
  );
}
