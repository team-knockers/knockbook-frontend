import type {  BookDetails, BookReviewsStatistics } from '../types';
import { calculateBookDiscountRate, formatDateToKoreanFull, renderStars } from '../util';
import styles from './styles/BookDetailsSummaryInfo.module.css';
import { LuAward } from "react-icons/lu";

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
      <div className={styles['award']}>
        <div className={styles['award-title']}>
          <LuAward/>
          <span className={styles['award-sub']}>문앞베스트</span>
        </div>
        {/* TODO. 전체랭킹과 카테고리별 랭킹을 조회 로직 추가시 가져와서 수정할 것 */}
        <div className={styles['award-ranks']}>
          <span className={styles['award-rank-main']}>
            전체 <span className={styles['award-rank-highlight']}>4</span>위
          </span>
            소설 <span className={styles['award-rank-highlight']}>1</span>위
        </div>
      </div> 

      <div className={styles['book-summary-info-container']}>
        <img
          className={styles['book-cover-image']}
          src={bookDetails.coverImageUrl}
          alt={`${bookDetails.title} 이미지`}
        />

        <div className={styles['book-meta-info']}>
          <div className={styles['book-meta']}>
            <span className={styles['meta-title']}>{bookDetails.title}</span>
            <span className={styles['meta-author']}>{bookDetails.author} 저자(글)</span>
            <span className={styles['meta-publisher']}>{bookDetails.publisher} · {formatDateToKoreanFull(bookDetails.publishedAt)}</span>
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
            <div className={styles['price-buy-discount']}>
              <span className={styles['discount-rate']}>{calculateBookDiscountRate(bookDetails.discountedPurchaseAmount, bookDetails.purchaseAmount)}%</span>
              <span className={styles['original-price']}>{bookDetails.purchaseAmount.toLocaleString()}원</span>
            </div>
            <div className={styles['price-buy']}>
              <div className={styles['price-box']}>
                <span className={styles['price-box-title']}>구매</span>
                <div className={styles['price-box-contents-container']}>
                  <span className={styles['price-box-contents']}>{bookDetails.discountedPurchaseAmount.toLocaleString()}</span>
                  <span className={styles['price-box-unit']}>원</span>
                </div>
              </div>
              <div className={styles['point-box']}>
                <span className={styles['point-box-title']}>적립</span>
                <span className={styles['point-box-contents']}>{bookDetails.purchasePoint.toLocaleString()}P</span>
              </div>
            </div>
            <div className={styles['price-rent']}>
              <div className={styles['price-box']}>
                <span className={styles['price-box-title']}>대여</span>
                <div className={styles['price-box-contents-container']}>
                  <span className={styles['price-box-contents']}>{bookDetails.rentalAmount.toLocaleString()}</span>
                  <span className={styles['price-box-unit']}>원</span>
                </div>
              </div>
              <div className={styles['point-box']}>
                <span className={styles['point-box-title']}>적립</span>
                <span className={styles['point-box-contents']}>{bookDetails.rentalPoint.toLocaleString()}P</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
