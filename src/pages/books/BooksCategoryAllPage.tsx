import styles from './styles/BooksCategoryAllPage.module.css';
import { generatePath, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { sortOptions, type BookSummary, type CommonSearchState } from "../../features/books/types";
import BookListHeader from '../../features/books/components/BookListHeader';
import BookListItem from '../../features/books/components/BookListItem';
import Pagination from '../../components/navigation/Pagination';
import { PATHS } from '../../routes/paths';
import { useEffect, useState } from 'react';
import { BookService } from '../../features/books/services/BookService';
import { PurchaseService } from '../../features/purchase/services/PurchaseService';
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
    await PurchaseService.addCartPurchaseItem("BOOK_PURCHASE", bookId, 1);
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
