import OneWayButton from '../../../components/forms/OneWayButton';
import styles from './styles/BooklistItem.module.css';
import { IoMdStar, IoMdStarHalf, IoMdStarOutline, IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { IoCartOutline } from "react-icons/io5";
import { useState } from 'react';

type BookListItemProps = {
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  averageRating: number;
  rentalAmount: number;
  purchaseAmount: number;
  onImageOrTitleClicked: () => void;
};

/* Change localDate form "2022-05-20" → "2022.05.20" */
const formatDateToDot = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${year}.${month}.${day}`;
};

/* Convert rating to stars */
function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<IoMdStar key={`full-${i}`} />);
  }

  if (hasHalfStar) {
    stars.push(<IoMdStarHalf key="half" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<IoMdStarOutline key={`empty-${i}`} />);
  }

  return stars;
}

export default function BookListItem({
  imageUrl,
  title,
  author,
  publisher,
  publishedAt,
  averageRating,
  rentalAmount,
  purchaseAmount,
  onImageOrTitleClicked
}: BookListItemProps) {

  const [isLiked, setIsLiked] = useState(false); // Wishlist status

    const onWishlistToggled = () => {
      setIsLiked(prev => !prev);
      console.log(isLiked ? '찜 해제' : '찜하기');
    };

  return (
    <div className={styles['book-list-item']}>
      <div className={styles['book-list-wrapper']}>
        <img
          className={styles['book-image']}
          src={imageUrl}
          alt={`${title} 표지`}
          onClick={onImageOrTitleClicked}
        />
        <div className={styles['book-info']}>
          <div className={styles['book-details']}>
            <button 
              className={styles['book-title']}
              onClick={onImageOrTitleClicked}
            >
              {title}
            </button>
            <div className={styles['book-meta']}>
              {author} · {publisher} · {formatDateToDot(publishedAt)}
            </div>
            <div className={styles['book-sub-meta']}>
              {averageRating.toFixed(1)} 
              <span className={styles['star-icons']}>
                {renderStars(averageRating)}
              </span>
            </div>
          </div>
          <div className={styles['book-price']}>
            대여 <span className={styles['book-price-highlight']}>{rentalAmount.toLocaleString()}</span>원 
            · 구매 <span className={styles['book-price-highlight']}>{purchaseAmount.toLocaleString()}</span>원
          </div>
        </div>
      </div>
      {/* Mobile/Tablet only */}
      <div className={styles['icon-wrapper']}>
        {isLiked ? (
          <IoMdHeart
            color="#f73936ff"
            onClick={onWishlistToggled}
          />
        ) : (
          <IoMdHeartEmpty
            onClick={onWishlistToggled}
          />
        )}
        <IoCartOutline
          onClick={() => console.log('장바구니 버튼 클릭')}
        />
      </div>
      {/* Desktop only */}
      <div className={styles['button-wrapper']}>
        {isLiked ? (
          <OneWayButton
            content="찜 취소"
            responsiveType="fixed"
            widthSizeType="sm"
            heightSizeType="sm"
            colorType="natural"
            onClick={onWishlistToggled}
          />
        ) : (
          <OneWayButton
            content="찜하기"
            responsiveType="fixed"
            widthSizeType="sm"
            heightSizeType="sm"
            colorType="outline"
            onClick={onWishlistToggled}
          />
        )}
        <OneWayButton
          content="장바구니"
          responsiveType="fixed"
          widthSizeType="sm"
          heightSizeType="sm"
          colorType="dark"
          onClick={() => console.log('장바구니 버튼 클릭')}
        />
      </div>
    </div>
  );
}
