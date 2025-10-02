import OneWayButton from '../../../components/forms/OneWayButton';
import styles from './styles/BookListItem.module.css';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { IoCartOutline } from "react-icons/io5";
import { useState } from 'react';
import { calculateBookDiscountRate, formatDateToDot, renderStars } from '../util';

type BookListItemProps = {
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  averageRating: number;
  rentalAmount: number;
  purchaseAmount: number;
  discountedPurchaseAmount: number;
  onImageOrTitleClicked: () => void;
};

export default function BookListItem({
  imageUrl,
  title,
  author,
  publisher,
  publishedAt,
  averageRating,
  rentalAmount,
  purchaseAmount,
  discountedPurchaseAmount,
  onImageOrTitleClicked
}: BookListItemProps) {

  const [isLiked, setIsLiked] = useState(false); // Wishlist status
  const discountRate = calculateBookDiscountRate(discountedPurchaseAmount, purchaseAmount);

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
            <div className={styles['price-block']}>
              <span className={styles['price-label']}>대여</span>
              <span className={styles['book-price-highlight']}>{rentalAmount.toLocaleString()}</span>원
            </div>
            <div className={styles['price-block']}>
              <span className={styles['price-label']}>구매</span>
              {discountedPurchaseAmount < purchaseAmount ? (
                <>
                  <span className={styles['book-discount-rate-highlight']}>{discountRate}%</span>
                  <span className={styles['book-price-highlight']}>{discountedPurchaseAmount.toLocaleString()}</span>원
                  <span className={styles['book-original-price-highlight']}>{purchaseAmount.toLocaleString()}원</span>
                </>
              ) : (
                <span className={styles['book-price-highlight']}>{purchaseAmount.toLocaleString()}원</span>
              )}
            </div>
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
