import type {  BookDetails, BookReviewsStatistics } from '../types';
import { calculateBookDiscountRate, formatDateToKoreanFull, renderStars } from '../util';
import styles from './styles/BookDetailsSummaryInfo.module.css';

type BookDetailsSummaryInfoProps = {
  bookDetails: BookDetails;
  statistics: BookReviewsStatistics;
};

export default function BookDetailsSummaryInfo({
  bookDetails,
  statistics
}: BookDetailsSummaryInfoProps) {

  const topMbtiInfo = Array.isArray(statistics.mbtiPercentage) && statistics.mbtiPercentage.length > 0 ? statistics.mbtiPercentage[0] : undefined;

  return (
    <section className={styles['details-root']}>
      <div className={styles['book-summary-info-container']}>
        <div 
          className={styles['book-cover-image']}
          style={{ backgroundImage: `url(${bookDetails.coverImageUrl})` }}
        >
          <img
            src={bookDetails.coverImageUrl}
            alt={`${bookDetails.title} 이미지`}
          />
        </div>
        
        <div className={styles['book-meta-info']}>
          <div className={styles['book-meta']}>
            <p className={styles['meta-title']}>{bookDetails.title}</p>
            <p className={styles['meta-author']}>{bookDetails.author} 저자(글)</p>
            <p className={styles['meta-publisher']}>{bookDetails.publisher} · {formatDateToKoreanFull(bookDetails.publishedAt)}</p>
          </div>
          <div className={styles['preference-summary']}>
            <div className={styles['star-rate']}>
              <div className={styles['star-score']}>{statistics.averageRating.toFixed(1)}</div>
              <div className={styles['star-rating']}>{renderStars(statistics.averageRating)}</div>
              <div className={styles['review-count']}>{statistics.reviewCount}개의 리뷰</div>
            </div>
            <div className={styles['top-mbti']}>
              {topMbtiInfo ? (
                <>
                  <div className={styles['mbti-type']}>{topMbtiInfo.mbti}</div>
                  <div className={styles['mbti-percent']}>{`${Number(topMbtiInfo.percentage).toFixed(1)}%의 선택`}</div>
                </>
              ) : (
                <div className={styles['mbti-percent']}>mbti 정보 없음</div>
              )}
            </div>
          </div>

          <div className={styles['price']}>
            {/* price-buy */}
            <div className={styles['price-buy']}>
              <div className={styles['price-box']}>
                <div className={styles['price-box-contents-container']}>
                  <div className={styles['price-box']}>
                    구매 <strong>{bookDetails.discountedPurchaseAmount.toLocaleString()}</strong>원
                  </div>
                  {bookDetails.discountedPurchaseAmount < bookDetails.purchaseAmount && (
                    <>
                      <span className={styles['discount-rate']}>{calculateBookDiscountRate(bookDetails.discountedPurchaseAmount, bookDetails.purchaseAmount)}%</span>
                      <span className={styles['original-price']}>{bookDetails.purchaseAmount.toLocaleString()}원</span>
                    </>
                  )}
                </div>
              </div>
              <div className={styles['point-box']}>
                적립 <strong>{bookDetails.purchasePoint.toLocaleString()}</strong>P
              </div>
            </div>
            {/* price-rent */}
            <div className={styles['price-rent']}>
              <div className={styles['price-box']}>
                대여 <strong>{bookDetails.rentalAmount.toLocaleString()}</strong>원
              </div>
              <div className={styles['point-box']}>
                적립 <strong>{bookDetails.rentalPoint.toLocaleString()}</strong>P
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
