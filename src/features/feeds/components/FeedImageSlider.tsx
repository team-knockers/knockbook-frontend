import styles from "./styles/FeedImageSlider.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';
// @ts-ignore
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import type { FeedImages } from "../types";

type FeedCardSliderProps = {
  items: FeedImages[];
};

export default function FeedCardSlider({ items }: FeedCardSliderProps) {
  return (
    <Swiper
      className={styles['slider-layout']}
      slidesPerView={1}
      grabCursor={true}
      modules={[Navigation, Pagination]}
      navigation={items.length > 1}
      pagination={{ clickable: true }}
    >
      {items.map((items) => (
        <SwiperSlide key={items.id}>
          <img
            className={styles['slider-img']}
            src={items.url}
            alt={`${items.id}피드 이미지`}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
