import styles from '../styles/BookBestSeller.module.css';

type Book = {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  rentPrice: string;
  purchasePrice: string;
  summaryTitle: string;
  summaryDetail: string;
};

type Props = {
  books: Book[]; // Top 3 best-selling items
};

export default function BestSellerSection({ books }: Props) {
  if (books.length < 3) return null;

  const first = books[0];
  const second = books[1];
  const third = books[2];

  return (
    <div className={styles['best-seller']}>
      {/* Ranking 1st book*/}
      <div className={styles['first-book']}>
        <div className={styles['book-image-wrapper']}>
          <img
            className={styles['first-book-image']}
            src={first.imageUrl}
            alt={first.title}
          />
          <div className={styles['ranking-badge']}>1</div>
        </div>

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
      <div className={styles['second-third-wrapper']}>
        <div className={styles['second-book']}>
          <img
            className={styles['second-book-image']}
            src={second.imageUrl}
            alt={second.title}
          />
          <div className={styles['ranking-badge']}>2</div>
        </div>
        <div className={styles['third-book']}>
          <img
            className={styles['third-book-image']}
            src={third.imageUrl}
            alt={third.title}
          />
          <div className={styles['ranking-badge']}>3</div>
        </div>
      </div>
    </div>
  );
}
