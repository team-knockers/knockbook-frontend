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

export default function HomePage() {
  const navigate = useNavigate();

  // 안전한 해체
  const data = useLoaderData() as Partial<HomeLoaderData>;
  const mbtiRecommendations = data.mbtiRecommendations ?? [];
  const preferenceRecommendations = Array.isArray(data.preferenceRecommendations)
    ? data.preferenceRecommendations
    : [];
  const categories = Array.isArray(data.myFavoriteBookCategories)
    ? data.myFavoriteBookCategories
    : undefined;
  const myMbti = data.myMbti ?? null;

  const homeBookBannerImage = homeBookBannerImageDummy;
  const homeProductBannerImage = homeProductBannerImageDummy;

  const hasFavorites = !!(categories && categories.length > 0);
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
        const cat = categories?.[idx]; // undefined여도 안전
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
    </main>
  );
}
