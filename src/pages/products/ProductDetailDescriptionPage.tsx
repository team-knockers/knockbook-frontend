import styles from './styles/ProductDetailDescriptionPage.module.css';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { useState } from 'react';
import { useLoaderData } from "react-router-dom";

export default function ProductDetailDescriptionPage() {
  // Get server data prepared by the route loader
  const { name, manufacturerName, importCountry, isImported, descriptionImageUrls } = useLoaderData() as {
    name: string;
    manufacturerName: string;
    importCountry: string;
    isImported: string;
    descriptionImageUrls: string[];
  };
  const imgs = descriptionImageUrls ?? [];

  // expand/collapse state for the image stack 
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Collapsible description image stack */}
      <div className={`${styles['description-images']} ${expanded ? styles['is-expanded'] : ''}`}>
        {imgs.map((src, i) => {
          return (
            <img
              key={i}
              className={styles['description-image']}
              src={src}
              alt={name}
            />    
          );
        })}

        {/* Toggle expand/collapse */}
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
          <div>{manufacturerName}</div>
          <div>{importCountry}</div>
          <div>{name}</div>
          <div>{isImported}</div>
        </div>
      </div>
    </>
  );
}
