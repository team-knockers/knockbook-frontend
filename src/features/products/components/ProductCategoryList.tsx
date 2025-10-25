import ProductCategoryCard from './ProductCategoryCard';
import styles from './styles/ProductCategoryList.module.css';
import { useSearchParams } from 'react-router-dom';
import {
  LuBookOpen,
  LuWalletCards,
  LuBookmark,
  LuBoxes,
  LuSearch,
  LuFootprints,
  LuSprayCan,
  LuLampCeiling,
  LuWeight,
  LuNotebookPen,
} from 'react-icons/lu';

const CATEGORIES = [
  { code: 'book_stand',   label: '독서대',   icon: <LuBookOpen /> },
  { code: 'book_cover',   label: '북커버',   icon: <LuWalletCards /> },
  { code: 'book_mark',    label: '북마크',   icon: <LuBookmark /> },
  { code: 'book_storage', label: '책수납',   icon: <LuBoxes /> },
  { code: 'magnifier',    label: '돋보기',   icon: <LuSearch /> },
  { code: 'foot_rest',    label: '발받침대', icon: <LuFootprints /> },
  { code: 'book_perfume', label: '북퍼퓸',   icon: <LuSprayCan /> },
  { code: 'book_light',   label: '북라이트', icon: <LuLampCeiling /> },
  { code: 'paper_weight', label: '문진',     icon: <LuWeight /> },
  { code: 'reading_note', label: '독서노트', icon: <LuNotebookPen /> },
];

export default function ProductCategoryList() {
  const [, setSp] = useSearchParams();

  function handleCategoryClick(code: string) {
    const next = new URLSearchParams();
    next.set('category', code);
    next.set('page', '1');
    setSp(next);
  }

  return (
    <section className={styles['section']} aria-label="상품 카테고리">
      <div className={styles['content']}>
        <div className={styles['header']}>
          <h2 className={styles['title']}>카테고리</h2>
          <p className={styles['subtitle']}>원하는 상품을 빠르게 찾아보세요</p>
        </div>

        <div className={styles['gridWrapper']}>
          <div className={styles['grid']}>
            {CATEGORIES.map(c => (
              <ProductCategoryCard
                key={c.code}
                label={c.label}
                icon={c.icon}
                onClick={() => handleCategoryClick(c.code)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
