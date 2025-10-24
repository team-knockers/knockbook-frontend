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
import Footer from '../components/layout/Footer';

import { useState, useEffect, useRef } from 'react';
import { FeedService } from '../features/feeds/services/FeedService';
import type { FeedPost } from '../features/feeds/types';

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

export const todayBookDummy = {
  book: {
    id: "1",
    title: "다정한 사람이 이긴다",
    author: "이혜린",
    coverImage:
      "https://image.millie.co.kr/service/cover/180115960/c872d40651af4bd1b62a07265cb9a9f2.jpg?w=352&f=webp&q=80",
  },
  reviewer: {
    username: "홍길동",
    review: "착해지고 싶을 때 다시 읽기",
  },
};

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
  const randomFiveStarReview = data.randomFiveStarReview ?? null;

  const homeBookBannerImage = homeBookBannerImageDummy;
  const homeProductBannerImage = homeProductBannerImageDummy;

  const hasFavorites = !!(favoriteCategories && favoriteCategories.length > 0);
  const mbtiSectionTitle = myMbti ? `${myMbti}의 선택` : '이러한 책들은 어떠세요?';

  const [feedItems, setFeedItems] = useState<FeedPost[]>([]);
  const [after, setAfter] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const ioRef = useRef<HTMLDivElement|null>(null);

  async function loadMore() {
    if (loading || ended) return;
    setLoading(true);
    try {
      const res = await FeedService.getFeedPostList(4, after, undefined, undefined);
      setFeedItems(prev => [...prev, ...res.feedPosts]);
      setAfter(res.nextAfter);
      if (!res.nextAfter) setEnded(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setFeedItems([]); setAfter(null); setEnded(false);
    loadMore();
  }, []);

  useEffect(() => {
    const el = ioRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ioRef.current, after, loading, ended]);

  const handleFeedItemClick = () => {
    navigate(PATHS.feed);
  }

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

      {/* Book-category */}
      <div className={s['book-category-layout']}>
        {categories && categories.length > 0 && (
          <div className={s['category-buttons']}>
            {categories.map((cat) => (
              <div 
                className={s['category-item']}
                key={cat.id} 
              >
                <button
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
                </button>
                <span className={s['category-name']}>
                  {cat.categoryDisplayName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today Book */}
      {randomFiveStarReview && (
        <div className={s['today-book-layout']}>
          <div className={s['today-book-header']}>
            <h2>오늘의 인생책</h2>
          </div>
          <div className={s['today-book-card']}>
            <div 
              className={s['today-book-image']}
              style={{ backgroundImage: `url(${randomFiveStarReview.coverThumbnailUrl})` }}
              >
              <img
                src={randomFiveStarReview.coverThumbnailUrl}
                alt={`${randomFiveStarReview.displayName}님의 추천 책 이미지`}
                onClick={()=> {handleBookItemClick(randomFiveStarReview.bookId)}}
              />
            </div>

            <div className={s['today-book-info']}>
              <div className={s['today-book-content']}>
                <h3>문앞의 책방 회원의 인생책</h3>
                <p className={s['today-book-sub']}>
                  {randomFiveStarReview.displayName}님의 추천
                </p>
              </div>
              <div>
                <p className={s['today-book-review']}>
                  "{randomFiveStarReview.content}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
        const catDisplayName = data.favoriteCategoryDisplayNames?.[idx];
        const title = hasFavorites && catDisplayName
          ? `${catDisplayName} 장르를 좋아하는 당신에게`
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

      {/* Ad banner */}
      <div className={s['ad-banner-layout']}>
        <img
          className={s['ad-banner-img']}
          src="https://contents.kyobobook.co.kr/advrcntr/IMAC/creatives/2025/09/29/59288/595x180.png"
          alt="Ad banner 1"
        />
        <img
          className={s['ad-banner-img']}
          src="https://contents.kyobobook.co.kr/advrcntr/IMAC/creatives/2025/10/16/69461/pc_wtight_20251027.png"
          alt="Ad banner 2"
        />
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

      {/* Feed card */}
      <div className={s['feed-card-layout']}>
        <div className={s['feed-card-header']}> 
          <h2>새로 올라온 피드 보셨나요?</h2>
          <p>회원들의 피드 구경해보세요</p>
        </div>
        <div className={s['feed-card-wrapper']}>
          {feedItems.map(feed => (
            <button
              onClick={handleFeedItemClick}
              key={feed.postId}
            >
              <div key={feed.postId} className={s['feed-card']}>
                <div className={s['feed-image-wrapper']}>
                  <img 
                    className={s['feed-image']}
                    src={feed.images[0] ?? ''} 
                    alt={`feed-${feed.postId}`} 
                  />
                  <div className={s['feed-user-info']}>
                    <img 
                      className={s['feed-profile']}
                      src={feed.avatarUrl ?? ''} 
                      alt={`${feed.displayName}-profile`} 
                    />
                    <span className={s['feed-user-id']}>
                      {feed.displayName}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* sentinel */}
        <div ref={ioRef} className={s['io-sentinel']} />
      </div>
      <Footer />
    </main>
  );
}
