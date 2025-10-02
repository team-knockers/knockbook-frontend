import styles from './BooksDetailsPage.module.css';
import { Outlet } from "react-router-dom";
import TwoLevelTabMenu from "../../components/navigation/TwoLevelTabMenu";
import BookDetailsSummaryInfo from "../../features/books/components/BookDetailsSummaryInfo";
import BookDetailsResearch from "../../features/books/components/BookDetailsResearch";
import { bookDetailsDummy, mbtiResearchDummy, myMbtiDummy } from '../../features/books/resources/bookDetailsPage.dummy';

// Dummy data for test
const myMbti = myMbtiDummy;
const mbtiResearch = mbtiResearchDummy;
const bookDetails = bookDetailsDummy;

export default function BooksDetailsPage() {
  
  return (
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
  );
}
