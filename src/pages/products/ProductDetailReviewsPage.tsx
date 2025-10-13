import styles from './styles/ProductDetailReviewsPage.module.css';
import ProductReviewCard from '../../features/products/components/ProductReviewCard';
import ProductReviewListHeader from '../../features/products/components/ProductReviewListHeader';
import BookReviewsBarChart from '../../features/books/components/BookReviewsBarChart';
import { renderStars } from '../../features/books/util';
import { useLoaderData, useSearchParams, useRevalidator } from "react-router-dom";
import Pagination from '../../components/navigation/Pagination';
import { toChartData } from '../../features/products/util';
import type { ProductReviewList } from '../../features/products/types';
import { ProductService } from '../../features/products/services/ProductService';

export default function ProductDetailReviewsPage() {
  // Server data from loader 
  const { productReviews, page, totalItems, totalPages, averageRating, starCounts } = useLoaderData() as ProductReviewList;
  
  // Re-run loader without URL change 
  const { revalidate, state } = useRevalidator();
  const isBusy = state === 'loading';

  // Chart + average
  const scoreData = toChartData(starCounts);
  const avg = averageRating;
  
  // Like -> call API, then revalidate 
  const handleToggleLike = async (id: string, next: boolean) => {
    if (next) { await ProductService.likeReview(id); }
    else { await ProductService.unlikeReview(id); }
    revalidate();
  };

  // Pagination via URL query
  const [ sp, setSp ] = useSearchParams();
  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);
  };

  return (
    <>
      <section className={styles['reviews-layout']}>
        <h2 className={styles['section-title']}>리뷰</h2>

        {/* Stats */}
        <section className={styles['reviews-statistics']}>
          <div className={styles['reviews-average']}>
            <span className={styles['reviews-average-label']}>사용자 총점</span>
            <span className={styles['star-score']}>{avg.toFixed(1)}</span>
            <span className={styles['star-rating']}>{renderStars(avg)}</span>
          </div>
          <div className={styles['reviews-chart']}>
            <BookReviewsBarChart
              scoreData={scoreData}
            />
          </div>
        </section>

        {/* List */}
        <section className={styles['review-list-container']}>
          <ProductReviewListHeader totalCount={totalItems}/>
          {productReviews.map(review => (
            <ProductReviewCard
              key={review.reviewId}
              review={review}
              onToggleLike={handleToggleLike}
              disabled={isBusy} // lock UI while revalidating 
            />
          ))}
        </section>

        {/* Pagination */}
        <section className={styles['pagination-container']}>
          <Pagination
            page={page}  
            totalPages={totalPages}
            onChange={goPage}
          />
        </section>
      </section>
    </>
  );
}
