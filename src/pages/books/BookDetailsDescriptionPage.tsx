import styles from './styles/BookDetailsDescriptionPage.module.css';
import { useLoaderData } from 'react-router-dom';
import type { BookDetails } from '../../features/books/types';
import { useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { formatDateToKoreanFull } from '../../features/books/util';

export default function BookDetailsDescriptionPage() {
  const bookDetails = useLoaderData() as BookDetails;

  // expand/collapse state for the image stack 
  const [expandedIntroduction, setExpandedIntroduction] = useState(false);
  const [expandedTableOfContents, setExpandedTableOfContents] = useState(false);
  const [expandedPublisherReview, setExpandedPublisherReview] = useState(false);
  
  const hasText = (v?: string) => Boolean(v && v.toString().trim().length > 0);
  
  return (
    <main className={styles['description-main']}>
      {/* Book introduction section */}
      { (hasText(bookDetails.introductionTitle) || hasText(bookDetails.introductionDetail)) && (
        <section className={styles['description-section']}>
          <h2 className={styles['section-title']}>책소개</h2>
          <div className={`${styles['description-text']} ${expandedIntroduction ? styles['is-expanded'] : ''}`}>
            {hasText(bookDetails.introductionTitle) && (
              <div className={styles['introduction-title']}>{bookDetails.introductionTitle}</div>
            )}
            {hasText(bookDetails.introductionDetail) && (
              <div className={styles['introduction-detail']}>{bookDetails.introductionDetail}</div>
            )}
          </div>
          <button
            type="button"
            className={styles['images-toggle-btn']}
            onClick={() => { setExpandedIntroduction(prev => !prev); }}
          >
            {expandedIntroduction ? '접기' : '펼치기'}
            {expandedIntroduction ? <HiChevronUp /> : <HiChevronDown />}
          </button>
        </section>
      )}

      {/* Book table of contents section */}
      { hasText(bookDetails.tableOfContents) && (
        <section className={styles['description-section']}>
          <h2 className={styles['section-title']}>목차</h2>
          <div className={`${styles['description-text']} ${expandedTableOfContents ? styles['is-expanded'] : ''}`}>
            <div className={styles['table-of-contents']}>{bookDetails.tableOfContents}</div>
          </div>
          <button
            type="button"
            className={styles['images-toggle-btn']}
            onClick={() => { setExpandedTableOfContents(prev => !prev); }}
          >
            {expandedTableOfContents ? '접기' : '펼치기'}
            {expandedTableOfContents ? <HiChevronUp /> : <HiChevronDown />}
          </button>
        </section>
      )}

      {/* Book table of contents section */}
      { hasText(bookDetails.publisherReview) && (
        <section className={styles['description-section']}>
          <h2 className={styles['section-title']}>출판사 서평</h2>
          <div className={`${styles['description-text']} ${expandedPublisherReview ? styles['is-expanded'] : ''}`}>
            <div className={styles['publisher-review']}>{bookDetails.publisherReview}</div>
          </div>
          <button
            className={styles['images-toggle-btn']}
            type="button"
            onClick={() => { setExpandedPublisherReview(prev => !prev); }}
          >
            {expandedPublisherReview ? '접기' : '펼치기'}
            {expandedPublisherReview ? <HiChevronUp /> : <HiChevronDown />}
          </button>
        </section>
      )}

      <section className={styles['description-section']}>
        <h2 className={styles['section-title']}>기본정보</h2>
        <table className={styles['info-table']}>
          <tbody>
            <tr>
              <td className={styles['meta-info-title']}>ISBN</td>
              <td className={styles['meta-info-detail']}>{bookDetails.isbn13}</td>
            </tr>
            <tr>
              <td className={styles['meta-info-title']}>발행(출시)일자</td>
              <td className={styles['meta-info-detail']}>{formatDateToKoreanFull(bookDetails.publishedAt)}</td>
            </tr>
            {hasText(bookDetails.pageCountText) && (
              <tr>
                <td className={styles['meta-info-title']}>쪽수</td>
                <td className={styles['meta-info-detail']}>{bookDetails.pageCountText}</td>
              </tr>
            )}
            {hasText(bookDetails.dimensionsText) && (
              <tr>
                <td className={styles['meta-info-title']}>크기</td>
                <td className={styles['meta-info-detail']}>{bookDetails.dimensionsText}</td>
              </tr>
            )}
            {hasText(bookDetails.weightText) && (
              <tr>
                <td className={styles['meta-info-title']}>무게</td>
                <td className={styles['meta-info-detail']}>{bookDetails.weightText}</td>
              </tr>
            )}
            {hasText(bookDetails.totalVolumesText) && (
              <tr>
                <td className={styles['meta-info-title']}>총 권수</td>
                <td className={styles['meta-info-detail']}>{bookDetails.totalVolumesText}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
