import styles from './styles/BooksSearchPage.module.css';
import CategoryFilterSearchBar from "../../features/books/components/CategoryFilterSearchBar";
import Footer from "../../components/layout/Footer";
import BooksCategoryPopup from "../../features/books/components/BooksCategoryPopup";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { generatePath, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { SEARCH_OPTIONS, sortOptions, type BookSearchState, type BookSummary, type SearchOption } from "../../features/books/types.ts";
import BookListItem from "../../features/books/components/BookListItem";
import BookListHeader from "../../features/books/components/BookListHeader";
import BookFilterSidebar from "../../features/books/components/BookFilterSidebar";
import { BookService } from "../../features/books/services/BookService.ts";
import Pagination from "../../components/navigation/Pagination.tsx";
import { PATHS } from "../../routes/paths.ts";
import type { BooksSearchLoaderData } from './BooksSearch.loader.ts';
import { CartService } from '../../features/purchase/services/CartService.ts';
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
  const [wishlistStatusMap, setWishlistStatusMap] = useState<Record<string, boolean>>({});
  // breakpoint: >=1024px is desktop
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // mobile/infinite-scroll state (used when NOT desktop)
  const [mobilePage, setMobilePage] = useState(1);
  const mobileLoadingRef = useRef(false);
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

  // Fetch data: desktop shows single page based on URL; non-desktop appends pages (infinite scroll)
  useEffect(() => {
    let cancelled = false;

    const fetchPage = async (pageToFetch: number) => {
      try {
        const res = await BookService.getPaginatedBookSummaries(
          searchState.category,
          searchState.subcategory,
          pageToFetch,
          searchState.size,
          searchState.sortBy,
          searchState.order,
          searchState.searchBy,
          searchState.searchKeyword,
          searchState.minPrice ?? undefined,
          searchState.maxPrice ?? undefined
        );
        if (cancelled) return null;
        return res;
      } catch (err) {
        if (cancelled) return null;
        console.error('검색 결과 불러오기 실패', err);
        return null;
      }
    };

    const loadDesktop = async () => {
      const res = await fetchPage(searchState.page);
      if (!res) return;
      if (cancelled) return;
      setBooks(res.books);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);

      const bookIds = res.books.map(b => b.id);
      const avg = await Promise.all(
        bookIds.map(async id => {
          const stat = await BookService.getBookReviewStatistics(id);
          return typeof stat.averageRating === 'number' ? stat.averageRating : null;
        })
      );
      if (cancelled) return;
      setAverageRatings(avg);
    };

    const loadMobilePage = async (pageToLoad: number, append = false) => {
      mobileLoadingRef.current = true;
      const res = await fetchPage(pageToLoad);
      mobileLoadingRef.current = false;
      if (!res) return;
      if (cancelled) return;
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);

      const bookIds = res.books.map(b => b.id);
      const avg = await Promise.all(
        bookIds.map(async id => {
          const stat = await BookService.getBookReviewStatistics(id);
          return typeof stat.averageRating === 'number' ? stat.averageRating : null;
        })
      );
      if (cancelled) return;
      if (append) {
        setBooks(prev => [...prev, ...res.books]);
        setAverageRatings(prev => [...prev, ...avg]);
      } else {
        setBooks(res.books);
        setAverageRatings(avg);
      }
    };

    if (isDesktop) {
      // desktop: single page (controlled by URL)
      loadDesktop();
    } else {
      // non-desktop: load pages and append when mobilePage > 1
      loadMobilePage(mobilePage, mobilePage > 1);
    }

    return () => { cancelled = true; };
  // include searchState fields and mobilePage/isDesktop
  }, [searchState.category, searchState.subcategory, searchState.page, searchState.size, searchState.sortBy, searchState.order, searchState.searchBy, searchState.searchKeyword, searchState.minPrice, searchState.maxPrice, mobilePage, isDesktop]);

  // Reset mobile pagination when search/filter changes while in non-desktop mode
  useEffect(() => {
    if (isDesktop) return;
    setMobilePage(1);
    setBooks([]);
  }, [searchState.category, searchState.subcategory, searchState.size, searchState.sortBy, searchState.order, searchState.searchBy, searchState.searchKeyword, searchState.minPrice, searchState.maxPrice, isDesktop]);

  // Infinite scroll: when not desktop, load next page when near bottom
  useEffect(() => {
    if (isDesktop) return;
    const onScroll = () => {
      if (mobileLoadingRef.current) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 200;
      if (scrollPosition >= threshold) {
        if (mobilePage < totalPages) {
          setMobilePage(prev => prev + 1);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDesktop, mobilePage, totalPages]);

  // When switching to desktop, if we had appended multiple pages, reset to page=1 so desktop shows only first page
  useEffect(() => {
    if (!isDesktop) return;
    const pageSize = searchState.size ?? 10;
    if (books.length > pageSize) {
      setQuery(q => q.set('page', '1'));
    }
  }, [isDesktop]);

  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);
  async function handleAddItemsOnCart(bookId: string) {
    await CartService.addCartPurchaseItem("BOOK_PURCHASE", bookId, 1);
    setIsCartPopupVisible(true);
  }

  useEffect(() => {
    const loadWishlistStatus = async () => {
      const statusMap: Record<string, boolean> = {};
      await Promise.all(
        books.map(async (book) => {
          try {
            const res = await BookService.hasBookInWishlist(book.id);
            statusMap[book.id] = res.wished;
          } catch (err) {
            console.error(`Failed to get wishlist status for book ${book.id}`, err);
            statusMap[book.id] = false;
          }
        })
      );
      setWishlistStatusMap(statusMap);
    };

    if (books.length > 0) {
      loadWishlistStatus();
    }
  }, [books]);

  const handleToggleWishlist = async (bookId: string) => {
    try {
      const response = await (wishlistStatusMap[bookId]
        ? BookService.removeFromWishlist(bookId)
        : BookService.addToWishlist(bookId));

      setWishlistStatusMap(prev => ({
        ...prev,
        [bookId]: response.wishlisted
      }));

      switch(response.action) {
        case "ADDED":
        case "REMOVED":
          break;
        case "ALREADY_EXISTS":
          alert("이미 등록된 상품입니다.");
          break;
        case "NOT_FOUND":
          alert("찜 정보를 찾을 수 없습니다.");
          break;
        default:
          alert("예기치 못한 오류가 발생했습니다.");
      }

    } catch (err) {
      console.error(`Failed to toggle wishlist for book ${bookId}`, err);
      alert('위시리스트 처리 중 오류가 발생했습니다.');
    }
  };

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
            onConfirm={() => navigate(PATHS.cart)}/>
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
            <strong>"{searchByLabel}"</strong> 기준으로 <strong>"{searchState.searchKeyword}"</strong>을 검색한 결과
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
                      isWished={wishlistStatusMap[book.id]}
                      onToggleWishlist={() => handleToggleWishlist(book.id)}
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
