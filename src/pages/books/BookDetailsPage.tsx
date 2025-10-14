import styles from './styles/BookDetailsPage.module.css';
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import TwoLevelTabMenu from "../../components/navigation/TwoLevelTabMenu";
import BookDetailsSummaryInfo from "../../features/books/components/BookDetailsSummaryInfo";
import BookDetailsResearch from "../../features/books/components/BookDetailsResearch";
import BookOrderBottomBar from '../../features/books/components/BookOrderBottomBar';
import { toast, ToastContainer } from 'react-toastify';import { useState } from 'react';
import { PurchaseService } from '../../features/purchase/services/PurchaseService';
import TwoButtonPopup from '../../components/overlay/TwoButtonPopup';
import { PATHS } from '../../routes/paths';
import type { OrderType } from '../../features/purchase/type';
import type { BookDetailsLoaderData } from './BookDetails.loader';
;

export default function BookDetailsPage() {
  const { bookDetails, statistics, myMbti } = useLoaderData() as BookDetailsLoaderData;

  const nav = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);
  async function handleAddItemsOnCart(type : OrderType) {
    const refId = bookDetails.id;
    type === "BOOK_PURCHASE" 
    ? await PurchaseService.addCartPurchaseItem(type, refId, quantity)
    : await PurchaseService.addCartRentalItem(type, refId, quantity, 14);
    setIsCartPopupVisible(true);
  }

  /* This is a sample code for BookOrderBottomBar */
  const fav = (isFav?: boolean) => toast(isFav === undefined ? '찜 토글' : (isFav ? '찜 추가' : '찜 해제'));
  const gift = () => toast('선물하기 클릭');
  const buyNow = () => toast('바로구매 클릭');

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
        </div>
      }
      </main>
      <footer className={styles['bottom-bar-wrap']}>
        <BookOrderBottomBar
          rentalPriceAmount={bookDetails.rentalAmount}
          purchasePriceAmount={bookDetails.discountedPurchaseAmount}
          onQuantityChange={qty => setQuantity(qty)}
          onFavoriteButtonClick={fav}
          onSendAsGiftButtonClick={gift}
          onRentButtonClick={() => handleAddItemsOnCart("BOOK_RENTAL")}
          onAddToCartButtonClick={() => handleAddItemsOnCart("BOOK_PURCHASE")}
          onBuyNowButtonClick={buyNow} 
        />
      </footer>
    </>
  );
}
