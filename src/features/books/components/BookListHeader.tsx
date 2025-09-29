import styles from "./styles/BookListHeader.module.css";
import { IoIosArrowDropdown } from "react-icons/io";
import { categoryOptions, sortOptions } from "../types";

type BookListHeaderProps = {
  totalCount: number;
  selectedCategory: string;
  selectedSort: string;
  onCategoryChange: (categoryValue: string) => void;
  onSortChange: (sortValue: string) => void;
};

export default function BookListHeader({
  totalCount,
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
}: BookListHeaderProps) {

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <div className={styles['book-list-header']}>
      <div className={styles['category-section']}>
        <div className={styles['category-wrapper']}>
          <select
            className={styles['category-select']}
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categoryOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <IoIosArrowDropdown className={styles['category-icon']} />
        </div>
        <span className={styles['total-count']}>
          {totalCount.toLocaleString()}건
        </span>
      </div>
      <div className={styles['sort-section']}>
        <select
          className={styles['sort-select']}
          value={selectedSort}
          onChange={handleSortChange}
        >
          {sortOptions.map(({value, label}) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
