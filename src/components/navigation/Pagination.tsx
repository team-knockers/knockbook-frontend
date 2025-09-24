import styles from './styles/Pagination.module.css';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

// 부모에서 page를 useState로 관리하고, onChange에 setPage를 그대로 넘겨 쓰세요
type Props = {
    page: number;
    totalPages: number;
    onChange: (next: number) => void;
}

function getPages(page: number, totalPages: number): number[]{
    const pages: number[] = [];
    // 9 페이지 이하 
    if (totalPages <= 9){
        for (let i = 1; i <= totalPages; i++){
            pages.push(i);
        }   
        return pages;
    }   
    // 10 페이지 이상 
    pages.push(1);
    if (page <= 4) {
      for (let i = 2; i <= 7; i++) pages.push(i);
      pages.push(-1);
    } else if (page >= totalPages - 3) {
      pages.push(-1);
      for (let i = totalPages - 6; i <= totalPages - 1; i++) pages.push(i);
    } else {
      pages.push(-1);
      for (let i = page - 2; i <= page + 2; i++) pages.push(i);
      pages.push(-1);
    }
    pages.push(totalPages);
    return pages;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
    const total = Math.max(1, totalPages);
    const current = Math.min(Math.max(1, page), total);
    const pages = getPages(current, total);

    const handleClick = (next: number) => {
        if (next !== current && next >= 1 && next <= total){
            onChange(next);
        };
    };      

    return (
        <div className={styles['pagination-container']}>
          <button
            type="button"
            onClick={() => handleClick(current - 1)}
            disabled={current === 1}
          >
            <HiChevronLeft size={20} />
          </button>

          {pages.map((v, i) => {
            if (v === -1){
                return (
                  <div className={styles['slot']} key={i}>
                    <span>...</span>
                  </div>
                );
            }
            const isActive = v === current;
            return (
            <div className={styles['slot']} key={i}>
              <button
                type="button"
                className={isActive ? styles['pageBtnActive'] : styles['pageBtn']}
                onClick={() => handleClick(v)}
              >
                {v}
              </button>
            </div>
            );
          })}

          <button
            type="button"
            onClick={() => handleClick(current + 1)}
            disabled={current === total}    
          >
            <HiChevronRight size={20} />
          </button>
        </div>
    )
}
