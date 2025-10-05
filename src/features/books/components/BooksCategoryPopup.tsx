import { bookCategoryList } from '../types';
import styles from './styles/BooksCategoryPopup.module.css';
import { IoClose } from "react-icons/io5";

type BooksCategoryPopupProps = {
  onClosed?: () => void;
};

export default function BooksCategoryPopup({
  onClosed
}: BooksCategoryPopupProps) {

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
            console.log(`카테고리 전체항목 클릭`);
          }}
        >
          전체
        </button>
        <div className={styles['category-items']}>
          {bookCategoryList.map(({value, label}) => (
            <button
              key={value}
              className={styles['category-item']}
              onClick={() => {
                console.log(`카테고리 ${label}항목 클릭`);
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
