import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-ignore
import 'swiper/css'; // Don't remove this line
import styles from './styles/BookSlider.module.css';
import BookCardForBookSlider from './BookCardForBookSlider';
import type { BookSliderItem } from '../types';

type BookSliderProps = {
  sliderBooks: BookSliderItem[];
};

export default function BookSlider({ sliderBooks }: BookSliderProps) {
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
      {sliderBooks.map((book) => (
        <SwiperSlide key={book.id}>
          <BookCardForBookSlider
            imageUrl={book.imageUrl}
            title={book.title}
            author={book.author}
            publisher={book.publisher}
            onImageOrTitleClicked={() => console.log(`${book.title} 도서 클릭(id:${book.id})`)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
