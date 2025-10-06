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
  const {
    reviews: initialReviews,
    page,
    totalPages,
    totalItems,
    averageRating,
    starCounts,
  } = productReviewsResponseDummy;

  // Optimistic like state
  const [reviews, setReviews] = useState(initialReviews);

  // Chart + average
  const scoreData = toChartData(starCounts);
  const avg = averageRating;
  
  // Toggle like (optimistic)
  const handleToggleLike = (id: string, next: boolean) => {
    setReviews(prev =>
      prev.map(r =>
        r.reviewId === id
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
          {reviews.map(item => (
            <ProductReviewCard
              key={item.reviewId}
              item={item}
              onToggleLike={handleToggleLike}
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
