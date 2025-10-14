import s from './HomePage.module.css';
import { generatePath, useLoaderData, useNavigate } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import type { HomeLoaderData } from './Home.loader';
import BookSlider from '../features/books/components/BookSlider';
import BookCardForBookSlider from '../features/books/components/BookCardForBookSlider';
import BannerSlider from '../components/display/BannerSlider';
import ProductBanner from '../features/products/components/ProductBanner';
import ProductBannerSlider from '../features/products/components/ProductBannerSlider';
import { homeBookBannerImageDummy, homeProductBannerImageDummy } from '../features/home/resources/homePage.dummy';

export default function HomePage() {
  const navigate = useNavigate();
  const { mbtiRecommendations, preferenceRecommendations, myMbti, myFavoriteBookCategories } = useLoaderData() as HomeLoaderData;

  const homeBookBannerImage = homeBookBannerImageDummy;
  const homeProductBannerImage = homeProductBannerImageDummy;

  const hasFavorites = Array.isArray(myFavoriteBookCategories) && myFavoriteBookCategories.length > 0;

  const mbtiSectionTitle = myMbti ? `${myMbti}의 선택` : '이러한 책들은 어떠세요?';

  const handleBookItemClick = (id: string) => {
    navigate(generatePath(PATHS.bookDetails, { bookId: id }));
  };

  return (
    <main className={s['home-layout']}>
      <BannerSlider
        items={homeBookBannerImage}
      />
      <section className={s['home-section']}>
        <h2 className={s['section-title']}>오직 당신만을 위한, 문앞의 추천</h2>
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
      <section className={s['home-section']}>
        <h2 className={s['section-title']}>{mbtiSectionTitle}</h2>
        <BookSlider>
          {mbtiRecommendations.map(book => (
            <BookCardForBookSlider
              key={book.id}
              imageUrl={book.coverThumbnailUrl}
              title={book.title}
              author={book.author}
              publisher={book.publisher}
              onImageOrTitleClicked={() => {
                handleBookItemClick(book.id);
              }}
            />
          ))}
        </BookSlider>
      </section>

      {Array.isArray(preferenceRecommendations) && preferenceRecommendations.map((booksForCategory, idx) => {
        if (!booksForCategory || booksForCategory.length === 0) return null;

        const title = hasFavorites
          ? `${myFavoriteBookCategories![idx]} 장르를 좋아하는 당신에게`
          : '이런 책도 있어요';

        return (
          <section className={s['home-section']} key={`pref-${idx}`}>
            <h2 className={s['section-title']}>{title}</h2>
            <BookSlider>
              {booksForCategory.map(book => (
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
        );
      })}
    </main>
  );
}
