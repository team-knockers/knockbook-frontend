import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Input } from 'reactstrap';

import styles from './styles/SearchBar.module.css';

type SearchBarProps = {
    placeholder?: string;
    defaultValue?: string;
    onSearch: (keyword: string) => void;
};

export default function SearchBar({
    placeholder,
    defaultValue = '',
    onSearch,
}: SearchBarProps) {
    const [searchKeyword, setSearchKeyword] = useState(defaultValue);
    const fireSearch = () => onSearch(searchKeyword.trim());
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fireSearch();
        }
    };

    return(
      <div className={styles['search-bar']}>
        <div className={styles['search-container']}>
          <div className={styles['search-box']}>
            <Input
              className={`${styles['search-input']} bg-transparent border-0 shadow-none px-0`}
              placeholder={placeholder}
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
                className={styles['search-button']}
                onClick={fireSearch}
            >
              <FiSearch size={20} />
            </button>
          </div>
        </div>
      </div>
    )
}
