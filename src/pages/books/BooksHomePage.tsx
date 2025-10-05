import styles from './styles/BooksHomePage.module.css';
import BestSellerSection from "../../features/books/components/BookBestSeller";
import BookSlider from "../../features/books/components/BookSlider";
import BookSectionHeader from "../../features/books/components/BookSectionHeader";
import CategoryFilterSearchBar from "../../features/books/components/CategoryFilterSearchBar";
import BookCardForBookSlider from "../../features/books/components/BookCardForBookSlider";
import Banner from "../../components/display/BannerSlider";
import Footer from "../../components/layout/Footer";
import BooksCategoryPopup from "../../features/books/components/BooksCategoryPopup";
import { useState } from "react";
import { generatePath, useLoaderData, useNavigate } from "react-router-dom";
import { booksHomeNewReleaseCategories, type BooksHomeLoaderData } from "./BooksHome.loader";
import { PATHS } from "../../routes/paths";
import { bookBannersDummy } from '../../features/books/resources/bookDetailsPage.dummy';

export default function BooksHomePage() {
  const navigate = useNavigate();
  
  const { top3BestSellers, booksByCategory } = useLoaderData() as BooksHomeLoaderData;
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

  const banners = bookBannersDummy;
  
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

  const handleBookItemClick = (id: string) => {
    navigate(generatePath(PATHS.bookDetails, { bookId: id }));
  };

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
                handleBookItemClick(top3BestSellers[0].id);
                console.log('1위 도서 클릭');
              }}
              onSecondBookClicked={() => {
                handleBookItemClick(top3BestSellers[1].id);
                console.log('2위 도서 클릭');
              }}
              onThirdBookClicked={() => {
                handleBookItemClick(top3BestSellers[2].id);
                console.log('3위 도서 클릭');
              }}
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
                    onImageOrTitleClicked={() => {
                      handleBookItemClick(book.id);
                      console.log(`${book.title} 클릭`);
                    }}
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
