import CategoryFilterSearchBar from "../../features/books/components/CategoryFilterSearchBar";
import styles from './BooksSearchPage.module.css';
import Footer from "../../components/layout/Footer";
import BooksCategoryPopup from "../../features/books/components/BooksCategoryPopup";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SEARCH_OPTIONS, sortOptions, type BookSummary, type SearchOption, type SearchState } from "../../features/books/types.ts";
import BookListItem from "../../features/books/components/BookListItem";
import BookListHeader from "../../features/books/components/BookListHeader";
import BookFilterSidebar from "../../features/books/components/BookFilterSidebar";
import { BookService } from "../../features/books/services/BookService.ts";
import Pagination from "../../components/navigation/Pagination.tsx";

// Parse initial search state from URL: page, category, subcategory, minPrice, maxPrice, searchBy, keyword, sortBy, order
function makeInitialState(params: URLSearchParams): SearchState {
  return {
    category: params.get('category') ?? 'all',
    subcategory: params.get('subcategory') ?? 'all',
    page: Number(params.get('page') ?? 1),
    size: Number(params.get('size') ?? 10),
    searchBy: (params.get('by') as 'title'|'author'|'publisher') ?? 'title',
    searchKeyword: params.get('keyword') ?? '',
    sortBy: (params.get('sortBy') as SearchState['sortBy']) ?? 'published',
    order: (params.get('order') as SearchState['order']) ?? 'desc',
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined
  };
}

// Map SEARCH_OPTIONS to a record for easy label lookup
const SEARCH_OPTION_MAP: Record<SearchOption, string> =
  Object.fromEntries(SEARCH_OPTIONS.map(option => [option.value, option.label])) as Record<SearchOption,string>;

// Utility function to update URLSearchParams
const applyQueryParam = (q: URLSearchParams, key: string, value: string | number | undefined, defaultValue?: string) => {
  if (value !== undefined) {
    q.set(key, String(value));
  } else if (defaultValue !== undefined) {
    q.set(key, defaultValue);
  }
};

export default function BooksSearchPage() {
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchState, setSearchState] = useState<SearchState>(() => makeInitialState(searchParams));
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const searchByLabel = SEARCH_OPTION_MAP[searchState.searchBy];

  // Update URL (query) as single source of truth
  const setQuery = (updater: (q: URLSearchParams) => void) => {
    const q = new URLSearchParams(searchParams.toString());
    updater(q);
    setSearchParams(q);
  };

  // Update search state via URL (filters, category, sort, price, page)
  const updateSearchStateViaUrl = (updates: Partial<SearchState>) => {
    setQuery(q => {
      applyQueryParam(q, 'category', updates.category);
      applyQueryParam(q, 'subcategory', updates.subcategory);
      applyQueryParam(q, 'by', updates.searchBy);
      applyQueryParam(q, 'keyword', updates.searchKeyword);
      applyQueryParam(q, 'sortBy', updates.sortBy);
      applyQueryParam(q, 'order', updates.order);
      applyQueryParam(q, 'minPrice', updates.minPrice);
      applyQueryParam(q, 'maxPrice', updates.maxPrice);
      applyQueryParam(q, 'page', updates.page, '1');
    });
  };

  // Handler for CategoryFilterSearchBar component search input
  const handleSearch = (newSearchBy: 'title' | 'author' | 'publisher', newKeyword: string) => {
    setQuery(q => {
      q.set('by', newSearchBy);
      q.set('keyword', newKeyword);
      q.set('page', '1');
    });
    console.log('🔍 검색 실행:', { newSearchBy, newKeyword });
  };

  // Handler for CategoryFilterSearchBar component category toggle button
  const toggleCategory = () => {
    setIsCategoryPopupOpen(prev => !prev);
    console.log(`📂 카테고리 ${!isCategoryPopupOpen ? '열기' : '닫기'}`);
  };

  // Handler for BooksCategoryPopup component close button
  const handleCloseCategory = () => {
    setIsCategoryPopupOpen(false);
    console.log('📂 카테고리 팝업 닫기');
  };

  // Handler for BookFilterSidebar component filter apply
  const handleFilterApplied = (newFilters: Partial<SearchState>) => {
    console.log('필터 적용됨:', newFilters);
    updateSearchStateViaUrl(newFilters);
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

  // Sync searchState with URL changes
  useEffect(() => {
    setSearchState(makeInitialState(searchParams));
  }, [searchParams]);

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
          searchState.order,
          searchState.searchBy,
          searchState.searchKeyword,
          searchState.minPrice ?? undefined,
          searchState.maxPrice ?? undefined
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
    <>
      <main className={styles['book-search-main']}>
        <CategoryFilterSearchBar
          onSearched={handleSearch}
          onCategoryToggled={toggleCategory}
        />
        {isCategoryPopupOpen && (
          <div className={styles['category-popup-overlay']}>
            <BooksCategoryPopup onClosed={handleCloseCategory} />
          </div>
        )}
        <div className={styles['book-search-container']}>
          <span className={styles['book-search-info']}>
            🔍 "{searchByLabel}" 기준으로 "{searchState.searchKeyword}"를 검색한 결과
          </span>
          <div className={styles['book-search-contents']}>
            <div className={styles['book-search-sidebar']}>
              <BookFilterSidebar
                category={searchState.category}
                minPrice={searchState.minPrice}
                maxPrice={searchState.maxPrice}
                onApplied={handleFilterApplied}
              />
            </div>
            <div className={styles['book-search-results-container']}>
              <div className={styles['book-search-results']}>
                <BookListHeader
                  totalCount={totalItems}
                  selectedCategory={searchState.category}
                  selectedSort={searchState.sortBy}
                  onCategoryChange={handleCategoryChange}
                  onSortChange={handleSortChange}
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
                    onImageOrTitleClicked={() => console.log(`${book.title} 도서 클릭`)}
                  />
                ))}
              </div>
              <Pagination
                page={Number(searchParams.get('page') ?? searchState.page)}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
