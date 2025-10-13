import OneWayButton from '../../components/forms/OneWayButton';
import ProductQnaCard from '../../features/products/components/ProductQnaCard';
import styles from './styles/ProductDetailQnaPage.module.css';
import { useState } from 'react';
import { useSearchParams, useLoaderData, useParams } from "react-router-dom";
import Pagination from '../../components/navigation/Pagination';
import ProductQnAPopup from '../../features/products/components/ProductQnAPopup';
import { useOutletContext } from 'react-router-dom';
import type { ProductInquiryList } from '../../features/products/types';
import { ProductService } from '../../features/products/services/ProductService';

type DetailCtx = {
  productImageUrl: string;
  productName: string;
};

export default function ProductDetailQnaPage() {
  const { productInquiries, page, totalPages } = useLoaderData() as ProductInquiryList;
  const { productId } = useParams() as { productId: string };
  const { productImageUrl, productName } = useOutletContext<DetailCtx>();
  
  // Track expanded items (allow multi-open)
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

  const [ sp, setSp ] = useSearchParams();
  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);
  };

  return (
    <>
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
          {productInquiries.map((inquiry) => (
            <ProductQnaCard
              key={inquiry.inquiryId}
              inquiry={inquiry}
              isOpen={openSet.has(inquiry.inquiryId)}
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

        {/* Modal (mount only when open) */}
        {isQnaOpen && (
          <ProductQnAPopup
            productImageUrl={productImageUrl}
            productName={productName}
            onSubmit={async(title, questionBody) =>
              await ProductService.createInquiry(productId, { title, questionBody }) 
            }
            onClose={() => setIsQnaOpen(false)}
          />
        )}
      </section>
    </>
  );
}
