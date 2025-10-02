import styles from './styles/ProductFilterSidebar.module.css';
import { FiRefreshCcw } from 'react-icons/fi';
import { Input } from 'reactstrap';
import { useState } from 'react';   

type Filters = {
  category: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}

type PriceRadio = '' | 'lt-10000' | '10000-30000' | '30000-100000' | 'gte-100000' | 'custom';

export default function ProductFilterSidebar({
  onApply = () => {},
  initialCategory = 'all',
  initialMinPrice = '',
  initialMaxPrice = '',
}: {
  onApply?: (f: Filters) => void;
  initialCategory?: string;
  initialMinPrice?: string | number;
  initialMaxPrice?: string | number;
}) {
  // ---- helpers for FilterSidebar ----
  const toNumOrNull = (v: string) => {
    const n = Number(String(v).replace(/[^\d]/g, ''));
    return Number.isFinite(n) && String(v).trim() !== '' ? n : null;
  };

  const deriveRadio = (minS?: string | number, maxS?: string | number): PriceRadio => {
    const min = (minS === '' || minS == null) ? null : Number(minS);
    const max = (maxS === '' || maxS == null) ? null : Number(maxS);
    if (min === null && max === null) { return ''; }
    if (min === null && max !== null && max <= 10000) { return 'lt-10000'; }
    if (min === 10000 && max === 30000) { return '10000-30000'; }
    if (min === 30000 && max === 100000) { return '30000-100000'; }
    if (min === 100000 && max === null) { return 'gte-100000'; }
    return 'custom';
  };

  const radioPresetToFields = (r: PriceRadio) => {
    switch (r) {
      case 'lt-10000':      return { min: '',      max: '10000'  };
      case '10000-30000':   return { min: '10000', max: '30000'  };
      case '30000-100000':  return { min: '30000', max: '100000' };
      case 'gte-100000':    return { min: '100000',max: ''       };
      default:              return { min: '',      max: ''       }; 
    }
  };

  // ---- seed local UI state from initial props (parent remounts via key) ----
  const [category, setCategory]   = useState<string>(initialCategory);
  const [priceRadio, setPriceRadio] = useState<PriceRadio>(
    deriveRadio(initialMinPrice, initialMaxPrice)
  );
  const [minPrice, setMinPrice]   = useState<string>(String(initialMinPrice ?? ''));
  const [maxPrice, setMaxPrice]   = useState<string>(String(initialMaxPrice ?? ''));

  // Radio click → sync min/max fields for presets
  const onChangeRadio = (r: PriceRadio) => {
    setPriceRadio(r);
    if (r !== 'custom' && r !== '') {
      const { min, max } = radioPresetToFields(r);
      setMinPrice(min);
      setMaxPrice(max);
    }
    if (r === '' || r === 'custom') {
      // clear fields for 'no filter' or let user type for 'custom'
      if (r === '') {
        setMinPrice('');
        setMaxPrice('');
      }
    }
  };

  // Reset button (UI only)
  const handleReset = () => {
    setCategory('all');
    setPriceRadio('');
    setMinPrice('');
    setMaxPrice('');
  };

  // Apply → return only min/max (normalized) + category to parent
  const handleApply = () => {
    let min = toNumOrNull(minPrice);
    let max = toNumOrNull(maxPrice);
    if (min != null && max != null && min > max) {
      // exchange 
      [min, max] = [max, min];
    }

    onApply({ category, minPrice: min, maxPrice: max });
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
                checked={priceRadio === (val as PriceRadio)}
                onChange={e => onChangeRadio(e.target.value as PriceRadio)}
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
                checked={priceRadio === 'custom'}
                onChange={e => onChangeRadio(e.target.value as PriceRadio)}
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
                  disabled={priceRadio !== 'custom'}
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
                  disabled={priceRadio !== 'custom'}
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
