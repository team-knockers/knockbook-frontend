// src/pages/HomePage.tsx
import s from './HomePage.module.css';
import { generatePath, useLoaderData, useNavigate } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import type { HomeLoaderData } from './Home.loader';
import BookSlider from '../features/books/components/BookSlider';
import BookCardForBookSlider from '../features/books/components/BookCardForBookSlider';
import BannerSlider from '../components/display/BannerSlider';
import ProductBanner from '../features/products/components/ProductBanner';
import ProductBannerSlider from '../features/products/components/ProductBannerSlider';
import {
  homeBookBannerImageDummy,
  homeProductBannerImageDummy,
} from '../features/home/resources/homePage.dummy';

import Fiction from '../assets/book_icon_fiction.png';
import Essay from '../assets/book_icon_essay.png'
import Humanities from '../assets/book_icon_humanities.png'
import Parenting from '../assets/book_icon_parenting.png'
import cooking from '../assets/book_icon_cooking.png'
import health from '../assets/book_icon_health.png'
import Business from '../assets/book_icon_business.png'
import selfImprovement from '../assets/book_icon_selfimprovement.png'
import language from '../assets/book_icon_language.png'
import travel from '../assets/book_icon_travel.png'

const categoryIcons: Record<string, string> = {
  fiction: Fiction,
  essay: Essay,
  humanities: Humanities,
  parenting: Parenting,
  cooking: cooking,
  health: health,
  business: Business,
  selfImprovement: selfImprovement,
  language: language,
  travel: travel,
};


const categories = [
  { id: '1', categoryCodeName: 'fiction', categoryDisplayName: '소설' },
  { id: '2', categoryCodeName: 'essay', categoryDisplayName: '시/에세이' },
  { id: '3', categoryCodeName: 'humanities', categoryDisplayName: '인문' },
  { id: '4', categoryCodeName: 'parenting', categoryDisplayName: '가정/육아' },
  { id: '5', categoryCodeName: 'cooking', categoryDisplayName: '요리' },
  { id: '6', categoryCodeName: 'health', categoryDisplayName: '건강' },
  { id: '7', categoryCodeName: 'business', categoryDisplayName: '경제/경영' },
  { id: '8', categoryCodeName: 'selfImprovement', categoryDisplayName: '자기계발' },
  { id: '9', categoryCodeName: 'language', categoryDisplayName: '외국어' },
  { id: '10', categoryCodeName: 'travel', categoryDisplayName: '여행' },
];

export default function HomePage() {
  const navigate = useNavigate();

  // 안전한 해체
  const data = useLoaderData() as Partial<HomeLoaderData>;
  const mbtiRecommendations = data.mbtiRecommendations ?? [];
  const preferenceRecommendations = Array.isArray(data.preferenceRecommendations)
    ? data.preferenceRecommendations
    : [];
  const favoriteCategories = Array.isArray(data.myFavoriteBookCategories)
    ? data.myFavoriteBookCategories
    : undefined;
  const myMbti = data.myMbti ?? null;

  const homeBookBannerImage = homeBookBannerImageDummy;
  const homeProductBannerImage = homeProductBannerImageDummy;

  const hasFavorites = !!(favoriteCategories && favoriteCategories.length > 0);
  const mbtiSectionTitle = myMbti ? `${myMbti}의 선택` : '이러한 책들은 어떠세요?';

  const handleBookItemClick = (id: string) =>
    navigate(generatePath(PATHS.bookDetails, { bookId: id }));

  // 빈 추천 묶음 제거(인덱스 보존)
  const preferenceEntries = preferenceRecommendations
    .map((books, idx) => ({ books: Array.isArray(books) ? books : [], idx }))
    .filter(({ books }) => books.length > 0);

  return (
    <main className={s['home-layout']}>
      {/* Top Banners */}
      <div className={s['banner-layout']}>
        <BannerSlider items={homeBookBannerImage} />
      </div>

      {/* book-category-buttons */}
      <div className={s['book-category-layout']}>
        {categories && categories.length > 0 && (
          <div className={s['category-buttons']}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={s['category-button']}
                onClick={() =>
                  navigate(
                    generatePath(PATHS.booksCategory, {
                      categoryCodeName: cat.categoryCodeName,
                    })
                  )
                }
              >
                <img
                  className={s['category-icon']}
                  src={categoryIcons[cat.categoryCodeName]}
                  alt={cat.categoryDisplayName}
                />
                <span className={s['category-name']}>
                  {cat.categoryDisplayName}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={s['today-book-layout']}>
        <div></div>
      </div>

      {/* MBTI Picks */}
      <section className={s['book-slider-layout']}>
        <h2 className={s['section-title']}>{mbtiSectionTitle}</h2>
        <BookSlider>
          {mbtiRecommendations.map((book) => (
            <BookCardForBookSlider
              key={book.id}
              imageUrl={book.coverThumbnailUrl}
              title={book.title}
              author={book.author}
              publisher={book.publisher}
              onImageOrTitleClicked={() => handleBookItemClick(book.id)}
            />
          ))}
        </BookSlider>
      </section>

      {/* Preference-based (각 묶음을 개별 섹션으로 렌더) */}
      {preferenceEntries.map(({ books, idx }) => {
        const cat = favoriteCategories?.[idx]; // undefined여도 안전
        const title = hasFavorites && cat
          ? `${cat} 장르를 좋아하는 당신에게`
          : '이런 책도 있어요';

        return (
          <section className={s['book-slider-layout']} key={`pref-${idx}`}>
            <h2 className={s['section-title']}>{title}</h2>
            <BookSlider>
              {books.map((book) => (
                <BookCardForBookSlider
                  key={book.id}
                  imageUrl={book.coverThumbnailUrl}
                  title={book.title}
                  author={book.author}
                  publisher={book.publisher}
                  onImageOrTitleClicked={() =>
                    navigate(generatePath(PATHS.bookDetails, { bookId: book.id }))
                  }
                />
              ))}
            </BookSlider>
          </section>
        );
      })}

      <div className={s['ad-banner-layout']}>
        <div className={s['ad-banner-img']}></div>
      </div>

      {/* Product Promo */}
      <section className={s['product-slider-layout']}>
        <h2 className={s['product-slider-title']}>
          오직 당신만을 위한, 문앞의 추천
        </h2>
        <ProductBannerSlider>
          {homeProductBannerImage.map((b, i) => (
            <ProductBanner
              key={i}
              bannerImgUrl={b.bannerImgUrl}
              badge={b.badge}
              title1={b.title1}
              title2={b.title2}
              desc={b.desc}
              tone={b.tone}
            />
          ))}
        </ProductBannerSlider>
      </section>

      <div className={s['feed-card-layout']}>
        <div></div>
      </div>
    </main>
  );
}
