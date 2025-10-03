import styles from './BookDetailsPage.module.css';
import { Outlet, useLoaderData } from "react-router-dom";
import TwoLevelTabMenu from "../../components/navigation/TwoLevelTabMenu";
import BookDetailsSummaryInfo from "../../features/books/components/BookDetailsSummaryInfo";
import BookDetailsResearch from "../../features/books/components/BookDetailsResearch";
import { mbtiResearchDummy, myMbtiDummy } from '../../features/books/resources/bookDetailsPage.dummy';
import type { BookDetails } from '../../features/books/types';
import BookOrderBottomBar from '../../features/books/components/BookOrderBottomBar';
import { toast } from 'react-toastify';;

export default function BookDetailsPage() {
  const bookDetails = useLoaderData() as BookDetails;
  const myMbti = myMbtiDummy;
  const mbtiResearch = mbtiResearchDummy;

  /* This is a sample code for BookOrderBottomBar */
  const qty = (n: number) => toast(`수량: ${n}`);
  const fav = (isFav?: boolean) => toast(isFav === undefined ? '찜 토글' : (isFav ? '찜 추가' : '찜 해제'));
  const gift = () => toast('선물하기 클릭');
  const addToCart = () => toast.success('장바구니 담김');
  const buyNow = () => toast('바로구매 클릭');
  const rent = () => toast('대여하기 클릭');

  return (
    <>
      <main className={styles['details-main']}>
        <BookDetailsSummaryInfo 
          bookDetails={bookDetails} 
          mbtiResearch={mbtiResearch}     
        />
        <BookDetailsResearch
          myMbti={myMbti}
          mbtiResearch={mbtiResearch}
        />
        <TwoLevelTabMenu
          leftTabTitle="상세정보"
          rightTabTitle="리뷰"
          leftTabPath="description"
          rightTabPath="reviews"
        />
        <Outlet />
      </main>
      <section className={styles['bottom-bar-wrap']}>
        <BookOrderBottomBar
          rentalPriceAmount={bookDetails.rentalAmount}
          purchasePriceAmount={bookDetails.discountedPurchaseAmount}
          onQuantityChange={qty}
          onFavoriteButtonClick={fav}
          onSendAsGiftButtonClick={gift}
          onRentButtonClick={rent}
          onAddToCartButtonClick={addToCart}
          onBuyNowButtonClick={buyNow} 
        />
      </section>
    </>
  );
}
