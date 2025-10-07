import styles from './styles/BooksCategoryAllPage.module.css';
import { generatePath, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { sortOptions, type BookSummary, type CommonSearchState } from "../../features/books/types";
import BookListHeader from '../../features/books/components/BookListHeader';
import BookListItem from '../../features/books/components/BookListItem';
import Pagination from '../../components/navigation/Pagination';
import { PATHS } from '../../routes/paths';
import { useEffect, useState } from 'react';
import { BookService } from '../../features/books/services/BookService';

// Parse initial search state from URL: page, category, subcategory, minPrice, maxPrice, searchBy, keyword, sortBy, order
function makeInitialState(params: URLSearchParams, defaultCategory?: string): CommonSearchState {
  return {
    category: defaultCategory ?? params.get('category') ?? 'all',
    subcategory: params.get('subcategory') ?? 'all',
    page: Number(params.get('page') ?? 1),
    size: Number(params.get('size') ?? 10),
    sortBy: (params.get('sortBy') as CommonSearchState['sortBy']) ?? 'published',
    order: (params.get('order') as CommonSearchState['order']) ?? 'desc',
  };
}

// Utility function to update URLSearchParams
const applyQueryParam = (q: URLSearchParams, key: string, value: string | number | undefined, defaultValue?: string) => {
  if (value !== undefined) {
    q.set(key, String(value));
  } else if (defaultValue !== undefined) {
    q.set(key, defaultValue);
  }
};

export default function BooksCategoryAllPage() {
  const navigate = useNavigate();

  const params = useParams();
  const categoryCodeName = params.categoryCodeName;

  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchState, setSearchState] = useState<CommonSearchState>(() =>
    makeInitialState(searchParams, categoryCodeName)
  );

  // Update URL (query) as single source of truth
  const setQuery = (updater: (q: URLSearchParams) => void) => {
    const q = new URLSearchParams(searchParams.toString());
    updater(q);
    setSearchParams(q);
  };

  // Update search state via URL (filters, category, sort, price, page)
  const updateSearchStateViaUrl = (updates: Partial<CommonSearchState>) => {
    setQuery(q => {
      applyQueryParam(q, 'category', updates.category);
      applyQueryParam(q, 'subcategory', updates.subcategory);
      applyQueryParam(q, 'sortBy', updates.sortBy);
      applyQueryParam(q, 'order', updates.order);
      applyQueryParam(q, 'page', updates.page, '1');
    });
  };

  // Handler for BookListHeader component category select change
  const handleCategoryChange = (categoryValue: string) => {
    updateSearchStateViaUrl({ category: categoryValue })
  };
  
  // Handler for BookListHeader component sort select change
  const handleSortChange = (sortValue: string) => {
    const option = sortOptions.find(option => option.value === sortValue);
    if (!option) return;
    updateSearchStateViaUrl({ sortBy: option.value, order: option.order });
  };

  // Handler for Pagination component page change
  const handlePageChange = (nextPage: number) => {
    setQuery(q => q.set('page', String(nextPage)));
  };

  const handleBookItemClick = (id: string) => {
    navigate(generatePath(PATHS.bookDetails, { bookId: id }));
  };

  // Sync searchState with URL changes
  useEffect(() => {
    setSearchState(makeInitialState(searchParams, categoryCodeName));
  }, [searchParams, categoryCodeName]);

  // Fetch data when searchState changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await BookService.getPaginatedBookSummaries(
          searchState.category,
          searchState.subcategory,
          searchState.page,
          searchState.size,
          searchState.sortBy,
          searchState.order
        );
        if (cancelled) return;
        setBooks(res.books);
        setTotalItems(res.totalItems);
        setTotalPages(res.totalPages);
      } catch (error) {
        if (cancelled) return;
        console.error('검색 결과 불러오기 실패', error);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [searchState]);

  return (
    <section className={styles['book-category-all-layout']}>
      <div className={styles['book-category-all-results']}>
        <BookListHeader
          totalCount={totalItems}
          selectedCategory={searchState.category}
          selectedSort={searchState.sortBy}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          categoryDisabled={true}
        />
        {books.map((book) => (
          <BookListItem
            key={book.id}
            imageUrl={book.coverThumbnailUrl}
            title={book.title}
            author={book.author}
            publisher={book.publisher}
            publishedAt={book.publishedAt}
            averageRating={book.averageRating}
            rentalAmount={book.rentalAmount}
            purchaseAmount={book.purchaseAmount}
            discountedPurchaseAmount={book.discountedPurchaseAmount}
            onImageOrTitleClicked={() => {
              handleBookItemClick(book.id);
              console.log(`${book.title} 도서 클릭`);
            }}
          />
        ))}
      </div>
      <Pagination
        page={Number(searchParams.get('page') ?? searchState.page)}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </section>
  );
}
