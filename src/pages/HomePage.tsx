import { ToastContainer, toast } from 'react-toastify';
import BookOrderBottomBar from '../features/books/components/BookOrderBottomBar';
import ProductOrderBottomBar from '../features/products/components/ProductOrderBottomBar';
import s from './HomePage.module.css';

export default function HomePage() {

  /* This is a sample code */
  const qty = (n: number) => toast(`수량: ${n}`);
  const fav = (isFav?: boolean) => toast(isFav === undefined ? '찜 토글' : (isFav ? '찜 추가' : '찜 해제'));
  const gift = () => toast('선물하기 클릭');
  const addToCart = () => toast.success('장바구니 담김');
  const buyNow = () => toast('바로구매 클릭');
  const rent = () => toast('대여하기 클릭');

  return (
    <main className={s['home-layout']}>
      <ToastContainer position="top-center" />
      <ProductOrderBottomBar
        priceAmount={15000}
        onQuantityChange={qty}
        onFavoriteButtonClick={fav}
        onSendAsGiftButtonClick={gift}
        onAddToCartButtonClick={addToCart}
        onBuyNowButtonClick={buyNow} />
      <BookOrderBottomBar
        rentalPriceAmount={2500}
        purchasePriceAmount={17550}
        onQuantityChange={qty}
        onFavoriteButtonClick={fav}
        onSendAsGiftButtonClick={gift}
        onRentButtonClick={rent}
        onAddToCartButtonClick={addToCart}
        onBuyNowButtonClick={buyNow} />
    </main>
  );
}
