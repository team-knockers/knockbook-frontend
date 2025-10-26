import styles from './styles/BooksCategoryAllPage.module.css';
import { generatePath, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { sortOptions, type BookSummary, type CommonSearchState } from "../../features/books/types";
import BookListHeader from '../../features/books/components/BookListHeader';
import BookListItem from '../../features/books/components/BookListItem';
import Pagination from '../../components/navigation/Pagination';
import { PATHS } from '../../routes/paths';
import { useEffect, useState, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { BookService } from '../../features/books/services/BookService';
import { CartService } from '../../features/purchase/services/CartService';
import TwoButtonPopup from '../../components/overlay/TwoButtonPopup';

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
  const [averageRatings, setAverageRatings] = useState<(number | null)[]>([]);
  const [subcategories, setSubcategories] = useState<{ value: string, label: string }[]>([{ value: 'all', label: '전체' }]);
  const [wishlistStatusMap, setWishlistStatusMap] = useState<Record<string, boolean>>({});

  const [searchState, setSearchState] = useState<CommonSearchState>(() =>
    makeInitialState(searchParams, categoryCodeName)
  );

  // breakpoint: >=1024px is desktop
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // non-desktop infinite scroll state
  const [mobilePage, setMobilePage] = useState(1);
  const mobileLoadingRef = useRef(false);

  // 초기 wish 상태 로드
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
  const handleSubcategoryChange = (subcategoryValue: string) => {
    updateSearchStateViaUrl({ subcategory: subcategoryValue })
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

  // Sync searchState with URL changes
  useEffect(() => {
    setSearchState(makeInitialState(searchParams, categoryCodeName));
  }, [searchParams, categoryCodeName]);

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
          searchState.order
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
      loadDesktop();
    } else {
      loadMobilePage(mobilePage, mobilePage > 1);
    }

    return () => { cancelled = true; };
  }, [searchState.category, searchState.subcategory, searchState.page, searchState.size, searchState.sortBy, searchState.order, mobilePage, isDesktop]);

  // Reset mobile pagination when filters/search change while in non-desktop
  useEffect(() => {
    if (isDesktop) return;
    setMobilePage(1);
    setBooks([]);
  }, [searchState.category, searchState.subcategory, searchState.size, searchState.sortBy, searchState.order, isDesktop]);

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

  // When switching to desktop, if multiple pages were appended, reset URL page to 1 so desktop shows only first page
  useEffect(() => {
    if (!isDesktop) return;
    const pageSize = searchState.size ?? 10;
    if (books.length > pageSize) {
      setQuery(q => q.set('page', '1'));
    }
  }, [isDesktop]);

  useEffect(() => {
    if (searchState.category === 'all') {
      setSubcategories([{ value: 'all', label: '전체' }]);
      return;
    }

    const loadSubcategories = async () => {
      try {
        const res = await BookService.getBookSubcategories(searchState.category);
        const mapped = [
          { value: 'all', label: '전체' },
          ...res.map((s: any) => ({
            value: s.subcategoryCodeName,
            label: s.subcategoryDisplayName,
          })),
        ];
        setSubcategories(mapped);
      } catch (error) {
        console.error('하위 카테고리 불러오기 실패', error);
      }
    };

    loadSubcategories();
  }, [searchState.category]);

  const nav = useNavigate();
  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);
  async function handleAddItemsOnCart(bookId: string) {
    console.log("called handleAddItemsOnCart");
    await CartService.addCartPurchaseItem("BOOK_PURCHASE", bookId, 1);
    setIsCartPopupVisible(true);
  }

  return (
    <section className={styles['book-category-all-layout']}>
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

      <div className={styles['book-category-all-results']}>
        <BookListHeader
          totalCount={totalItems}
          selectedValue={searchState.subcategory}
          selectedSort={searchState.sortBy}
          options={subcategories}
          onSelectChange={handleSubcategoryChange}
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
    </section>
  );
}
