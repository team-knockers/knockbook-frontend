import styles from '../styles/BookBestSeller.module.css';
import type { TopRankedBook } from '../types';

type BookBestSellerProps = {
  top3Books: TopRankedBook[]; // Top 3 best-selling items
  onFirstBookClicked: () => void;
  onSecondBookClicked: () => void;
  onThirdBookClicked: () => void;
};

export default function BestSellerSection({ 
  top3Books,
  onFirstBookClicked,
  onSecondBookClicked,
  onThirdBookClicked
}: BookBestSellerProps) {
  if (top3Books.length < 3) { 
      return null;
    }

  const first = top3Books[0];
  const second = top3Books[1];
  const third = top3Books[2];

  return (
    <div className={styles['best-seller']}>
      {/* Ranking 1st book*/}
      <div className={styles['first-book-wrapper']}>
        <button 
          className={styles['first-book']}
          onClick={onFirstBookClicked}
        >
          <img
            className={styles['first-book-image']}
            src={first.imageUrl}
            alt={first.title}
          />
          <div className={styles['ranking-badge']}>1</div>
        </button>

        {/* Ranking 1st book detail - for desktop */}
        <div className={styles['book-info-desktop']}>
          <span className={styles['book-title']}>{first.title}</span>
          <span className={styles['book-meta']}>
            {first.author} · {first.publisher}
          </span>
          <span className={styles['book-price']}>
            대여 <span className={styles['book-price-highlight']}>{first.rentPrice}원</span> | 구매 <span className={styles['book-price-highlight']}>{first.purchasePrice}원</span>
          </span>
          <div className={styles['book-summary']}>
            <span className={styles['summary-title']}>{first.summaryTitle}</span>
            <span className={styles['summary-detail']}>{first.summaryDetail}</span>
          </div>
        </div>
      </div>

      {/* Ranking 2rd, 3nd books */}
      <div className={styles['second-third-book-wrapper']}>
        <button 
          className={styles['second-book']}
          onClick={onSecondBookClicked}
        >
          <img
            className={styles['second-book-image']}
            src={second.imageUrl}
            alt={second.title}
          />
          <div className={styles['ranking-badge']}>2</div>
        </button>
        <button 
          className={styles['third-book']}
          onClick={onThirdBookClicked}
        >
          <img
            className={styles['third-book-image']}
            src={third.imageUrl}
            alt={third.title}
          />
          <div className={styles['ranking-badge']}>3</div>
        </button>
      </div>
    </div>
  );
}
