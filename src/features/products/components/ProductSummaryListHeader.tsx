import styles from './styles/ProductSummaryListHeader.module.css';
import { FiChevronDown } from "react-icons/fi";

type Props = {
  categoryCode: string;
  sortBy: string;
  totalCount: number;
  onCategoryClick: () => void;
  onSortClick: () => void;    
};     

const CATEGORY_LABEL: Record<string, string> = {
  all: "전체",
  book_stand: "독서대",
  book_cover: "북커버",
  book_mark: "북마크",
  book_storage: "책수납",
  magnifier: "돋보기",
  foot_rest: "발받침대",
  book_perfume: "북퍼퓸",
  book_light: "북라이트",
  paper_weight: "문진",
  reading_note: "독서노트",
};
const SORT_LABEL: Record<Props["sortBy"], string> = {
  createdAt: "최신순",
  unitPriceAmount: "가격순",
  averageRating: "평점순",
  reviewCount: "리뷰순",
};

export default function ProductSummaryListHeader({
    categoryCode,
    sortBy,
    totalCount,
    onCategoryClick,
    onSortClick,  
}: Props) {
  const categoryLabel = CATEGORY_LABEL[categoryCode] ?? "전체";
  const sortLabel = SORT_LABEL[sortBy] ?? "최신순";
  return (
    <div className={styles['product-summary-list-header']}>
      <div className={styles['header-left']}>
          <button className={styles['category-trigger']} type="button" onClick={onCategoryClick}>
            <span className={styles['category-label']}>{categoryLabel}</span>
            <span className={styles['category-icon']}><FiChevronDown size={14} /></span>
          </button>
          <span className={styles['total-count']}>{totalCount}</span>
      </div>

      <div className={styles['header-right']}>
          <button className={styles['sort-trigger']} type="button" onClick={onSortClick}>
            <span className={styles['sort-label']}>{sortLabel}</span>
            <span className={styles['sort-icon']}><FiChevronDown size={14} /></span>
          </button>
      </div>
    </div>
  )
}   
