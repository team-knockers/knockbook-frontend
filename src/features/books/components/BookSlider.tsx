import { Swiper, SwiperSlide } from 'swiper/react';
import type { ReactNode } from "react";
// @ts-ignore
import 'swiper/css'; // Don't remove this line
import styles from './styles/BookSlider.module.css';

type BookSliderProps = {
  children: ReactNode;
};

export default function BookSlider({ children }: BookSliderProps) {
  return (
    <Swiper
      className={styles['book-swiper']}
      spaceBetween={15}
      slidesPerView={7}
      grabCursor={true}
      freeMode={true}
      breakpoints={{
        0: {
          slidesPerView: 2.5,
        },
        480: {
          slidesPerView: 3.5,
        },
        768: {
          slidesPerView: 4.5,
        },
        1024: {
          slidesPerView: 7,
        }
      }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => <SwiperSlide key={index}>{child}</SwiperSlide>)
        : <SwiperSlide>{children}</SwiperSlide>}
    </Swiper>
  );
}
