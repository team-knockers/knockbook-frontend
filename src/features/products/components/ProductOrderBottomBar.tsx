import { useState } from 'react';
import { FiGift, FiHeart } from 'react-icons/fi';
import Counter from '../../../components/forms/Counter';
import s from './styles/ProductOrderBottomBar.module.css'
import { FaHeart } from 'react-icons/fa';

type ProductBottomBarProps = {
  priceAmount: number;
  onQuantityChange: (quantity: number) => void;
  onFavoriteButtonClick: (state: boolean) => void;
  onSendAsGiftButtonClick: () => void;
  onAddToCartButtonClick: () => void;
  onBuyNowButtonClick: () => void;
};

export default function ProductBottomBar({
  priceAmount,
  onQuantityChange,
  onFavoriteButtonClick,
  onSendAsGiftButtonClick,
  onAddToCartButtonClick,
  onBuyNowButtonClick
} : ProductBottomBarProps) {

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
          <span className={s['price-tag']}>상품 금액</span>
          <span className={s['price-amount']}>
            <strong>{priceAmount.toLocaleString("ko-KR")}</strong>원
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
