import styles from './BooksCategoryPgae.module.css';
import { IoClose } from "react-icons/io5";

const categories = [
  "소설", "시/에세이", "인문", "가정/육아", "요리", "건강", "취미/실용/스포츠",
  "경제/경영", "자기계발", "정치/사회", "역사/문화", "종교", "예술/대중문화",
  "기술/공학", "외국어", "과학", "여행", "컴퓨터/IT"
];

export default function BooksCategoryPage() {

  return (
    <div className={styles['books-category-wrapper']}>
      <div className={styles['category-header']}>
        <span className={styles['category-title']}>카테고리</span>
        <button 
          className={styles['close-button']} 
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
          {categories.map((category, idx) => (
            <button
              key={idx}
              className={styles['category-item']}
              onClick={() => {
                console.log(`카테고리 ${category}항목 클릭`);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
