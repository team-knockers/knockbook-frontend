import styles from './styles/BookDetailsReviewsPage.module.css';
import { bookReviewsApiResDummy, bookReviewsScoreDummy } from "../../features/books/resources/bookDetailsPage.dummy";
import { renderStars } from '../../features/books/util';
import BookReviewsBarChart from '../../features/books/components/BookReviewsBarChart';
import BookReviewListItem from '../../features/books/components/BookReviewListItem';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import BookReviewListHeader from '../../features/books/components/BookReviewListHeader';

export default function BookDetailsReviewsPage() {

  const [transactionType, setTransactionType] = useState('all');
  const [sortType, setSortType] = useState('popular');
  const [isMyMbtiOnly, setIsMyMbtiOnly] = useState(false);

  // Track IDs currently processing to prevent duplicate clicks
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Dummy data for test
  const reviewApiRes = bookReviewsApiResDummy;
  const reviewsScoreData = bookReviewsScoreDummy;

  // Toast handlers for BookReviewListHeader (test only)
  const toastOnTransactionChange = (newTransactionValue: string) => {
    setTransactionType(newTransactionValue);
    toast(`필터: ${newTransactionValue}로 변경됨`);
  };
  const toastOnSortChange = (newSortValue: string) => {
    setSortType(newSortValue);
    toast(`정렬: ${newSortValue}로 변경됨`);
  };
  const toastOnMbtiFilterChange = (next: boolean) => {
    setIsMyMbtiOnly(next);
    toast(`myMbti: ${next}로 변경됨`);
  };

  // Toast handlers for BookReviewListItem (test only)
  const toastLikeAdd = (reviewId: string) => toast(`좋아요 추가 (id: ${reviewId})`);
  const toastLikeRemove = (reviewId: string) => toast(`좋아요 삭제 (id: ${reviewId})`);
  const toastRefreshLike = (reviewId: string) => toast(`좋아요 갱신 요청 (id: ${reviewId})`);
  const toastError = (msg: string) => toast.error(msg);

  const onToggleLike = async (reviewId: string, newLiked: boolean) => {
    setProcessingIds(prev => new Set(prev).add(reviewId));

    try {
      if (newLiked) {
        toastLikeAdd(reviewId);
      } else {
        toastLikeRemove(reviewId);
      }
      toastRefreshLike(reviewId);

      return Promise.resolve();
    } catch (error) {
      toastError('요청 처리 중 오류가 발생했습니다');
      throw error;
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(reviewId);
        return next;
      });
    }
  };

  return (
    <>
      {/*ToastContainer for Test */}
      <ToastContainer position="top-center" />

      <main className={styles['reviews-main']}>
        
        {/* Review title */}
        <h2 className={styles['section-title']}>리뷰</h2>

        {/* Reviews statistics */}
        {/* TODO. 도서의 평균값은 백엔드에서 받도록 수정할 것 */}
        <section className={styles['reviews-statistics']}>
          <div className={styles['reviews-average']}>
            <span className={styles['reviews-average-label']}>사용자 총점</span>
            <span className={styles['star-score']}>4.8</span>
            <span className={styles['star-rating']}>{renderStars(4.8)}</span>
          </div>
          <div className={styles['reviews-chart']}>
            <BookReviewsBarChart
              scoreData={reviewsScoreData}
            />
          </div>
        </section>

        {/* Review list container */}
        <section className={styles['review-list-container']}>
          <BookReviewListHeader
            totalCount={reviewApiRes.totalItems}
            selectedTransaction={transactionType}
            selectedSort={sortType}
            isMyMbtiOnly={isMyMbtiOnly} 
            onTransactionChange={toastOnTransactionChange}
            onSortChange={toastOnSortChange}
            onMbtiFilterChange={toastOnMbtiFilterChange}
          />
          {reviewApiRes.reviews.map((review) => (
            <BookReviewListItem
              key={review.id} 
              reviewData={review}
              onToggleLike={onToggleLike}
              externalProcessing={processingIds.has(review.id)}
            />
          ))}
          {/* TODO. API 연결시 Pagination 추가할 것 */}
        </section>
      </main>
    </>
  );
}
