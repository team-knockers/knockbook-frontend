import { useState } from "react";
import styles from "./styles/BookListHeader.module.css";
import { IoIosArrowDropdown } from "react-icons/io";
import { categoryOptions, sortOptions } from "../types";

type BookListHeaderProps = {
  totalCount: number;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
};

export default function BookListHeader({
  totalCount,
  onCategoryChange,
  onSortChange,
}: BookListHeaderProps) {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("최신순");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    onCategoryChange?.(value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSort(value);
    onSortChange?.(value);
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
              <option key={value} value={label}>{label}</option>
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
            <option key={value} value={label}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
