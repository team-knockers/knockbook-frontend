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
  const { mbtiRecommendations, preferenceRecommendations } = useLoaderData() as HomeLoaderData;

  const homeBookBannerImage = homeBookBannerImageDummy;
  const homeProductBannerImage = homeProductBannerImageDummy;

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
        <h2 className={s['section-title']}>ISFP의 선택</h2>
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
                console.log(`${book.title} 클릭`);
              }}
            />
          ))}
        </BookSlider>
      </section>
      <section className={s['home-section']}>
        <h2 className={s['section-title']}>요리를 좋아하는 당신에게</h2>
        <BookSlider>
          {preferenceRecommendations.map(book => (
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
    </main>
  );
}
