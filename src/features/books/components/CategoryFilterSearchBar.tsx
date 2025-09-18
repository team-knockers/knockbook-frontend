import React, { useState } from 'react';
import styles from '../styles/CategoryFilterSearchBar.module.css';
import { FaSearch } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { SEARCH_OPTIONS, type SearchOption } from '../types';

type CategoryFilterSearchBarProps = {
  onCategoryToggled: () => void;
  onSearched: (searchBy: SearchOption, searchKeyword: string) => void;
  showCategoryButton?: boolean;
}

export default function CategoryFilterSearchBar({
  onCategoryToggled,
  onSearched,
  showCategoryButton = true,
}: CategoryFilterSearchBarProps) {

  const [searchBy, setSearchBy] = useState<SearchOption>('title');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      onSearched(searchBy, searchKeyword);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles['search-bar-container']}>
      {showCategoryButton && (
        <button
          className={styles['category-button']}
          onClick={onCategoryToggled}
          aria-label="Open category menu">
          <GiHamburgerMenu className={styles['hamburger-icon']} />
        </button>
      )}
      <div className={styles['search-input-group']}>
        <select
          className={styles['search-option']}
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value as SearchOption)}
        >
          {SEARCH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          className={styles['search-input']}
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Input search keyword"
        />
        <button
          className={styles['search-button']}
          onClick={handleSearch}
          aria-label="Search button"
        >
          <FaSearch className={styles['search-icon']} />
        </button>
      </div>
    </div>
  );
}
