import { generatePath, useNavigate } from 'react-router-dom';
import { type BookCategory } from '../types';
import styles from './styles/BooksCategoryPopup.module.css';
import { IoClose } from "react-icons/io5";
import { PATHS } from '../../../routes/paths';
import { useEffect, useState } from 'react';
import { BookService } from '../services/BookService';

type BooksCategoryPopupProps = {
  onClosed?: () => void;
};

export default function BooksCategoryPopup({
  onClosed
}: BooksCategoryPopupProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);


  const navigateToCategory = (categoryCodeName: string) => {
    navigate(generatePath(PATHS.booksCategory, { categoryCodeName: categoryCodeName }));
    if (onClosed) {
      onClosed();
    } // close popup after navigation
  };

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const data: BookCategory[] = await BookService.getBooksAllCategories();
        if (!mounted) { return; }
        const mapped = data.map(item => ({
          value: item.categoryCodeName,
          label: item.categoryDisplayName
        }));
        setCategories(mapped);
      } catch {
        if (!mounted) { return; }
        setCategories([]);
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);


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
          {categories.map(({ value, label }) => (
            <button
              key={value}
              className={styles['category-item']}
              onClick={() => {
                navigateToCategory(value);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
