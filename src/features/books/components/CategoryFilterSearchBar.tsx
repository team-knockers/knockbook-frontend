import React, { useEffect, useState } from 'react';
import styles from '../styles/CategoryFilterSearchBar.module.css';
import { FaSearch } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

type SearchOption = 'title' | 'author' | 'publisher';

export default function CategoryFilterSearchBar({
  onCategoryToggled,
  onSearched,
  showCategoryButton = true,
}: {
  onCategoryToggled?: () => void;
  onSearched: (searchBy: SearchOption, searchKeyword: string) => void;
  showCategoryButton?: boolean;
}) {
  const [searchBy, setSearchBy] = useState<SearchOption>('title');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [hamburgerIconSize, setHamburgerIconSize] = useState(25);

  // Set hamburger icon size based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setHamburgerIconSize(30); // desktop -> 30
      } else {
        setHamburgerIconSize(25); // mobile/tablet -> 25
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


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
          <GiHamburgerMenu size={hamburgerIconSize} />
        </button>
      )}

      <div className={styles['search-input-group']}>
        <select
          className={styles['search-option']}
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value as SearchOption)}>
          <option value="title">도서명</option>
          <option value="author">저자명</option>
          <option value="publisher">출판사</option>
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
          aria-label="Search button">
          <FaSearch size={18} />
        </button>
      </div>
    </div>
  );
}
