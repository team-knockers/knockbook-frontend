import styles from './styles/ProductSummaryListHeader.module.css';
import { useSearchParams } from 'react-router-dom';

type Props = {
  totalCount: number; 
};     

type SortBy = "createdAt" | "unitPriceAmount" | "averageRating" | "reviewCount";
type Order  = "asc" | "desc";

const CATEGORY_OPTIONS: Array<{ code: string; label: string }> = [
  { code: "all",          label: "전체" },
  { code: "book_stand",   label: "독서대" },
  { code: "book_cover",   label: "북커버" },
  { code: "book_mark",    label: "북마크" },
  { code: "book_storage", label: "책수납" },
  { code: "magnifier",    label: "돋보기" },
  { code: "foot_rest",    label: "발받침대" },
  { code: "book_perfume", label: "북퍼퓸" },
  { code: "book_light",   label: "북라이트" },
  { code: "paper_weight", label: "문진" },
  { code: "reading_note", label: "독서노트" },
];
const SORT_OPTIONS: Array<{ key: string; label: string; sortBy: SortBy; order: Order }> = [
  { key: "createdAt:desc",       label: "최신순",       sortBy: "createdAt",      order: "desc" },
  { key: "reviewCount:desc",     label: "리뷰많은순",   sortBy: "reviewCount",    order: "desc" },
  { key: "averageRating:desc",   label: "평점높은순",   sortBy: "averageRating",  order: "desc" },
  { key: "unitPriceAmount:asc",  label: "가격낮은순",   sortBy: "unitPriceAmount",order: "asc"  },
  { key: "unitPriceAmount:desc", label: "가격높은순",   sortBy: "unitPriceAmount",order: "desc" },
];

export default function ProductSummaryListHeader({ totalCount }: Props) {
  const [ sp, setSp ] = useSearchParams();

  const category = sp.get("category") ?? "all";
  const sortBy   = (sp.get("sortBy") ?? "createdAt") as SortBy;
  const order    = (sp.get("order")  ?? "desc") as Order;
  const currentSortKey = `${sortBy}:${order}`;

  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(sp);
    next.set("category", e.target.value);
    next.set("page", "1");
    setSp(next);
  };
  const onChangeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sb, ord] = e.target.value.split(":") as [SortBy, Order];
    const next = new URLSearchParams(sp);
    next.set("sortBy", sb);
    next.set("order", ord);
    next.set("page", "1");
    setSp(next);
  };

  return (
    <div className={styles['product-summary-list-header']}>
      <div className={styles['header-left']}>
        <select
          className={styles['category-select']}  
          value={category}
          onChange={onChangeCategory}
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.code} value={opt.code}>{opt.label}</option>
          ))}
        </select>

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
