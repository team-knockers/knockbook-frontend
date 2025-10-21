import { useNavigate } from 'react-router-dom';
import { type BookCategory, type BookSubcategory } from '../types';
import styles from './styles/BooksCategoryPopup.module.css';
import { IoClose } from "react-icons/io5";
import { PATHS } from '../../../routes/paths';
import { LuBookCheck } from "react-icons/lu";
import { useState } from 'react';
import { BookService } from '../services/BookService';

type BooksCategoryPopupProps = {
  categories: BookCategory[];
  onClosed?: () => void;
};

export default function BooksCategoryPopup({
  categories,
  onClosed
}: BooksCategoryPopupProps) {
  const navigate = useNavigate();
  // 현재 호버된 카테고리
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // 카테고리별 서브카테고리 캐싱
  const [subcategories, setSubcategories] = useState<Record<string, BookSubcategory[]>>({});

  // API 호출 함수
  const fetchSubcategories = async (categoryCodeName: string) => {
    setActiveCategory(categoryCodeName);

    // 이미 캐시된 경우 재호출 X
    if (subcategories[categoryCodeName]) return;

    try {
      const data: BookSubcategory[] = await BookService.getBookSubcategories(categoryCodeName);
      console.log(categoryCodeName, data);
      setSubcategories(prev => ({ ...prev, [categoryCodeName]: data }));
    } catch (error) {
      console.error(`Failed to fetch subcategories for ${categoryCodeName}:`, error);
      setSubcategories(prev => ({ ...prev, [categoryCodeName]: [] }));
    }
  };

  const navigateToCategory = (categoryCodeName: string) => {
    navigate(`${PATHS.booksCategory.replace(':categoryCodeName', categoryCodeName)}/home`);
    onClosed?.();
  };

  const navigateToSubcategory = (categoryCodeName: string, subcategoryCodeName: string) => {
    navigate(`${PATHS.booksCategory.replace(':categoryCodeName', categoryCodeName)}/all?subcategory=${subcategoryCodeName}&sortBy=published&order=desc`);
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

          {/* 개별 카테고리 리스트 */}
          {categories.map(cat => (
            <div key={cat.categoryCodeName} className={styles['category-items']}>
              <button
                className={styles['category-item']}
                onMouseEnter={() => fetchSubcategories(cat.categoryCodeName)}
                onClick={() => navigateToCategory(cat.categoryCodeName)}
              >
                <LuBookCheck className={styles['category-icon']} />
                {cat.categoryDisplayName}
              </button>

              {/* 호버 시 서브카테고리만 표시 */}
              {activeCategory === cat.categoryCodeName &&
                subcategories[cat.categoryCodeName]?.length > 0 && (
                  <div className={styles['subcategory-list']}>
                    {subcategories[cat.categoryCodeName].map(sub => (
                    <button
                      key={sub.id}
                      className={styles['subcategory-item']}
                      onClick={() => navigateToSubcategory(cat.categoryCodeName, sub.subcategoryCodeName)}
                    >
                      {sub.subcategoryDisplayName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
