import { useState } from 'react';
import s from './styles/SimplePagination.module.css';
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';

type SimplePaginationProps = {
  totalItems: number;
  size: number;
  onCurrentPageChange: (currentPage : number) => void;
}

export default function SimplePagination({
  totalItems,
  size,
  onCurrentPageChange,
} : SimplePaginationProps) {

  const INIT_PAGE = 1;
  const MIN_TOTAL_PAGES = 1;
  const numPages = totalItems > 0 ? Math.ceil(totalItems / size) : MIN_TOTAL_PAGES;
  const [currentPage, setCurrentPage] = useState(INIT_PAGE);
  
  const goToPrevPage = () => {
    const prev = currentPage - 1;
    setCurrentPage(prev);
    onCurrentPageChange(prev);
  }

  const goToNextPage = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    onCurrentPageChange(next);
  }

  return (
    <div className={s['component-layout']}>
      <button 
        className={s['pagination-prev-button']}
        disabled={currentPage <= 1}
        onClick={goToPrevPage}>
        <IoIosArrowDropleftCircle />
      </button>
        <span>{currentPage} / {numPages}</span>
      <button
        className={s['pagination-next-button']}
        disabled={currentPage >= numPages}
        onClick={goToNextPage}>
        <IoIosArrowDroprightCircle />
      </button>
    </div>
  );
}