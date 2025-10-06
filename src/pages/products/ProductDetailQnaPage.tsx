import OneWayButton from '../../components/forms/OneWayButton';
import ProductQnaCard from '../../features/products/components/ProductQnaCard';
import styles from './styles/ProductDetailQnaPage.module.css';
import { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import Pagination from '../../components/navigation/Pagination';
import { productQnasResponseDummy } from '../../features/products/resources/ProductQnasResponse.dummy';

export default function ProductDetailQnaPage() {
  // Dummy data (will be replaced by API)
  const { qnas, page, totalPages } = productQnasResponseDummy;
  
  // Track expanded items (multi-open)
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const toggleOpen = (id: string): void => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };  
  
  // QnA modal (open on button click)
  const [isQnaOpen, setIsQnaOpen] = useState(false);
  const handleOpenQnaModal = (): void => {
    setIsQnaOpen(true); // TODO: show QnA modal
  };

  // URL query params (page / sort)
  const [ sp, setSp ] = useSearchParams();

  // Pagination: update only the "page" param in URL
  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);
  };

  return (
    <>
      {/* Render modal when isQnaOpen is true */}
      {isQnaOpen && (
        <div>QnA Modal</div>
      )}

      <section className={styles['qna-layout']}>

        {/* CTA row */}
        <section className={styles['qna-cta']}>
          <div className={styles['qna-cta-text']}>상품 문의 이외 문의는 고객센터의 1:1 문의를 이용해주세요.</div>
          <OneWayButton
            content="문의하기"
            onClick={handleOpenQnaModal}
            responsiveType="fixed"
            widthSizeType="sm"
            heightSizeType="sm"
            colorType="dark"
          />
        </section>
        
        {/* QnA list */}
        <section className={styles['qna-list']}>
          {qnas.map((item) => (
            <ProductQnaCard
              key={item.qnaId}
              item={item}
              isOpen={openSet.has(item.qnaId)}
              onToggle={toggleOpen}
            />
          ))}
        </section>
        
        {/* Pagination (URL-driven) */}
        <Pagination
          page={page}  
          totalPages={totalPages}
          onChange={goPage}
        />
      </section>
    </>
  );
}
