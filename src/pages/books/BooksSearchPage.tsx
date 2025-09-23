import CategoryFilterSearchBar from "../../features/books/components/CategoryFilterSearchBar";
import styles from './BooksSearchPage.module.css';
import Footer from "../../components/layout/Footer";
import BooksCategoryPopup from "../../features/books/components/BooksCategoryPopup";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SEARCH_OPTIONS } from "../../features/books/types.ts";
import BookListItem from "../../features/books/components/BookListItem";
import BookListHeader from "../../features/books/components/BookListHeader";
import BookFilterSidebar from "../../features/books/components/BookFilterSidebar";

export default function BooksSearchPage() {
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const searchBy = searchParams.get('by'); // 'title' | 'author' | 'publisher'
  const searchKeyword = searchParams.get('keyword');
  const label = SEARCH_OPTIONS.find(option => option.value === searchBy)?.label ?? '';  
  const navigate = useNavigate();

  const handleSearch = (searchBy: 'title' | 'author' | 'publisher', searchKeyword: string) => {
    navigate(`/books/search?by=${searchBy}&keyword=${encodeURIComponent(searchKeyword)}`);
    console.log('🔍 검색 실행:', { searchBy, searchKeyword });
  };

  const toggleCategory = () => {
    setIsCategoryPopupOpen(prev => !prev);
    console.log(`📂 카테고리 ${!isCategoryPopupOpen ? '열기' : '닫기'}`);
  };

  const handleCloseCategory = () => {
    setIsCategoryPopupOpen(false);
    console.log('📂 카테고리 팝업 닫기');
  };

    // Dummy data for BookSlider
  const booksummarys = [
    {
      id: '1',
      imageUrl:'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788936439743.jpg',
      title:'혼모노',
      author:'성해나',
      publisher:'창비',
      publishedAt:'2025-01-05',
      averageRating: 4.8,
      rentalAmount: 1500,
      purchaseAmount: 30000
    },
    {
      id: '2',
      imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788998441012.jpg',
      title: '모순',
      author: '양귀자',
      publisher: '쓰다',
      publishedAt:'2025-01-05',
      averageRating: 4.2,
      rentalAmount: 1500,
      purchaseAmount: 33000
    },
    {
      id: '3',
      imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791141602376.jpg',
      title: '안녕이라 그랬어',
      author: '김애란',
      publisher: '문학동네',
      publishedAt:'2025-01-05',
      averageRating: 5.0,
      rentalAmount: 1500,
      purchaseAmount: 42000
    },
    {
      id: '4',
      imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791199305304.jpg',
      title: '자몽살구클럽',
      author: '한로로',
      publisher: '어센틱',
      publishedAt:'2025-01-05',
      averageRating: 4.3,
      rentalAmount: 1500,
      purchaseAmount: 23000
    },
    {
      id: '5',
      imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791168343108.jpg',
      title: '양면의 조개껍데기',
      author: '김초엽',
      publisher: '래빗홀',
      publishedAt:'2025-01-05',
      averageRating: 3.8,
      rentalAmount: 1500,
      purchaseAmount: 18000
    },
    {
      id: '6',
      imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788936434120.jpg',
      title: '소년이 온다',
      author: '한강',
      publisher: '창비',
      publishedAt:'2025-01-05',
      averageRating: 3.4,
      rentalAmount: 1500,
      purchaseAmount: 29000
    },
    {
      id: '7',
      imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788998441074.jpg',
      title: '나는 소망한다 내게 금지된 것을',
      author: '양귀자',
      publisher: '쓰다',
      publishedAt:'2025-01-05',
      averageRating: 4.2,
      rentalAmount: 1500,
      purchaseAmount: 32000
    }
  ];

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
          <span
            className={styles['book-search-info']}
          >
            🔍 "{label}" 기준으로 "{searchKeyword}"를 검색한 결과
          </span>
          <div className={styles['book-search-contents']}>
            <div className={styles['book-search-sidebar']}>
              <BookFilterSidebar/>
            </div>
            <div className={styles['book-search-results-container']}>
              {/* TODO: 현재는 길이로 맞춰놨음. API 적용시 조회한 totalItems로 변경할 것 */}
              <div className={styles['book-search-results']}>
                <BookListHeader totalCount={booksummarys.length}/>
                {booksummarys.map((book) => (
                  <BookListItem
                    key={book.id}
                    imageUrl={book.imageUrl}
                    title={book.title}
                    author={book.author}
                    publisher={book.publisher}
                    publishedAt={book.publishedAt}
                    averageRating={book.averageRating}
                    rentalAmount={book.rentalAmount}
                    purchaseAmount={book.purchaseAmount}
                    onImageOrTitleClicked={() => console.log(`${book.title} 도서 클릭`)}
                  />
                ))}
              </div>
              <div className={styles['book-search-pagination']}>
                {/* TODO: 페이지네이션 작성할 것 */}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
