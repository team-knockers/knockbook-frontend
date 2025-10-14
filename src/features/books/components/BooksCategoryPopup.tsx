import { generatePath, useNavigate } from 'react-router-dom';
import { type BookCategory } from '../types';
import styles from './styles/BooksCategoryPopup.module.css';
import { IoClose } from "react-icons/io5";
import { PATHS } from '../../../routes/paths';
import { LuBookCheck } from "react-icons/lu";

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
    navigate(generatePath(PATHS.booksCategory, { categoryCodeName }));
    onClosed?.();
  };

  return (
    <div className={styles['popup-overlay']} onClick={onClosed} role="presentation">
      <div
        className={styles['books-category-wrapper']}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles['category-header']}>
          <span className={styles['category-logo']}>문앞의 책방</span>
          <button className={styles['close-floating']} 
                  onClick={onClosed} 
                  ria-label="닫기">
            <IoClose/>
          </button>
        </div>

        <div className={styles['category-list-wrapper']}>
          <span className={styles['category-title']}>카테고리</span>

          <button className={styles['category-all']} onClick={() => navigateToCategory('all')}>
            <LuBookCheck className={styles['category-icon']} />전체
          </button>

          <div className={styles['category-items']}>
            {categories.map(cat => (
              <button
                key={cat.categoryCodeName}
                className={styles['category-item']}
                onClick={() => navigateToCategory(cat.categoryCodeName)}
              >
                <LuBookCheck className={styles['category-icon']} />
                {cat.categoryDisplayName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
