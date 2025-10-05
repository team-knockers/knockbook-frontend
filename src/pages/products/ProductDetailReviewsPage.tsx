import styles from './styles/ProductDetailReviewsPage.module.css';
import ProductReviewCard from '../../features/products/components/ProductReviewCard';
import ProductReviewListHeader from '../../features/products/components/ProductReviewListHeader';
import BookReviewsBarChart from '../../features/books/components/BookReviewsBarChart';
import { renderStars } from '../../features/books/util';
import { productReviewsResponseDummy } from '../../features/products/resources/ProductReviewsResponse.dummy';
import { useSearchParams } from "react-router-dom";
import Pagination from '../../components/navigation/Pagination';
import { useState } from 'react';
import { toChartData } from '../../features/products/util';

export default function ProductDetailReviewsPage() {
  // Full response (later: replace with API response)
  const resp = productReviewsResponseDummy;
  // Review list shown in UI (optimistic updates on like toggle)
  const [reviews, setReviews] = useState(resp.reviews);

  // Bar chart input + average score
  const scoreData = toChartData(resp.starCounts);
  const avg = resp.averageRating;
  
  const handleToggleLike = (id: string, next: boolean) => {
    // Optimistic UI: update one review (liked / likesCount)
    setReviews(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, liked: next, likesCount: r.likesCount + (next ? 1 : -1) }
          : r
      )
    );
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
      <section className={styles['reviews-layout']}>
        <h2 className={styles['section-title']}>리뷰</h2>
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
        <section className={styles['review-list-container']}>
          <ProductReviewListHeader totalCount={resp.totalItems}/>
          {reviews.map(review => (
            <ProductReviewCard
              key={review.id}
              id={review.id}
              userId={review.userId}
              createdAt={review.createdAt}
              rating={review.rating}
              content={review.content}
              likesCount={review.likesCount}
              liked={review.liked}
              onToggleLike={handleToggleLike}
            />
          ))}
        </section>
        <section className={styles['pagination-container']}>
          <Pagination
            page={resp.page}  
            totalPages={resp.totalPages}
            onChange={goPage}
          />
        </section>
      </section>
    </>
  );
}
