import styles from './styles/BooksCategoryHomePage.module.css';
import { generatePath, useLoaderData, useNavigate} from "react-router-dom";
import BookSectionHeader from "../../features/books/components/BookSectionHeader";
import BestSellerSection from "../../features/books/components/BookBestSeller";
import BookCardForBookSlider from "../../features/books/components/BookCardForBookSlider";
import BookSlider from "../../features/books/components/BookSlider";
import { PATHS } from "../../routes/paths";
import type { BooksCategoryLoaderData } from './BooksCategory.loader';

export default function BooksCategoryHomePage() {
  const navigate = useNavigate();

  const {top3BestSellers, newBooksBySection } = useLoaderData() as BooksCategoryLoaderData;

  const handleBookItemClick = (id: string) => {
    navigate(generatePath(PATHS.bookDetails, { bookId: id }));
  };

  return (
    <div className={styles['book-contents-container']}>
      <section className={styles['best-seller-section']}>
        <BookSectionHeader 
          headerTitle="문앞 베스트"
          onClicked={() => console.log('문앞 베스트 더보기 클릭')}
        />
        <BestSellerSection
          top3Books={top3BestSellers}
          onFirstBookClicked={() => {
            handleBookItemClick(top3BestSellers[0].id);
            console.log('1위 도서 클릭');
          }}
          onSecondBookClicked={() => {
            handleBookItemClick(top3BestSellers[1].id);
            console.log('2위 도서 클릭');
          }}
          onThirdBookClicked={() => {
            handleBookItemClick(top3BestSellers[2].id);
            console.log('3위 도서 클릭');
          }}
        />
      </section>

      {/* Render category-specific sliders */}
      {(newBooksBySection || []).map(sub => (
        <section key={sub.key} className={styles['book-slider-section']}>
          <BookSectionHeader 
            headerTitle="새로나온 책" 
            categoryName={sub.label}
            onClicked={() => console.log(`${sub.label} 더보기 클릭`)}
          />
          <BookSlider>
            {(sub.books || []).map(book => (
              <BookCardForBookSlider
                key={book.id}
                imageUrl={book.coverThumbnailUrl}
                title={book.title}
                author={book.author}
                publisher={book.publisher}
                onImageOrTitleClicked={() => {
                  handleBookItemClick(book.id);
                  console.log(`${book.title} 클릭`);
                }}
              />
            ))}
          </BookSlider>
        </section>
      ))}
    </div>
  );
}
