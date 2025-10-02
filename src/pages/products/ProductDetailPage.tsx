import styles from './styles/ProductsDetailPage.module.css';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HiStar } from 'react-icons/hi2';
import ThreeLevelTabMenu from '../../components/navigation/ThreeLevelTabMenu';
import { useLoaderData, useParams } from "react-router-dom";
import ProductBottomBar from '../../features/products/components/ProductOrderBottomBar';
import { toast } from 'react-toastify';

export default function ProductDetailPage() {
  // Get server data prepared by the route loader
  const { name, unitPriceAmount, salePriceAmount, averageRating, reviewCount, galleryImageUrls } = useLoaderData() as {
    name: string;
    unitPriceAmount: number;
    salePriceAmount: number | null;
    averageRating: number;
    reviewCount: number;
    galleryImageUrls: string[];
  };
  const { productId } = useParams();
  
  // Gallery state 
  const imgs = galleryImageUrls ?? [];
  const [selected, setSelected] = useState(0);
  const mainSrc = imgs[selected] ?? '';

  // Gallery navigation  
  const goPrev = () => {
    if (selected > 0){
      setSelected(selected - 1);
    }
  }
  const goNext = () => {
    if(selected < imgs.length - 1){
      setSelected(selected + 1);
    }
  }
  
  // Price helpers 
  const fmt = (n?: number | null) => n == null ? '-' : n.toLocaleString();
  const hasSale = salePriceAmount != null && salePriceAmount < unitPriceAmount;
  const discountRate = hasSale
    ? Math.round((1 - (salePriceAmount! / unitPriceAmount)) * 100) : 0;
  
  const purchasePriceAmount =
  salePriceAmount != null && salePriceAmount < unitPriceAmount
    ? salePriceAmount
    : unitPriceAmount;

  /* This is a sample code */
  const qty = (n: number) => toast(`수량: ${n}`);
  const fav = (isFav?: boolean) => toast(isFav === undefined ? '찜 토글' : (isFav ? '찜 추가' : '찜 해제'));
  const gift = () => toast('선물하기 클릭');
  const addToCart = () => toast.success('장바구니 담김');
  const buyNow = () => toast('바로구매 클릭');

  return (
    // key(productId): reset internal state when navigating to another product
    <main key={productId} className={styles['detail-layout']}>
      <section className={styles['detail-top']}>
        {/* Main gallery */}
        <div className={styles['gallery']}>
          <button 
            type="button" 
            className={styles['gallery-nav-prev']}
            onClick={goPrev}
            disabled={selected === 0}
          >
            &lt;
          </button>
          <img 
            className={styles['gallery-image']} 
            src={mainSrc} 
            alt={name}
          />
          <button 
            type="button" 
            className={styles['gallery-nav-next']}
            onClick={goNext}
            disabled={selected === imgs.length - 1}
          >
            &gt;
          </button>
        </div>

        {/* right section: info + images (images are hidden on mobile) */}
        <aside className={styles['aside']}>
          <div className={styles['info']}>
            <div className={styles['core-info']}>
              <div className={styles['product-title']}>{name}</div>

              {/* Pricing */}
              <div className={styles['price-info']}>
                {hasSale && (
                  <div className={styles['unit-price-amount']}>{fmt(unitPriceAmount)}원</div>
                )}
                <div>
                  {hasSale && <span className={styles['discount-rate']}>{discountRate}%</span>}
                  <span className={styles['discount-amount']}>{fmt(purchasePriceAmount)}원</span>
                </div>
              </div>

              <div className={styles['shipping-info']}>배송비 4,000원(30,000원이상 무료배송)</div>
            </div>
            
            {/* Rating */}
            <div className={styles['rating-review']}>
              <HiStar className={styles['star']}/>
                <span>{averageRating}</span>
                <span> | </span>
                <span>리뷰 </span>
                <span>{reviewCount}</span>
                <span>건</span>
            </div>
          </div>

          {/* images -> swap main image on click */}
          <div className={styles['galleries']}>
            {imgs.map((src, i) => (
              <button 
                key={i} 
                type="button" 
                onClick={ () => { setSelected(i); }}
                className={styles['thumb-button']}
              >
                <img 
                  className={`${styles['gallery-item']} ${i === selected ? styles['is-active'] : ''}`} 
                  src={src}
                  alt={name}
                />
              </button>
            ))}
          </div>
        </aside>
      </section>
      
      {/* tabs (children routes) */}
      <section className={styles['detail-contents']}>
        <ThreeLevelTabMenu
          leftTabTitle="상품설명"
          centerTabTitle="리뷰"
          rightTabTitle="Q&A"
          leftTabPath="description"
          centerTabPath="reviews"
          rightTabPath="qna"
        />
        <Outlet />
      </section>
      <section className={styles['bottom-bar-wrap']}>
        <ProductBottomBar
          priceAmount={purchasePriceAmount}
          onQuantityChange={qty}
          onFavoriteButtonClick={fav}
          onSendAsGiftButtonClick={gift}
          onAddToCartButtonClick={addToCart}
          onBuyNowButtonClick={buyNow} 
        />
      </section>
    </main>
  );
}
