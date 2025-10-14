import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
// @ts-ignore
import 'swiper/css'; // Don't remove this line
// @ts-ignore
import 'swiper/css/navigation'; // Don't remove this line
import styles  from './BannerSlider.module.css';

type Banner = {
  id: string;
  mobileImageUrl: string;
  desktopImageUrl: string;
  onClicked?: () => string | void;
};

type BannerSliderProps = {
  items: Banner[];
};

export default function BannerSlider({ items }: BannerSliderProps) {
  const uid = useRef(`bnr-${Math.random().toString(36).slice(2, 9)}`).current;
  const prevId = `${uid}-prev`;
  const nextId = `${uid}-next`;

  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [index, setIndex] = useState(1);

  const togglePlay = () => {
    if (!swiperRef) return;
    if (isPlaying) {
      swiperRef.autoplay?.stop();
      setIsPlaying(false);
    } else {
      swiperRef.autoplay?.start();
      setIsPlaying(true);
    }
  };

  return (
    <div className={styles['banner-wrapper']}>
      <div className={styles['banner-viewport']}>
        <button id={prevId} className={styles['nav-prev']} aria-label="Previous slide" />
        <button id={nextId} className={styles['nav-next']} aria-label="Next slide" />

        <div className={styles['banner-mask']}>
          <Swiper
            className={styles['banner-layout']}
            modules={[Autoplay, Navigation]}
            slidesPerView={1}
            loop
            grabCursor
            speed={320}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={{ prevEl: `#${prevId}`, nextEl: `#${nextId}` }}
            onSwiper={setSwiperRef}
            onSlideChange={(s) => setIndex((s.realIndex ?? 0) + 1)}
          >
            {items.map((b) => (
              <SwiperSlide key={b.id}>
                <picture>
                  <source media="(max-width: 1023.98px)" srcSet={b.mobileImageUrl} />
                  <img
                    className={styles['banner-swiper-img']}
                    src={b.desktopImageUrl}
                    alt={`Banner ${b.id}`}
                    onClick={b.onClicked}
                  />
                </picture>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={styles['banner-controls']}>
          <button
            type="button"
            className={styles['ctrl-pause']}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
            title={isPlaying ? '일시정지' : '재생'}
          >
            {isPlaying ? 'Ⅱ' : '▶'}
          </button>
          <div className={styles['ctrl-page']}>
            <span className={styles['page-now']}>{index}</span>
            <span className={styles['page-sep']}>/</span>
            <span className={styles['page-all']}>{items.length}</span>
            <span className={styles['page-more']}>+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
