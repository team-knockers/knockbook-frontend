import { FiGift, FiHeart } from 'react-icons/fi';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import Counter from '../../../components/forms/Counter';
import s from './styles/BookOrderBottomBar.module.css'

type BookOrderBottomBarProps = {
  rentalPriceAmount: number;
  purchasePriceAmount: number;
  onQuantityChange: (quantity: number) => void;
  onFavoriteButtonClick: (state: boolean) => void;
  onSendAsGiftButtonClick: () => void;
  onRentButtonClick: () => void;
  onAddToCartButtonClick: () => void;
  onBuyNowButtonClick: () => void;
};

export default function BookOrderBottomBar({
  rentalPriceAmount,
  purchasePriceAmount,
  onQuantityChange,
  onFavoriteButtonClick,
  onSendAsGiftButtonClick,
  onRentButtonClick,
  onAddToCartButtonClick,
  onBuyNowButtonClick
} : BookOrderBottomBarProps) {

  const [isFavoriteOn, setIsFavoriteOn] = useState(false);
  const handleFavoriteClick = () => {
    const newState = !isFavoriteOn;
    setIsFavoriteOn(newState);
    onFavoriteButtonClick(newState);
  };

  return (
    <div className={s['container']}>
      <div className={s['order-summary-panel']}>
          <div className={s['price-wrapper']}>
            <span className={s['price-sub-tag']}>
                대여
              </span>
            <span className={s['price-amount']}>
              <strong>{rentalPriceAmount.toLocaleString("ko-KR")}</strong>원
            </span>
            <span className={s['price-sub-tag']}>
              구매
            </span>
            <span className={s['price-amount']}>
              <strong>{purchasePriceAmount.toLocaleString("ko-KR")}</strong>원
            </span>
          </div>
          <div className={s['quantity-wrapper']}>
            <Counter onChange={onQuantityChange}/>
          </div>
        </div>
        <div className={s['order-action-panel']}>
          <button 
            className={s['favorite-button']}
            onClick={handleFavoriteClick}>
            {isFavoriteOn ? 
              <FaHeart size={20} color="red" /> 
              : <FiHeart size={20} />}
          </button>
          <div className={s['order-action-panel-right']}>
            <button
              className={s['send-as-gift-button']}
              onClick={onSendAsGiftButtonClick}>
              <span><FiGift size={20}/></span>
              <span>선물하기</span>
            </button>
            <button 
              className={s['rent-button']}
              onClick={onRentButtonClick}>
              대여하기
            </button>
            <button 
              className={s['add-to-cart-button']}
              onClick={onAddToCartButtonClick}>
              장바구니
            </button>
            <button 
              className={s['buy-now-button']}
              onClick={onBuyNowButtonClick}>
              바로구매
            </button>
          </div>
        </div>
    </div>
  );
}
