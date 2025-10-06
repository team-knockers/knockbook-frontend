import styles from './styles/ProductReviewListHeader.module.css';
import { useSearchParams } from 'react-router-dom';

type Props = {
  totalCount: number; 
}; 

type SortBy = "createdAt" | "likesCount" | "rating";
type Order  = "asc" | "desc";

const SORT_OPTIONS: Array<{ key: string; label: string; sortBy: SortBy; order: Order }> = [
  { key: "createdAt:desc",   label: "최신순",        sortBy: "createdAt",    order: "desc" },
  { key: "likesCount:desc",  label: "좋아요많은순",  sortBy: "likesCount",   order: "desc" },
  { key: "rating:desc",      label: "평점높은순",    sortBy: "rating",       order: "desc" },
];

export default function ProductReviewListHeader({ totalCount }: Props) {
  const [ sp, setSp ] = useSearchParams();

  const onChangeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sb, ord] = e.target.value.split(":") as [SortBy, Order];
    const next = new URLSearchParams(sp);
    next.set("sortBy", sb);
    next.set("order", ord);
    next.set("page", "1");
    setSp(next);
  };

  const sortBy   = (sp.get("sortBy") ?? "createdAt") as SortBy;
  const order    = (sp.get("order")  ?? "desc") as Order;
  const currentSortKey = `${sortBy}:${order}`;
  return (
    <div className={styles['product-review-list-header']}>
      <div className={styles['header-left']}>
        <span className={styles['list-all-label']}>전체</span>
        <span className={styles['total-count']}>{totalCount} 건</span>
      </div>
      <div className={styles['header-right']}>
        <select
          className={styles['sort-select']}       
          value={currentSortKey}
          onChange={onChangeSort}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
