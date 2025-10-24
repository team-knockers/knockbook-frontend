import styles from './styles/ProductsDetailPage.module.css';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { HiStar } from 'react-icons/hi2';
import ThreeLevelTabMenu from '../../components/navigation/ThreeLevelTabMenu';
import { useLoaderData, useParams } from "react-router-dom";
import ProductBottomBar from '../../features/products/components/ProductOrderBottomBar';
import { toast } from 'react-toastify';
import TwoButtonPopup from '../../components/overlay/TwoButtonPopup';
import { PATHS } from '../../routes/paths';
import { CartService } from '../../features/purchase/services/CartService';
import { OrderService } from '../../features/purchase/services/OrderService';
import { ProductService } from '../../features/products/services/ProductService';

export default function ProductDetailPage() {

  const nav = useNavigate();

  // Get server data prepared by the route loader
  const { name, unitPriceAmount, salePriceAmount, averageRating, reviewCount, wishedByMe, galleryImageUrls } = useLoaderData() as {
    name: string;
    unitPriceAmount: number;
    salePriceAmount: number | null;
    averageRating: number;
    reviewCount: number;
    wishedByMe: boolean;
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

  const [quantity, setQuantity] = useState(1);
  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);
  async function handleAddItemsOnCart() {
    await CartService.addCartPurchaseItem(
      "PRODUCT",
      String(productId),
      quantity
    );
    setIsCartPopupVisible(true);
  }

  async function handleCreateDraftDirect() {
    const refType = "PRODUCT";
    const refId =  String(productId);
    const draft = await OrderService.createOrderDirect(refType, refId, quantity);
    nav(PATHS.orderById(draft.id));
  }

  async function fav(isfav: boolean) {
    if (!productId) return;
    try {
      if (isfav) {
        await ProductService.addToWishlist(String(productId));
      } else {
        await ProductService.removeFromWishlist(String(productId)); 
      }
    } catch (e: any) {
      alert(e?.message ?? '찜 처리 실패');
    }
  }

  const gift = () => toast('선물하기 클릭');

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
        <Outlet context={{
          productImageUrl: imgs[0] ?? '',
          productName: name,
        }}/>
      </section>
      <section className={styles['bottom-bar-wrap']}>
        <ProductBottomBar
          priceAmount={purchasePriceAmount}
          onQuantityChange={qty => setQuantity(qty)}
          onFavoriteButtonClick={fav}
          onSendAsGiftButtonClick={gift}
          onAddToCartButtonClick={handleAddItemsOnCart}
          onBuyNowButtonClick={handleCreateDraftDirect}
          initialFavoriteOn={wishedByMe}
        />
      </section>

      { isCartPopupVisible &&
        <div className={styles['go-to-cart-popup']}>
          <TwoButtonPopup
            title='선택한 상품을 장바구니에 담았어요.'
            description='장바구니로 이동하시겠어요?'
            cancelText='취소'
            confirmText='장바구니 보기'
            onCancel={() => setIsCartPopupVisible(false)}
            onConfirm={() => nav(PATHS.cart)}/>
       </div>
      }
    </main>
  );
}
