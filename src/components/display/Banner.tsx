import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
// @ts-ignore
import 'swiper/css'; // Don't remove this line
// @ts-ignore
import 'swiper/css/navigation'; // Don't remove this line
import styles  from './Banner.module.css';

type Banner = {
  id: string;
  mobileImageUrl: string;
  desktopImageUrl: string;
};

type BannersProps = {
  banners: Banner[];
};

export default function Banner({ banners }: BannersProps) {
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
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <picture>
              <source media="(max-width: 1023.98px)" srcSet={banner.mobileImageUrl} />
              <img
                className={styles['banner-swiper-img']}
                src={banner.desktopImageUrl}
                alt={`Banner ${banner.id}`}
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
