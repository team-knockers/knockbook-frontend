import ProductBottomBar from '../features/products/components/ProductBottomBar';
import s from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={s['home-layout']}>
      <ProductBottomBar
        priceAmount={15000}
        onQuantityChange={() => {/* TODO */}}
        onFavoriteButtonClick={() => {/* TODO */}}
        onSendAsGiftButtonClick={() => {/* TODO */}}
        onAddToCartButtonClick={() => {/* TODO */}}
        onBuyNowButtonClick={() => {/* TODO */}} />
    </main>
  );
}
