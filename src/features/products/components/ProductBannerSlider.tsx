import { useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import styles from './styles/ProductBannerSlider.module.css';
// @ts-ignore
import 'swiper/css/bundle';

type Props = {
  images?: string[];
  autoplayDelay?: number;
};

// 배너 이미지 상품 ID : 184, 21, 41, 61, 26, 141
const DEFAULT_IMAGES: string[] = [
  'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1402/hot1697007415660.jpg',
  'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1657/hot1675754690830.jpg',
  'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1804/hot1752025081153.jpg',
  'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1555/hot1679475438267.jpg',
  'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1271/hot1750382587476.png',
  'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1565/hot1739786009041.jpg',
];

type TextItem = {
  badge: string;
  title1: string;
  title2: string;
  desc: string;
  tone?: 'light' | 'dark';
};

const TEXTS: TextItem[] = [
  { badge: 'HOT', title1: '하루를 바꾸는 힘', title2: '2026 컴포지션', desc: '당신의 목표를 현실로 만드는 COMPOSITION', tone: 'dark' },
  { badge: 'NEW', title1: '익숙한 일상 속',   title2: '특별한 한 페이지', desc: 'KNOCKBOOK X SOYMIXX', tone: 'light' },
  { badge: 'HOT', title1: 'FALL',             title2: 'IN BOOK',         desc: '#가을 북 코디템 추천', tone: 'dark' },
  { badge: 'NEW', title1: '푸른 새벽을 닮은', title2: '책장',             desc: '라인런던 2026 SEASON OPEN', tone: 'dark' },
  { badge: 'NEW', title1: '책과 마주하는',    title2: '마음으로',         desc: '문앞의책방 X PAPERCOLLECTION', tone: 'dark' },
  { badge: 'NEW', title1: '가을 밤의',        title2: '몰입 독서',        desc: '울티 플로우 북라이트 재입고 기념 단독 EVENT!', tone: 'light' },
];

export default function ProductBannerSlider({ images, autoplayDelay = 2800 }: Props) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const imgs = images?.length ? images : DEFAULT_IMAGES;
  const slides = useMemo(
    () => imgs.map((src, i) => ({ src, ...(TEXTS[i] ?? { badge: '', title1: '', title2: '', desc: '', tone: 'light' as const }) })),
    [imgs]
  );

  return (
    <section className={styles['banner']}>
      <Swiper
        className={styles['swiper']}
        modules={[Autoplay, Pagination, Navigation]}
        loop
        speed={650}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onSwiper={(swiper) => {
          swiper.navigation.init();
          swiper.navigation.update();
        }}

        allowTouchMove
        grabCursor
        threshold={6}
        centeredSlides
        slidesPerView="auto"
        spaceBetween={16}
        resistanceRatio={0}
        breakpoints={{
          1024: {
            centeredSlides: false,
            slidesPerView: 3,
            spaceBetween: 0,
            allowTouchMove: false,   
            autoplay: false,        
          },
        }}
      >
        <button 
          slot="container-start" 
          ref={prevRef} 
          className={`${styles['nav']} ${styles['prev']}`}
        >
          <svg 
            className={styles['navIcon']} 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path 
              d="M15.5 4.5L8 12l7.5 7.5" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </button>
        <button 
          slot="container-start" 
          ref={nextRef} 
          className={`${styles['nav']} ${styles['next']}`}
        >
          <svg 
            className={styles.navIcon} 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path 
              d="M8.5 4.5L16 12l-7.5 7.5" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </button>

        {slides.map((s, i) => (
          <SwiperSlide 
            key={i} 
            className={styles['slide']}
          >
            <div className={styles['card']}>
              <img 
                className={styles['img']} 
                src={s.src} 
                alt={`banner ${i + 1}`} 
                loading="lazy" 
              />
              {(s.badge || s.title1 || s.title2 || s.desc) && (
                <div className={`${styles['overlay']} ${s.tone === 'dark' ? styles['textDark'] : styles['textLight']}`}>
                  {s.badge && <span className={styles['badge']}>{s.badge}</span>}
                  {(s.title1 || s.title2) && (
                    <div className={styles['title']}>
                      {s.title1 && <span className={styles['titleLine']}>{s.title1}</span>}
                      {s.title2 && <span className={styles['titleLine']}>{s.title2}</span>}
                    </div>
                  )}
                  {s.desc && <div className={styles['desc']}>{s.desc}</div>}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
