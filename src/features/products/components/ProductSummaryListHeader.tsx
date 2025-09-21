import styles from './styles/ProductSummaryListHeader.module.css';
import { FiChevronDown } from "react-icons/fi";

type Props = {
  categoryLabel: string;
  sortLabel: string;
  totalCount: number;
  onCategoryClick: () => void;
  onSortClick: () => void;    
};     

export default function ProductSummaryListHeader({
    categoryLabel,
    sortLabel,
    totalCount,
    onCategoryClick,
    onSortClick,  
}: Props) {
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