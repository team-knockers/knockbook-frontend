import React, { type ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
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
        520: {
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
      {React.Children.toArray(children).map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}
