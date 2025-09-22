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
  onClicked?:() => string;
};

type BannerSliderProps = {
  items: Banner[];
};

export default function BannerSlider({ items }: BannerSliderProps) {
  return (
    <div className={styles['banner-wrapper']}>
      <Swiper
        className={styles['banner-layout']}
        slidesPerView={1}
        loop={true}
        grabCursor={true}
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={true}
      >
        {items.map((items) => (
          <SwiperSlide key={items.id}>
            <picture>
              <source media="(max-width: 1023.98px)" srcSet={items.mobileImageUrl} />
              <img
                className={styles['banner-swiper-img']}
                src={items.desktopImageUrl}
                alt={`Banner ${items.id}`}
                onClick={items.onClicked}
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
