import { Children } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import styles from './styles/ProductBannerSlider.module.css';
//@ts-ignore
import 'swiper/css/bundle';

type SliderProps = {
  children: React.ReactNode;
};

export default function ProductBannerSlider({ children }: SliderProps) {
  const banners = Children.toArray(children);

  return (
    <section className={styles['banner']}>
      <Swiper
        className={styles['swiper']}
        modules={[Autoplay, Pagination, Navigation]}
        loop
        speed={650}
        autoplay={{ delay: 2800, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: '.phb-prev', nextEl: '.phb-next' }}
        allowTouchMove
        grabCursor
        threshold={6}
        centeredSlides
        slidesPerView='auto'
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
          slot='container-start' 
          className={`${styles['nav']} ${styles['prev']} phb-prev`}
        >
          <svg  
            className={styles['navIcon']}
            viewBox='0 0 24 24' 
            aria-hidden='true'
          >
            <path
              d='M15.5 4.5L8 12l7.5 7.5'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.6'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <button 
          slot='container-start' 
          className={`${styles['nav']} ${styles['next']} phb-next`}
        >
          <svg 
            className={styles['navIcon']} 
            viewBox='0 0 24 24' 
            aria-hidden='true'
          >
            <path
              d='M8.5 4.5L16 12l-7.5 7.5'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.6'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        {banners.map((banner, i) => (
          <SwiperSlide key={i} className={styles['slide']}>
            {banner}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
