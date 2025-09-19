import styles from './styles/BookSectionHeader.module.css';
import { FaChevronRight } from 'react-icons/fa';

type BookSectionHeaderProps = {
  headerTitle: string;
  categoryName?: string;
  onClicked: () => void;
};

export default function BookSectionHeader({
  headerTitle,
  categoryName,
  onClicked
}: BookSectionHeaderProps) {
  const displayContent = categoryName ? (
    <>
      {headerTitle} <span className={styles['divider']}>|</span> {categoryName}
    </>
  ) : (
    <>
      {headerTitle}
    </>
  );

  return (
    <div className={styles['book-section-header']}>
      <span className={styles['section_header_text']}>{displayContent}</span>
      <button
        className={styles['more-books']}
        onClick={onClicked}
        type="button"
        aria-label="더보기"
      >
        {/* Mobile/Tablet:display:none, Desktop:display:inline */}
        <span className={styles['more-text']}>더보기 </span> 
        <FaChevronRight size={12} className={styles['icon']} />
      </button>
    </div>
  );
}