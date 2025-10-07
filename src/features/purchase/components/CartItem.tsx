import { Input } from 'reactstrap';
import s from './CartItem.module.css';
import Counter from '../../../components/forms/Counter';
import { FiX } from 'react-icons/fi';
import { formatWon } from '../utils/formatter';
import { useState } from 'react';

type CartItemProps = {
  imgUrl: string,
  title: string,
  listPrice?: number,
  salePrice: number,
  quantity: number,
  isSelected: boolean,
  onSelectChange: (isSelected: boolean) => void;
  onQtyChange: (qty: number) => void;
  onDeleteClick: () => void;
}

export default function CartItem({
  imgUrl,
  title,
  listPrice,
  salePrice,
  quantity,
  isSelected,
  onSelectChange,
  onQtyChange,
  onDeleteClick,
} : CartItemProps) {

  const [qty, setQty] = useState(quantity);

  const getDiscountPercentage = (
    listPrice: number,
    discountPrice: number) => {
      if (!Number.isFinite(listPrice) || listPrice <= 0) {
        return 0;
      }

      if (!Number.isFinite(discountPrice) || discountPrice >= listPrice) {
        return 0;
      }

      const res = Math.floor(((listPrice - discountPrice) / listPrice) * 100);
      return `${res}%`;
  };

  return (
    <div className={s['cart-item-layout']}>
      <div className={s['cart-item-check']}>
        <Input
          type="checkbox"
          checked={isSelected}
          onChange={e => onSelectChange(e.target.checked)}/>
      </div>
      <div className={s['cart-item-image-wrapper']}>
        <img 
          className={s['cart-item-image']}
          src={imgUrl}/>
      </div>
      <div className={s['cart-item-description']}>
        <div className={s['cart-item-title']}>
          <span>{title}</span>
        </div>
        <div className={s['cart-item-qty']}>
          <Counter 
            initial={qty}
            onChange={value => { setQty(value); onQtyChange(value); }}/>
        </div>
        <div className={s['cart-item-price']}>
          <div className={s['cart-item-list-price']}>
            {formatWon(listPrice)}
          </div>
          <div className={s['cart-item-discount-wrapper']}>
          { listPrice && (
            <div className={s['cart-item-discount-percentage']}>
              {getDiscountPercentage(listPrice, salePrice)}
            </div>
          )}
          <div className={s['cart-item-discount-price']}>
            {formatWon(salePrice)}
          </div>
          </div>
        </div>
      </div>
      <button 
        className={s['cart-item-close-btn']}
        onClick={onDeleteClick}>
          <FiX size={12} />
      </button>
    </div>
  );
}
