import styles from './styles/ProductFilterSidebar.module.css';
import { FiRefreshCcw } from 'react-icons/fi';
import { Input } from 'reactstrap';
import { useState } from 'react';   

type Filters = {
  category: string;
  priceRange: '' | 'lt-10000' | '10000-30000' | '30000-100000' | 'gte-100000' | 'custom';
  minPrice?: number | null;
  maxPrice?: number | null;
}

export default function ProductFilterSidebar({
    onApply = () => {},
  initialCategory = 'all',
  initialPriceRange = '',
  initialMinPrice = '',
  initialMaxPrice = '',
}: {
  onApply?: (f: Filters) => void;
  initialCategory?: string;
  initialPriceRange?: Filters['priceRange'];
  initialMinPrice?: string | number;
  initialMaxPrice?: string | number;
}) {
  // Seed Local UI state from initial props (parent remounts via key)
  const [category, setCategory]       = useState<string>(initialCategory);
  const [priceRange, setPriceRange]   = useState<Filters['priceRange']>(initialPriceRange);
  const [minPrice, setMinPrice]       = useState<string>(String(initialMinPrice ?? ''));
  const [maxPrice, setMaxPrice]       = useState<string>(String(initialMaxPrice ?? ''));
  
  const isCustom = priceRange === 'custom';
  
  // Reset button -> UI reset only 
  const handleReset = () => {
    setCategory('all');
    setPriceRange('');
    setMinPrice('');
    setMaxPrice('');
  }

  // Normalize and send to parent; parent updates URL
  const handleApply = () => {
    const toNum = (v: string) => {
      const n = Number(String(v).replace(/[^\d]/g, ''));
      return Number.isFinite(n) && String(v).trim() !== '' ? n : null;
    };

    const filters: Filters = {
      category,
      priceRange,
      minPrice: isCustom ? toNum(minPrice) : null,
      maxPrice: isCustom ? toNum(maxPrice) : null,
    };
    onApply(filters);
  };

  return (
    <div className={styles['product-filter-sidebar']}>
      <div className={styles['header']}>
        <div className={styles['header-title']}>필터</div>
        <button className={styles['header-reset']} type="button" onClick={handleReset}>
          <FiRefreshCcw size={14} />
        </button>
      </div>

      {/* Category section*/}
      <div className={styles['category-section']}>
        <div className={styles['category-title']}>카테고리</div>
        <div className={styles['category-list']}>
          {[
            ['all', '전체'],
            ['book_stand','독서대'],
            ['book_cover','북커버'],
            ['book_mark','북마크'],
            ['book_storage','책수납'],
            ['magnifier','돋보기'],
            ['foot_rest','발받침대'],
            ['book_perfume','북퍼퓸'],
            ['book_light','북라이트'],
            ['paper_weight','문진'],
            ['reading_note','독서노트'],
          ].map(([val, label]) => (
            <label key={val} className={styles['category-item']}>
              <Input
                className={styles['filter-radio']}
                type="radio"
                name="category"
                value={val}
                checked={category === val}
                onChange={e => setCategory(e.target.value)}
              />
              <span className={styles['category-label']}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price section */}
      <div className={styles['price-section']}>
        <div className={styles['price-title']}>가격대</div>
        <div className={styles['price-list']}>
          {[
            ['lt-10000','1만원 이하'],
            ['10000-30000','1만원–3만원'],
            ['30000-100000','3만원–10만원'],
            ['gte-100000','10만원 이상'],
          ].map(([val, label]) => (
            <label key={val} className={styles['price-item']}>
              <Input
                className={styles['filter-radio']}
                type="radio"
                name="priceRange"
                value={val}
                checked={priceRange === (val as Filters['priceRange'])}
                onChange={e => setPriceRange(e.target.value as Filters['priceRange'])}
              />
              <span className={styles['price-label']}>{label}</span>
            </label>
          ))}

          {/* Custom range */}
          <div className={styles['custom-price']}>
            <div className={styles['custom-header']}>
              <Input
                className={styles['filter-radio']}
                type="radio"
                name="priceRange"
                value="custom"
                checked={priceRange === 'custom'}
                onChange={e => setPriceRange(e.target.value as Filters['priceRange'])}
              />
              <span className={styles['custom-label']}>직접 설정</span>
            </div>
            <div className={styles['custom-fields']}>
              <div className={styles['min-field']}>
                <div className={styles['min-label']}>최소 가격</div>
                <Input
                  className={styles['min-input']}
                  type="text"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  disabled={!isCustom}
                />
              </div>
              <div className={styles['max-field']}>
                <div className={styles['max-label']}>최대 가격</div>
                <Input
                  className={styles['max-input']}
                  type="text"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  disabled={!isCustom}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply */}
      <div className={styles['apply-row']}>
        <button type="button" className={styles['apply-btn']} onClick={handleApply}>
          적용
        </button>
      </div>
    </div>
  );
}
