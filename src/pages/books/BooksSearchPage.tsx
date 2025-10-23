import styles from './styles/BooksSearchPage.module.css';
import CategoryFilterSearchBar from "../../features/books/components/CategoryFilterSearchBar";
import Footer from "../../components/layout/Footer";
import BooksCategoryPopup from "../../features/books/components/BooksCategoryPopup";
import { useEffect, useState } from "react";
import { generatePath, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { SEARCH_OPTIONS, sortOptions, type BookSearchState, type BookSummary, type SearchOption } from "../../features/books/types.ts";
import BookListItem from "../../features/books/components/BookListItem";
import BookListHeader from "../../features/books/components/BookListHeader";
import BookFilterSidebar from "../../features/books/components/BookFilterSidebar";
import { BookService } from "../../features/books/services/BookService.ts";
import Pagination from "../../components/navigation/Pagination.tsx";
import { PATHS } from "../../routes/paths.ts";
import type { BooksSearchLoaderData } from './BooksSearch.loader.ts';
import { PurchaseService } from '../../features/purchase/services/PurchaseService.ts';
import TwoButtonPopup from '../../components/overlay/TwoButtonPopup.tsx';

// Parse initial search state from URL: page, category, subcategory, minPrice, maxPrice, searchBy, keyword, sortBy, order
function makeInitialState(params: URLSearchParams): BookSearchState {
  return {
    category: params.get('category') ?? 'all',
    subcategory: params.get('subcategory') ?? 'all',
    page: Number(params.get('page') ?? 1),
    size: Number(params.get('size') ?? 10),
    searchBy: (params.get('by') as 'title'|'author'|'publisher') ?? 'title',
    searchKeyword: params.get('keyword') ?? '',
    sortBy: (params.get('sortBy') as BookSearchState['sortBy']) ?? 'published',
    order: (params.get('order') as BookSearchState['order']) ?? 'desc',
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
  const navigate = useNavigate();
  
  const { bookCategories } = useLoaderData() as BooksSearchLoaderData;
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchState, setSearchState] = useState<BookSearchState>(() => makeInitialState(searchParams));
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [averageRatings, setAverageRatings] = useState<(number | null)[]>([]);

  const searchByLabel = SEARCH_OPTION_MAP[searchState.searchBy];

  const mappedCategories = [
    { value: "all", label: "전체" },
    ...bookCategories.map(c => ({
      value: c.categoryCodeName,
      label: c.categoryDisplayName,
    })),
  ];

  // Update URL (query) as single source of truth
  const setQuery = (updater: (q: URLSearchParams) => void) => {
    const q = new URLSearchParams(searchParams.toString());
    updater(q);
    setSearchParams(q);
  };

  // Update search state via URL (filters, category, sort, price, page)
  const updateSearchStateViaUrl = (updates: Partial<BookSearchState>) => {
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
  const handleFilterApplied = (newFilters: Partial<BookSearchState>) => {
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
  const handleBookItemClick = (id: string) => {
    navigate(generatePath(PATHS.bookDetails, { bookId: id }));
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

        const bookIds = res.books.map(b => b.id);
        const averageRatings = await Promise.all(
          bookIds.map(async id => {
            const stat = await BookService.getBookReviewStatistics(id);
            return typeof stat.averageRating === 'number' ? stat.averageRating : null;
          })
        );
        setAverageRatings(averageRatings);
        
      } catch (error) {
        if (cancelled) return;
        console.error('검색 결과 불러오기 실패', error);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [searchState]);

  const nav = useNavigate();
  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);
  async function handleAddItemsOnCart(bookId: string) {
    await PurchaseService.addCartPurchaseItem("BOOK_PURCHASE", bookId, 1);
    setIsCartPopupVisible(true);
  }

  return (
    <>
      <main className={styles['book-search-main']}>
        
        { isCartPopupVisible &&
        <div className={styles['go-to-cart-popup']}>
          <TwoButtonPopup
            title='선택한 상품을 장바구니에 담았어요.'
            description='장바구니로 이동하시겠어요?'
            cancelText='취소'
            confirmText='장바구니 보기'
            onCancel={() => setIsCartPopupVisible(false)}
            onConfirm={() => nav(PATHS.cart)}/>
        </div>}

        <CategoryFilterSearchBar
          onSearched={handleSearch}
          onCategoryToggled={toggleCategory}
        />
        {isCategoryPopupOpen && (
          <div className={styles['category-popup-overlay']}>
            <BooksCategoryPopup
              categories={bookCategories}
              onClosed={handleCloseCategory}
            />
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
                  selectedValue={searchState.category}
                  selectedSort={searchState.sortBy}
                  options={mappedCategories}
                  onSelectChange={handleCategoryChange}
                  onSortChange={handleSortChange}
                />
                {books.map((book, idx) => {
                  const averageRating = averageRatings[idx] ?? 0;
                  return (
                    <BookListItem
                      key={book.id}
                      imageUrl={book.coverThumbnailUrl}
                      title={book.title}
                      author={book.author}
                      publisher={book.publisher}
                      publishedAt={book.publishedAt}
                      averageRating={averageRating}
                      rentalAmount={book.rentalAmount}
                      purchaseAmount={book.purchaseAmount}
                      discountedPurchaseAmount={book.discountedPurchaseAmount}
                      onImageOrTitleClicked={() => {
                        handleBookItemClick(book.id);
                        console.log(`${book.title} 도서 클릭`);
                      }}
                      onCartButtonClick={() => handleAddItemsOnCart(book.id)}
                    />
                  );
                })}
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
