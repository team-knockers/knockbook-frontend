import styles from './styles/BookDetailsPage.module.css';
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import TwoLevelTabMenu from "../../components/navigation/TwoLevelTabMenu";
import BookDetailsSummaryInfo from "../../features/books/components/BookDetailsSummaryInfo";
import BookDetailsResearch from "../../features/books/components/BookDetailsResearch";
import BookOrderBottomBar from '../../features/books/components/BookOrderBottomBar';
import { toast, ToastContainer } from 'react-toastify';import { useEffect, useState } from 'react';
import { CartService } from '../../features/purchase/services/CartService';
import TwoButtonPopup from '../../components/overlay/TwoButtonPopup';
import { PATHS } from '../../routes/paths';
import type { OrderType } from '../../features/purchase/type';
import type { BookDetailsLoaderData } from './BookDetails.loader';
import { BookService } from '../../features/books/services/BookService';
;

export default function BookDetailsPage() {
  const { bookDetails, statistics, myMbti } = useLoaderData() as BookDetailsLoaderData;

  const nav = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);
  const [isWished, setIsWished] = useState<boolean>(false);

  async function handleAddItemsOnCart(type : OrderType) {
    const refId = bookDetails.id;
    type === "BOOK_PURCHASE" 
    ? await CartService.addCartPurchaseItem(type, refId, quantity)
    : await CartService.addCartRentalItem(type, refId, quantity, 14);
    setIsCartPopupVisible(true);
  }

  useEffect(() => {
    let cancelled = false;
    const loadWishlistStatus = async () => {
      try {
        const res = await BookService.hasBookInWishlist(bookDetails.id);
        if (!cancelled) setIsWished(res.wished);
      } catch (err) {
        console.error("❌ Failed to load wishlist status:", err);
        if (!cancelled) setIsWished(false);
      }
    };
    loadWishlistStatus();
    return () => { cancelled = true; };
  }, [bookDetails.id]);

  /* This is a sample code for BookOrderBottomBar */
  const gift = () => toast('선물하기 클릭');
  const buyNow = () => toast('바로구매 클릭');

  const handleToggleWishlist = async (bookId: string) => {
    try {
      const response = isWished
        ? await BookService.removeFromWishlist(bookDetails.id)
        : await BookService.addToWishlist(bookDetails.id);

      setIsWished(response.wishlisted);

      switch(response.action) {
        case "ADDED":
        case "REMOVED":
          break;
        case "ALREADY_EXISTS":
          alert("이미 등록된 상품입니다.");
          break;
        case "NOT_FOUND":
          alert("찜 정보를 찾을 수 없습니다.");
          break;
        default:
          alert("예기치 못한 오류가 발생했습니다.");
      }

    } catch (err) {
      console.error(`Failed to toggle wishlist for book ${bookId}`, err);
      alert('위시리스트 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {/*ToastContainer for Test */}
      <ToastContainer position="top-center" />

      <main className={styles['details-main']}>
        <BookDetailsSummaryInfo 
          bookDetails={bookDetails} 
          statistics={statistics}     
        />
        {/* TODO. 내 MBTI조회하는 API확인 후 내 MBTI 반영할 것 */}
        <BookDetailsResearch
          myMbti={myMbti}
          mbtiResearch={statistics.mbtiPercentage}
        />
        <TwoLevelTabMenu
          leftTabTitle="상세정보"
          rightTabTitle="리뷰"
          leftTabPath="description"
          rightTabPath="reviews"
        />
        <Outlet />

        { isCartPopupVisible &&
        <div className={styles['go-to-cart-popup']}>
          <TwoButtonPopup
            title='선택한 상품을 장바구니에 담았어요.'
            description='장바구니로 이동하시겠어요?'
            cancelText='취소'
            confirmText='장바구니 보기'
            onCancel={() => setIsCartPopupVisible(false)}
            onConfirm={() => nav(PATHS.cart)}/>
        </div>}
      </main>
      <footer className={styles['bottom-bar-wrap']}>
        <BookOrderBottomBar
          rentalPriceAmount={bookDetails.rentalAmount}
          purchasePriceAmount={bookDetails.discountedPurchaseAmount}
          isWished={isWished}
          onQuantityChange={qty => setQuantity(qty)}
          onFavoriteButtonClick={() => handleToggleWishlist(bookDetails.id)}
          onSendAsGiftButtonClick={gift}
          onRentButtonClick={() => handleAddItemsOnCart("BOOK_RENTAL")}
          onAddToCartButtonClick={() => handleAddItemsOnCart("BOOK_PURCHASE")}
          onBuyNowButtonClick={buyNow} 
        />
      </footer>
    </>
  );
}
