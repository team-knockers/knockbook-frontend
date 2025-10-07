import { generatePath, useNavigate } from 'react-router-dom';
import { type BookCategory } from '../types';
import styles from './styles/BooksCategoryPopup.module.css';
import { IoClose } from "react-icons/io5";
import { PATHS } from '../../../routes/paths';

type BooksCategoryPopupProps = {
  categories: BookCategory[];
  onClosed?: () => void;
};

export default function BooksCategoryPopup({
  categories,
  onClosed
}: BooksCategoryPopupProps) {
  const navigate = useNavigate();

  const navigateToCategory = (categoryCodeName: string) => {
    navigate(generatePath(PATHS.booksCategory, { categoryCodeName: categoryCodeName }));
    if (onClosed) {
      onClosed();
    } // close popup after navigation
  };

  return (
    <div className={styles['books-category-wrapper']}>
      <div className={styles['category-header']}>
        <span className={styles['category-title']}>카테고리</span>
        <button 
          className={styles['close-button']} 
          onClick={onClosed}
        >
          <IoClose/>
        </button>
      </div>
      <div className={styles['category-list-wrapper']}>
        <button className={styles['category-all']}
          onClick={() => {
            navigateToCategory('all');
          }}
        >
          전체
        </button>
        <div className={styles['category-items']}>
          {categories.map(cat => (
            <button
              key={cat.categoryCodeName}
              className={styles['category-item']}
              onClick={() => navigateToCategory(cat.categoryCodeName)}
            >
              {cat.categoryDisplayName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
