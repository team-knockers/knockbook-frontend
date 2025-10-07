import CategoryFilterSearchBar from "../../features/books/components/CategoryFilterSearchBar";
import styles from './styles/BooksCategoryPage.module.css';
import Banner from "../../components/display/BannerSlider";
import Footer from "../../components/layout/Footer";
import BooksCategoryPopup from "../../features/books/components/BooksCategoryPopup";
import { useState } from "react";
import { Outlet, useLoaderData, useNavigate, useParams } from "react-router-dom";
import TwoLevelTabMenu from "../../components/navigation/TwoLevelTabMenu";
import { bookBannersDummy } from "../../features/books/resources/bookDetailsPage.dummy";
import { categoryOptions } from "../../features/books/types";
import type { BooksCategoryLoaderData } from "./BooksCategory.loader";

export default function BooksCategoryPage() {
  const navigate = useNavigate();

  const { bookCategories } = useLoaderData() as BooksCategoryLoaderData;
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

  const params = useParams();
  const categoryCodeName = params.categoryCodeName;
  const categoryLabel = categoryOptions.find(c => c.value === categoryCodeName)?.label ?? categoryCodeName;


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

  return (
    <>
      <main className={styles['book-category-main']}>
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
        <h1 className={styles['book-category-title']}>
          {`카테고리: ${categoryLabel}`}
        </h1>
        <section>
          <Banner items={banners}/>
        </section>
        <TwoLevelTabMenu
          leftTabTitle="홈"
          rightTabTitle="전체보기"
          leftTabPath="home"
          rightTabPath="all"
        />
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}
