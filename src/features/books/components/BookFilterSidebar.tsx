import styles from './styles/BookFilterSidebar.module.css';
import { FiRefreshCcw } from 'react-icons/fi';
import { Input } from 'reactstrap';
import { useEffect, useState } from 'react';   
import { categoryOptions, priceOptions, type BookSearchFilters } from '../types';

type BookFilterSidebarProps = {
  onApplied: (filters: BookSearchFilters) => void;
  category: string;
  minPrice?: number;
  maxPrice?: number;
};

export default function BookFilterSidebar({
    onApplied,
    category,
    minPrice,
    maxPrice,
}: BookFilterSidebarProps) {

  const [categoryState, setCategoryState] = useState<string>('all');
  const [minPriceState, setMinPriceState] = useState<string>(''); 
  const [maxPriceState, setMaxPriceState] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const isPresetPrice = (min?: number, max?: number) =>
    priceOptions.some(({ minValue, maxValue }) => {
      const minMatch = (minValue ?? 0) === (min ?? 0);
      const maxMatch =
        maxValue === undefined ? max === undefined : (maxValue === max);
      return minMatch && maxMatch;
    });

  useEffect(() => {
    setCategoryState(category);
    setMinPriceState(minPrice !== undefined ? String(minPrice) : '');
    setMaxPriceState(maxPrice !== undefined ? String(maxPrice) : '');
    setIsCustom(!isPresetPrice(minPrice, maxPrice) && (minPrice !== undefined || maxPrice !== undefined));
  }, [category, minPrice, maxPrice]);

  const parseNumberOrUndefined = (value: string | number | undefined): number | undefined => {
    if (typeof value === 'number') { return value; }
    if (value === undefined || value === '') { return undefined; }
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  };

  const applyFilters = (updates: Partial<BookSearchFilters> = {}) => {
    const mergedCategory = updates.category ?? categoryState;

    const hasMinInUpdates = Object.prototype.hasOwnProperty.call(updates, 'minPrice');
    const hasMaxInUpdates = Object.prototype.hasOwnProperty.call(updates, 'maxPrice');
    
    const rawMin = hasMinInUpdates ? updates.minPrice : minPriceState;
    const rawMax = hasMaxInUpdates ? updates.maxPrice : maxPriceState;

    const minNum = parseNumberOrUndefined(rawMin);
    const maxNum = parseNumberOrUndefined(rawMax);

    if (minNum !== undefined && maxNum !== undefined && minNum > maxNum) { return; }

    setCategoryState(mergedCategory);
    setMinPriceState(minNum !== undefined ? String(minNum) : '');
    setMaxPriceState(maxNum !== undefined ? String(maxNum) : '');

    onApplied({
      category: mergedCategory,
      minPrice: minNum,
      maxPrice: maxNum
    });
  };

  const handlePriceChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { setter(value) }
  };

  const resetFilters = () => {
    setIsCustom(false);
    applyFilters({ category: 'all', minPrice: undefined, maxPrice: undefined })
  };

  return (
    <div className={styles['book-filter-sidebar']}>
      {/* Header and Reset button */}
      <div className={styles['header']}>
        <div className={styles['header-title']}>필터</div>
        <button 
          className={styles['reset-button']} 
          type="button"
          onClick={resetFilters}
        >
          <FiRefreshCcw/>
        </button>
      </div>

      {/* Category section */}
      <div className={styles['category-section']}>
        <div className={styles['category-title']}>
          카테고리
        </div>    
        <div className={styles['category-list']}>
          {categoryOptions.map(({ value, label }) => (
            <label className={styles['category-item']} key={value}>
              <Input
                className={styles['filter-radio']}
                type="radio"
                name="category"
                value={value}
                checked={categoryState === value}
                onChange={() => applyFilters({ category: value })}
              />
              <span className={styles['category-label']}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price section */}
      <div className={styles['price-section']}>
        <div className={styles['price-title']}>
          가격대
        </div>
        <div className={styles['price-list']}>
          {priceOptions.map(({ label, minValue, maxValue }) => (
            <label className={styles['price-item']} key={`${minValue}-${maxValue}`}>
              <Input 
                className={styles['filter-radio']} 
                type="radio" 
                name="priceRange" 
                checked={
                  !isCustom &&
                  Number(minPriceState || 0) === (minValue ?? 0) &&
                  (
                    maxValue === undefined
                      ? maxPriceState === '' || maxPriceState === undefined
                      : Number(maxPriceState || 0) === maxValue
                  )
                }
                onChange={() => {
                  setIsCustom(false);
                  setMinPriceState(minValue?.toString() ?? '');
                  setMaxPriceState(maxValue?.toString() ?? '');
                  applyFilters({
                    minPrice: minValue ?? undefined,
                    maxPrice: maxValue ?? undefined,
                  });
                }}
              />
              <span className={styles['price-label']}>{label}</span>
            </label>
          ))}
          <div className={styles['custom-price']}>
            <label className={styles['custom-header']}>
              <Input 
                className={styles['filter-radio']} 
                type="radio" 
                name="priceRange" 
                value="custom"
                checked={isCustom}
                onChange={() => {
                  setIsCustom(true);
                  setMinPriceState('');
                  setMaxPriceState('');
                }}
              />
              <span className={styles['custom-label']}>직접 설정</span>
            </label>
            {isCustom && (
              <div className={styles['custom-fields']}>
                <div className={styles['min-field']}>
                  <label className={styles['min-label']} htmlFor="minPrice">최소 가격</label>
                  <div className={styles['price-input-wrapper']}>  
                    <Input
                      id="minPrice"
                      className={styles['min-input']} 
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={minPriceState}
                      onChange={handlePriceChange(setMinPriceState)}
                      onBlur={() => isCustom && applyFilters()}
                      onKeyDown={(e) => e.key === 'Enter' && isCustom && applyFilters()}
                    />
                    <span className={styles['unit']}>원</span>
                  </div>
                </div>
                <div className={styles['max-field']}>
                  <label className={styles['max-label']} htmlFor="maxPrice">최대 가격</label>
                  <div className={styles['price-input-wrapper']}> 
                    <Input
                      id="maxPrice"
                      className={styles['max-input']} 
                      type="text"
                      inputMode="numeric"
                      placeholder="123456789"
                      value={maxPriceState}
                      onChange={handlePriceChange(setMaxPriceState)}
                      onBlur={() => isCustom && applyFilters()}
                      onKeyDown={(e) => e.key === 'Enter' && isCustom && applyFilters()}
                    />
                    <span className={styles['unit']}>원</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
