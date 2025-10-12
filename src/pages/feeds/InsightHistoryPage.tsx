import s from './InsightHistoryPage.module.css'
import { useState } from "react";
import OneWayButton from '../../components/forms/OneWayButton';

import bookImg from '../../assets/feed_slider_img1.png'

type Book = {
  id: number;
  imageUrl: string;
  title: string;
  author: string;
  rentalDate: string;
  returnDate: string;
  isReviewed: boolean;
};

export default function InsightHistoryPage() {

  // dummy data
  const totalCount = 8;

  const [books, setBooks] = useState<Book[]>([
    { 
      id: 1, 
      imageUrl: bookImg,
      title: "가면산장 살인사건", 
      author: "하가시노 게이고",
      rentalDate: "2025-07-15",
      returnDate: "2025-07-30", 
      isReviewed: false 
    },
    { 
      id: 2, 
      imageUrl: bookImg,
      title: "살인자의 기억법", 
      author: "김영하", 
      rentalDate: "2025-07-15", 
      returnDate: "2025-07-30", 
      isReviewed: true 
    },
    { id: 3, 
      imageUrl: bookImg, 
      title: "동물농장", 
      author: "조지 오웰", 
      rentalDate: "2025-06-24", 
      returnDate: "2025-07-05", 
      isReviewed: false 
    },
    { id: 4, 
      imageUrl: bookImg, 
      title: "동물농장", 
      author: "조지 오웰", 
      rentalDate: "2025-06-30", 
      returnDate: "2025-06-11", 
      isReviewed: true 
    },
    { id: 5, 
      imageUrl: bookImg, 
      title: "동물농장", 
      author: "조지 오웰", 
      rentalDate: "2025-06-30", 
      returnDate: "2025-06-11", 
      isReviewed: false 
    },
    { 
      id: 6, 
      imageUrl: bookImg,
      title: "가면산장 살인사건", 
      author: "하가시노 게이고",
      rentalDate: "2025-07-15",
      returnDate: "2025-07-30", 
      isReviewed: false 
    },
    { 
      id: 7, 
      imageUrl: bookImg,
      title: "살인자의 기억법", 
      author: "김영하", 
      rentalDate: "2025-07-15", 
      returnDate: "2025-07-30", 
      isReviewed: true 
    },
    { id: 8, 
      imageUrl: bookImg, 
      title: "동물농장", 
      author: "조지 오웰", 
      rentalDate: "2025-06-24", 
      returnDate: "2025-07-05", 
      isReviewed: false 
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const filterOptions = [
    { value: "all", label: "전체보기" },
    { value: "review", label: "리뷰작성" },
    { value: "completed", label: "리뷰작성 완료" }
  ];
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
  };

  const handleReviewClick = (id: number) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, isReviewed: true } : book
      )
    );
    const book = books.find(b => b.id === id);
    console.log(`${book?.title} 리뷰 작성`);
  };

  return (
  <div className={s['page-layout']}>
    <div className={s['user-review-wrapper']}>
      <p>문 앞의 책방과 함께해주신 책이에요</p>
      <div className={s['review-header']}>
        <div className={s['review-header-left']}>
          <span className={s['total-count']}>총 {totalCount}권</span>
        </div>
        <div className={s['review-header-right']}>
          <div className={s['filter-wrapper']}>
            <select
              className={s['filter-select']}
              value={selectedFilter}
              onChange={handleFilterChange}
            >
              {filterOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className={s['user-review-list']}>
        {books.map(book => (
          <div key={book.id} className={s['book-review-item']}>
            <img 
              className={s['book-image']} 
              src={book.imageUrl} 
              alt={`${book.title} 표지`} 
            />
            <div className={s['book-info-wrapper']}>
              <div className={s['book-info']}>
                <div className={s['book-title']}>
                  {book.title}
                </div>
                <div className={s['book-author']}>
                  {book.author}
                </div>
                <div className={s['book-dates']}>
                  대여일 {book.rentalDate} | 반납일 {book.returnDate}
                </div>
              </div>
              <div className={s['book-action']}>
                {!book.isReviewed ? (
                  <OneWayButton
                    content="리뷰작성"
                    responsiveType="fluid"
                    widthSizeType="sm"
                    heightSizeType="sm"
                    colorType="dark"
                    onClick={() => handleReviewClick(book.id)}
                  />
                ) : (
                  <OneWayButton
                    content="리뷰작성 완료"
                    responsiveType="fluid"
                    widthSizeType="sm"
                    heightSizeType="sm"
                    colorType="outline"
                    onClick={() => console.log(`${book.title} 리뷰 작성 완료`)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}
