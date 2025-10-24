import s from './ProductWishlistPage.module.css';
import ProductSummaryCard from '../../../features/products/components/ProductSummaryCard';
import { generatePath, useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import type { WishlistPageLoaderData } from './wishlistPage.loader';
import { PATHS } from '../../../routes/paths';
import { ProductService } from '../../../features/products/services/ProductService';
import { CartService } from '../../../features/purchase/services/CartService';
import { useMemo, useRef, useState } from 'react';
import TwoButtonPopup from '../../../components/overlay/TwoButtonPopup';

type Wish = NonNullable<WishlistPageLoaderData>['productWishes'][number];

export default function ProductWishlistPage() {
  const nav = useNavigate();
  const revalidator = useRevalidator();

  // safe guard
  const data = useRouteLoaderData("wishlist") as WishlistPageLoaderData | undefined;
  const initialWishes = useMemo<Wish[]>(() => (
    Array.isArray(data?.productWishes) ? data!.productWishes : []
  ), [data]);
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);

  // UI states
  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // double-click guards
  const togglingRef = useRef<Set<string>>(new Set());
  const addingCartRef = useRef<Set<string>>(new Set());

  const handleCardClick = (id: string) =>
    nav(generatePath(PATHS.productDetail, { productId: id }));

  // ---- Toggle wish with optimistic UI + rollback on error ----
  async function handleToggleWish(pid: string, current: boolean) {
    if (togglingRef.current.has(pid)) return;
    togglingRef.current.add(pid);
    setErrorMsg(null);

    // optimistic update
    const prev = wishes;
    const next = current
      ? prev.filter(w => w.productId !== pid)
      : [...prev.map(w => w.productId === pid ? { ...w, wishedByMe: true } : w)];
    setWishes(next);

    try {
      if (current) await ProductService.removeFromWishlist(pid);
      else await ProductService.addToWishlist(pid);
      revalidator.revalidate();
    } catch (e: any) {
      // rollback
      setWishes(prev);
      setErrorMsg(e?.message ?? '위시 목록 업데이트에 실패했습니다.');
    } finally {
      togglingRef.current.delete(pid);
    }
  }

  async function handleAddItemsOnCart(pid: string) {
    if (addingCartRef.current.has(pid)) return;
    addingCartRef.current.add(pid);
    setErrorMsg(null);
    try {
      await CartService.addCartPurchaseItem("PRODUCT", pid, 1);
      setIsCartPopupVisible(true);
    } catch (e: any) {
      setErrorMsg(e?.message ?? '장바구니 담기에 실패했습니다.');
    } finally {
      addingCartRef.current.delete(pid);
    }
  }

  const hasItems = wishes.length > 0;

  return (
    <main className={s["page-layout"]}>
      {/* Cart go-to popup */}
      {isCartPopupVisible && (
        <div className={s['go-to-cart-popup']}>
          <TwoButtonPopup
            title='선택한 상품을 장바구니에 담았어요.'
            description='장바구니로 이동하시겠어요?'
            cancelText='취소'
            confirmText='장바구니 보기'
            onCancel={() => setIsCartPopupVisible(false)}
            onConfirm={() => nav(PATHS.cart)}
          />
        </div>
      )}

      {/* Error banner */}
      {errorMsg && (
        <div role="alert" className={s['error-banner']}>
          {errorMsg}
          <button
            className={s['error-close']}
            onClick={() => setErrorMsg(null)}
            aria-label="닫기"
          >×</button>
        </div>
      )}

      <div className={s["like-list-layout"]}>
        {!hasItems ? (
          <div className={s["empty-state"]}>
            <p className={s["empty-text"]}>찜한 상품이 아직 없어요.</p>
            <button
              className={s["go-shopping"]}
              onClick={() => nav(PATHS.productsHome)}
            >
              상품 보러가기
            </button>
          </div>
        ) : (
          wishes.map(p => (
            <div key={p.productId} className={s["like-list-item"]}>
              <ProductSummaryCard
                key={p.productId}
                imageSrc={p.thumbnailUrl}
                name={p.name}
                price={p.unitPriceAmount}
                salePrice={p.salePriceAmount ?? undefined}
                rating={p.averageRating}
                reviewCount={p.reviewCount}
                onClick={() => handleCardClick(p.productId)}
                wishedByMe={true}
                onWishButtonClick={() => handleToggleWish(p.productId, p.wishedByMe)}
                onCartButtonClick={() => handleAddItemsOnCart(p.productId)}
              />
            </div>
          ))
        )}
      </div>
    </main>
  );
}
