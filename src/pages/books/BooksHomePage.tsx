import BestSellerSection from "../../features/books/components/BookBestSeller";
import BookSlider from "../../features/books/components/BookSlider";
import BookSectionHeader from "../../features/books/components/BookSectionHeader";
import CategoryFilterSearchBar from "../../features/books/components/CategoryFilterSearchBar";
import styles from './BooksHomePage.module.css';
import BookCardForBookSlider from "../../features/books/components/BookCardForBookSlider";
import Banner from "../../components/display/BannerSlider";
import Footer from "../../components/layout/Footer";
import BooksCategoryPopup from "../../features/books/components/BooksCategoryPopup";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { booksHomeNewReleaseCategories, type BooksHomeLoaderData } from "./BooksHomePageLoader";
import { PATHS } from "../../routes/paths";

export default function BooksHomePage() {
  const navigate = useNavigate();
  
  const { top3BestSellers, booksByCategory } = useLoaderData() as BooksHomeLoaderData;
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  
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

  // Dummy data for Banners
  const banners = [
    {
      id: '1',
      mobileImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/b6184cd613704109a7e830ea4f75b515.jpg',
      desktopImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/91122066f6654d40ae83686dcb2267e5.jpg'
    },
    {
      id: '2',
      mobileImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/71a6e24dcb274056852a83b665c77d8d.jpg',
      desktopImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/c9797b7b332d4670bc364e17f17a597f.jpg'
    },
    {
      id: '3',
      mobileImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/4a317505f8364ad2b08322d77ed51823.jpg',
      desktopImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/32d8920d082e410bb65f661b5651b97b.jpg'
    },
    {
      id: '4',
      mobileImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/f246603304ea4bfba8627ecc13895ee8.jpg',
      desktopImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/b6c6814fda0848f6b6b00cedcb684c0e.jpg'
    }
  ]; 

  return (
    <>
      <main className={styles['book-home-main']}>
        <CategoryFilterSearchBar
          onSearched={handleSearch}
          onCategoryToggled={toggleCategory}
        />
        {isCategoryPopupOpen && (
          <div className={styles['category-popup-overlay']}>
            <BooksCategoryPopup onClosed={handleCloseCategory} />
          </div>
        )}
        <section>
          <Banner items={banners}/>
        </section>
        <div className={styles['book-contents-container']}>
          <section className={styles['best-seller-section']}>
            <BookSectionHeader 
              headerTitle="문앞 베스트"
              onClicked={() => console.log('문앞 베스트 더보기 클릭')}
            />
            <BestSellerSection
              top3Books={top3BestSellers}
              onFirstBookClicked={() => {
                navigate(PATHS.booksDetails);
                console.log('1위 도서 클릭');
              }}
              onSecondBookClicked={() => console.log('2위 도서 클릭')}
              onThirdBookClicked={() => console.log('3위 도서 클릭')}
            />
          </section>

          {/* Render category-specific sliders */}
          {booksHomeNewReleaseCategories.map(cat => (
            <section key={cat.key} className={styles['book-slider-section']}>
              <BookSectionHeader 
                headerTitle="새로나온 책" 
                categoryName={cat.label}
                onClicked={() => console.log(`${cat.label} 더보기 클릭`)}
              />
              <BookSlider>
                {(booksByCategory[cat.key] || []).map(book => (
                  <BookCardForBookSlider
                    key={book.id}
                    imageUrl={book.coverThumbnailUrl}
                    title={book.title}
                    author={book.author}
                    publisher={book.publisher}
                    onImageOrTitleClicked={() =>
                      console.log(`${book.title}(id:${book.id}) 클릭`)
                    }
                  />
                ))}
              </BookSlider>
            </section>
          ))}
        </div>
      </main>
      <Footer/>
    </>
  );
}
