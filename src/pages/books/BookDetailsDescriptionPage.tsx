import styles from './styles/BookDetailsDescriptionPage.module.css';
import { useLoaderData } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
// import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { formatDateToKoreanFull } from '../../features/books/util';
import type { BookDetailsLoaderData } from './BookDetails.loader';

function useIsOverflowing(
  ref: React.RefObject<HTMLElement | null>,
  enabled = true
) {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsOverflowing(false);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1); // +1 to avoid sub-pixel flakiness
    };

    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);

    window.addEventListener('resize', check);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', check);
    };
  }, [ref, enabled]);

  return isOverflowing;
}

export default function BookDetailsDescriptionPage() {
  const { bookDetails } = useLoaderData() as BookDetailsLoaderData;

  // expand/collapse state for the image stack 
  const [expandedIntroduction, setExpandedIntroduction] = useState(false);
  const [expandedTableOfContents, setExpandedTableOfContents] = useState(false);
  const [expandedPublisherReview, setExpandedPublisherReview] = useState(false);
  
  const introRef = useRef<HTMLDivElement | null>(null);
  const tocRef = useRef<HTMLDivElement | null>(null);
  const pubRef = useRef<HTMLDivElement | null>(null);

  const introOverflow = useIsOverflowing(introRef, true);
  const tocOverflow = useIsOverflowing(tocRef, true);
  const pubOverflow = useIsOverflowing(pubRef, true);

  const hasText = (v?: string) => Boolean(v && v.toString().trim().length > 0);
  
  return (
    <section className={styles['description-layout']}>

      {/* Book introduction section */}
      { (hasText(bookDetails.introductionTitle) || hasText(bookDetails.introductionDetail)) && (
        <section className={styles['description-section']}>
          <h2 className={styles['section-title']}>책소개</h2>
          <div className={styles['introduction-title']}>{bookDetails.introductionTitle}</div>
          <div
            ref={introRef}
            className={`${styles['description-text']} ${expandedIntroduction ? styles['is-expanded'] : ''}`}
          >
            {/* {hasText(bookDetails.introductionTitle) && (
              
            )} */}
            {hasText(bookDetails.introductionDetail) && (
              <div className={styles['introduction-detail']}>{bookDetails.introductionDetail}</div>
            )}
          </div>
          {(introOverflow || expandedIntroduction) && (
            <button
              type="button"
              className={styles['images-toggle-btn']}
              onClick={() => { setExpandedIntroduction(prev => !prev); }}
            >
              {expandedIntroduction ? '접기' : '펼치기'}
              {/* {expandedIntroduction ? <HiChevronUp /> : <HiChevronDown />} */}
            </button>
          )}
        </section>
      )}

      {/* Book table of contents section */}
      { hasText(bookDetails.tableOfContents) && (
        <section className={styles['description-section']}>
          <h2 className={styles['section-title']}>목차</h2>
          <div
            ref={tocRef}
            className={`${styles['description-text']} ${expandedTableOfContents ? styles['is-expanded'] : ''}`}
          >
            <div className={styles['table-of-contents']}>{bookDetails.tableOfContents}</div>
          </div>

            {(tocOverflow || expandedTableOfContents) && (
            <button
              type="button"
              className={styles['images-toggle-btn']}
              onClick={() => { setExpandedTableOfContents(prev => !prev); }}
            >
              {expandedTableOfContents ? '접기' : '펼치기'}
              {/* {expandedTableOfContents ? <HiChevronUp /> : <HiChevronDown />} */}
            </button>
            )}
        </section>
      )}

      {/* Book publisher review section */}
      { hasText(bookDetails.publisherReview) && (
        <section className={styles['description-section']}>
          <h2 className={styles['section-title']}>출판사 서평</h2>
          <div 
            ref={pubRef}
            className={`${styles['description-text']} ${expandedPublisherReview ? styles['is-expanded'] : ''}`}
          >
            <div className={styles['publisher-review']}>{bookDetails.publisherReview}</div>
          </div>

          {(pubOverflow || expandedPublisherReview) && (
            <button
              className={styles['images-toggle-btn']}
              type="button"
              onClick={() => { setExpandedPublisherReview(prev => !prev); }}
            >
              {expandedPublisherReview ? '접기' : '펼치기'}
              {/* {expandedPublisherReview ? <HiChevronUp /> : <HiChevronDown />} */}
            </button>
          )}
        </section>
      )}

      {/* Book metadata table section */}
      <section className={styles['description-section']}>
        <table className={styles['info-table']}>
          <h2 className={styles['section-title']}>기본정보</h2>
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
    </section>
  );
}
