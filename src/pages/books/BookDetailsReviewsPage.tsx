import styles from './styles/BookDetailsReviewsPage.module.css';
import { renderStars } from '../../features/books/util';
import BookReviewsBarChart from '../../features/books/components/BookReviewsBarChart';
import BookReviewListItem from '../../features/books/components/BookReviewListItem';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import BookReviewListHeader from '../../features/books/components/BookReviewListHeader';
import { reviewsSortOptions, type BookReview } from '../../features/books/types';
import { useLoaderData, useParams, useSearchParams } from 'react-router-dom';
import { BookService } from '../../features/books/services/BookService';
import Pagination from '../../components/navigation/Pagination';
import type { BookDetailsLoaderData } from './BookDetails.loader';

type ReviewsSearchState = {
  page: number;
  size: number;
  transactionType: string;
  sortBy: 'likes' | 'createdAt' | 'rating';
  order: 'asc' | 'desc';
  sameMbti: boolean;
};

function makeInitialState(params: URLSearchParams): ReviewsSearchState {
  return {
    page: Number(params.get('page') ?? 1), // backend expects 1-based
    size: Number(params.get('size') ?? 5),
    transactionType: params.get('transactionType') ?? 'all',
    sortBy: (params.get('sortBy') as ReviewsSearchState['sortBy']) ?? 'likes',
    order: (params.get('order') as ReviewsSearchState['order']) ?? 'desc',
    sameMbti: params.get('sameMbti') === 'true' ? true : false
  };
}

const applyQueryParam = (q: URLSearchParams, key: string, value: string | number | boolean | undefined, defaultValue?: string) => {
  if (value === undefined) {
    if (defaultValue !== undefined) {
      q.set(key, defaultValue);
      return;
    }
  }
  q.set(key, String(value));
};

export default function BookDetailsReviewsPage() {
  const { statistics } = useLoaderData() as BookDetailsLoaderData;
  const { bookId } = useParams(); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchState, setSearchState] = useState<ReviewsSearchState>(() => makeInitialState(searchParams));


  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [reviews, setReview] = useState<BookReview[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Keep URL as single source of truth
  const setQuery = (updater: (q: URLSearchParams) => void) => {
    const q = new URLSearchParams(searchParams.toString());
    updater(q);
    setSearchParams(q);
  };

  // Update search state via URL (filters, sort, page)
  const updateSearchStateViaUrl = (updates: Partial<ReviewsSearchState>) => {
    const nextState = { ...searchState, ...updates }; 
    setQuery(q => {
      applyQueryParam(q, 'transactionType', nextState.transactionType, 'all');
      applyQueryParam(q, 'sortBy', nextState.sortBy, 'likes');
      applyQueryParam(q, 'order', nextState.order, 'desc');
      applyQueryParam(q, 'sameMbti', nextState.sameMbti);
      applyQueryParam(q, 'page', nextState.page, '1');
      applyQueryParam(q, 'size', nextState.size, '5');
    });
  };

  // Header handlers
  const handleTransactionChange = (next: string) => updateSearchStateViaUrl({ transactionType: next, page: 1 });
  const handleSortChange = (nextSortValue: string) => {
    const option = reviewsSortOptions.find(o => o.value === nextSortValue);
    if (!option) {
      return;
    }
    updateSearchStateViaUrl({ sortBy: option.value, page: 1 });
  };
  const handleMbtiFilterChange = (next: boolean) => updateSearchStateViaUrl({ sameMbti: next, page: 1 });

  // Handler for Pagination component page change
  const handlePageChange = (nextPage: number) => {
    setQuery(q => q.set('page', String(nextPage)));
  };

  // Fetch reviews when dependencies change
  useEffect(() => {
    setSearchState(makeInitialState(searchParams));
  }, [searchParams]);

  // Fetch reviews on searchState change
  useEffect(() => {
    if (!bookId) {
      return;
    }
    let cancelled = false;

    const fetch = async () => {
      try {
        const res = await BookService.getBookReviews(
          bookId,
          searchState.page,
          searchState.size,
          searchState.transactionType,
          searchState.sortBy,
          searchState.order,
          searchState.sameMbti
        );
        if (cancelled) {
          return;
        }
        setReview(res.reviews);
        setTotalItems(res.totalItems);
        setTotalPages(res.totalPages);
      } catch (err) {
        if (!cancelled) {
          toast.error('리뷰 불러오기 실패');
        }
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [bookId, searchState.page, searchState.size, searchState.transactionType, searchState.sortBy, searchState.order, searchState.sameMbti]);

  // Optimistic like toggle
  const onToggleLike = async (reviewId: string, newLiked: boolean) => {
    if (!bookId) {
      toast.error('잘못된 접근입니다. 도서 ID가 없습니다.');
      return;
    }
    if (processingIds.has(reviewId)) return;

    setProcessingIds(prev => new Set(prev).add(reviewId));

    const prev = reviews;
    const next = reviews.map((r) =>
      r.id === reviewId
        ? { ...r, likedByMe: newLiked, likesCount: r.likesCount + (newLiked ? 1 : -1) }
        : r
    );
    setReview(next);

    try {
      if (newLiked) {
        await BookService.likeReview(bookId!, reviewId);
      } else {
        await BookService.unlikeReview(bookId!, reviewId);
      }
    } catch (e) {
      toast.error('좋아요 처리에 실패했습니다');
      setReview(prev); // rollback
    } finally {
      setProcessingIds(prev => {
        const nextSet = new Set(prev);
        nextSet.delete(reviewId);
        return nextSet;
      });
    }
  };

  return (
    <>
      {/*ToastContainer for Test */}
      <ToastContainer position="top-center" />

      <section className={styles['reviews-layout']}>
        
        {/* Review title */}
        <h2 className={styles['section-title']}>리뷰</h2>

        {/* Reviews statistics */}
        {/* TODO. 도서의 평균값은 백엔드에서 받도록 수정할 것 */}
        <section className={styles['reviews-statistics']}>
          <div className={styles['reviews-average']}>
            <span className={styles['reviews-average-label']}>사용자 총점</span>
            <span className={styles['star-score']}>{statistics.averageRating.toFixed(1)}</span>
            <span className={styles['star-rating']}>{renderStars(statistics.averageRating)}</span>
          </div>
          <div className={styles['reviews-chart']}>
            <BookReviewsBarChart
              scoreData={statistics.scoreCounts}
            />
          </div>
        </section>

        {/* Review list container */}
        <section className={styles['review-list-container']}>
          <BookReviewListHeader
            totalCount={totalItems}
            selectedTransaction={searchState.transactionType}
            selectedSort={searchState.sortBy}
            isMyMbtiOnly={searchState.sameMbti}
            onTransactionChange={handleTransactionChange}
            onSortChange={handleSortChange}
            onMbtiFilterChange={handleMbtiFilterChange}
          />
          {reviews.map((review) => (
            <BookReviewListItem
              key={review.id} 
              reviewData={review}
              onToggleLike={onToggleLike}
              externalProcessing={processingIds.has(review.id)}
            />
          ))}
        </section>
        <Pagination
            page={Number(searchParams.get('page') ?? searchState.page)}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
      </section>
    </>
  );
}
