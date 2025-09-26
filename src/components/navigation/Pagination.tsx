import styles from './styles/Pagination.module.css';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

// Pagination

// What it does:
// - Renders page numbers via slots : {type:'page', value:number} | {type:'ellipsis'}
// - Supports prev/next buttons
// - Calls `onChange(nextPage)` only when the target page is valid and different

// Props:
// - page : current 1-based page number 
// - totalPages : total number of pages
// - onChange : Call back with the next page (number) when user clicks 

// UX rules:
// - Always show first and last page
// - If total pages <= 9, show all pages
// - If total pages >= 10, keep exactly 9 slots visible:
//   - near start  : 1, 2..7, …, last
//   - middle      : 1, …, (current-2..current+2), …, last
//   - near end    : 1, …, (last-6..last-1), last

// Usage example: <Pagination page={page} totalPages={20} onChange={setPage} />
// Note: You need to manage the `page` state in the parent component
type Props = {
    page: number;
    totalPages: number;
    onChange: (next: number) => void;
}

// Slot model 
type PageSlot = 
  | { type: 'page'; value: number } // numbered page button
  | { type: 'ellipsis' }; // ellipsis slot (...)

const MAX_FULL: number = 9;    // <= 9 → show all
const WINDOW_SIZE: number = 5; // middle window size (current ±2)
const EDGE_COUNT: number = 7;  // 2..7 or (last-6..last-1)

// Function `buildPageSlots`:
// - Build slots with the "always 9 visible" policy when truncated 
// - Returns an array of : {type:'page', value:number} | {type:'ellipsis'}
function buildPageSlots(current: number, totalPages: number): PageSlot[]{
  const total: number = Math.max(1, totalPages);
  const cur: number = Math.min(Math.max(1, current), total);  
  const slots: PageSlot[] = [];
  const half: number = Math.floor(WINDOW_SIZE / 2); 

  // Helper functions to push slots
  function pushPage(v: number): void{
    slots.push({ type: 'page', value: v });
  }
  function pushEllipsis(): void{
    slots.push({ type: 'ellipsis' });
  }
  function pushRange(from: number, to: number): void{   
    for (let v = from; v <= to; v++){
        pushPage(v);
    }
  }

  if (total <= MAX_FULL){
      // Case: small range -> Show all pages
      pushRange(1, total);
      return slots;
  }
  
  // Always show first page
  pushPage(1);

  // Near start
  if (cur <= 4) {
    pushRange(2, Math.min(7, total - 1));
    pushEllipsis();
    pushPage(total);
    return slots;
  }

  // Near end
  if (cur >= total - 3) {
    pushEllipsis();
    const start: number = Math.max(2, total - (EDGE_COUNT - 1)); // total-6
    pushRange(start, total - 1);
    pushPage(total);
    return slots;
  }

  // Middle
  const left: number = Math.max(2, cur - half);
  const right: number = Math.min(total - 1, cur + half);

  pushEllipsis();
  pushRange(left, right);
  pushEllipsis();
  pushPage(total);

  return slots;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  const total: number = Math.max(1, totalPages);
  const current: number = Math.min(Math.max(1, page), total);
  const handleClick = (next: number) => {
      if (next !== current && next >= 1 && next <= total){
          onChange(next);
      };
  };      

  const slots: PageSlot[] = buildPageSlots(current, total);

  return (
    <div className={styles['pagination-container']}>
      <button
        type="button"
        onClick={() => handleClick(current - 1)}
        disabled={current === 1}
      >
        <HiChevronLeft size={20} />
      </button>

      {/* Number buttons + ellipsis slots */}
      {slots.map((s, i) => {
        if (s.type === 'ellipsis') {
          return (
            <div className={styles['slot']} key={i}>
              <span>…</span>
            </div>
          );
        } else {
          const isActive: boolean = s.value === current;
          return (
            <div className={styles['slot']} key={i}>
              <button
                type="button"
                className={isActive ? styles['pageBtnActive'] : styles['pageBtn']}
                onClick={() => { handleClick(s.value); }}
              >
                {s.value}
              </button>
            </div>
          );
        }
      })}

      <button
        type="button"
        onClick={() => handleClick(current + 1)}
        disabled={current === total}    
      >
        <HiChevronRight size={20} />
      </button>
    </div>
    );
}
