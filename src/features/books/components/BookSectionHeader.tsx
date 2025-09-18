import styles from '../styles/BookSectionHeader.module.css';
import { FaChevronRight } from 'react-icons/fa';

type BookSectionHeaderProps = {
  text?: string;
  variant?: 'default' | 'new';
  categoryName?: string;
  onClick?: () => void;
};

export default function BookSectionHeader({
  text, 
  variant = 'default',
  categoryName,
  onClick
  }: BookSectionHeaderProps) {
    let displayContent: React.ReactNode = text;

  if (!text) {
    if (variant === 'new' && categoryName) {
      displayContent = (
        <>
          새로나온 책 <span className={styles['divider']}>|</span> {categoryName}
        </>
      );
    }
  }

  return (
    <div className={styles['book-section-header']}>
      <span className={styles['section_header_text']}>{displayContent}</span>
      <div className={styles['more-books']}
        onClick={onClick}
      >
        {/* Mobile/Tablet:display:none, Desktop:display:inline */}
        <span className={styles['more-text']}>더보기 </span> 
        <FaChevronRight size={12} className={styles['icon']} />
      </div>
    </div>
  );
}