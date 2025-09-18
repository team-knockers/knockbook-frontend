import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-ignore
import 'swiper/css'; // Don't remove this line
import styles from '../styles/BookSlider.module.css';
import BookCardForBookSlider from './BookCardForBookSlider';

type Book = {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
};

type BookSliderProps = {
  books: Book[];
};

export default function BookSlider({ books }: BookSliderProps) {
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
        },
      }}
    >
      {books.map((book) => (
        <SwiperSlide key={book.id}>
          <BookCardForBookSlider
            imageUrl={book.imageUrl}
            title={book.title}
            author={book.author}
            publisher={book.publisher}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
