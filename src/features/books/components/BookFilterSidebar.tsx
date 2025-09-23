import styles from './styles/BookFilterSidebar.module.css';
import { FiRefreshCcw } from 'react-icons/fi';
import { Input } from 'reactstrap';
import { useState } from 'react';   
import { categoryOptions, priceOptions, type Filters } from '../types';

type BookFilterSidebarProps = {
  onApplied: (filters: Filters) => void;
};

export default function BookFilterSidebar({
    onApplied = () => {},
}: BookFilterSidebarProps) {

  const [category, setCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>(''); 
  const [maxPrice, setMaxPrice]     = useState<string>('');
  const isCustom = priceRange === 'custom';

  // Reset button
  const resetButtonClicked = () => {
    setCategory('all');
    setPriceRange('');
    setMinPrice('');
    setMaxPrice('');
  }

  // Apply button 
  const applyButtonClicked = () => {
    const filters: Filters = {
      category,
      priceRange,
      minPrice: isCustom && minPrice ? Number(minPrice) : null,
      maxPrice: isCustom && maxPrice ? Number(maxPrice) : null,
    };
    onApplied(filters);
  }

  // Prevent non-numeric input for minimum value
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMinPrice(value);
    }
  };

  // Prevent non-numeric input for maximum value
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMaxPrice(value);
    }
  };

  return (
    <div className={styles['book-filter-sidebar']}>
      {/* Header and Reset button */}
      <div className={styles['header']}>
        <div className={styles['header-title']}>필터</div>
        <button 
          className={styles['.reset-button']} 
          type="button"
          onClick={resetButtonClicked}
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
                checked={category === value}
                onChange={(e) => setCategory(e.target.value)}
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
          {priceOptions.map(({ value, label }) => (
            <label className={styles['price-item']} key={value}>
              <Input 
                className={styles['filter-radio']} 
                type="radio" 
                name="priceRange" 
                value={value} 
                checked={priceRange === value}
                onChange={(e) => setPriceRange(e.target.value)}
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
                checked={priceRange === 'custom'}
                onChange={(e) => setPriceRange(e.target.value)}
              />
              <span className={styles['custom-label']}>직접 설정</span>
            </label>
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
                    value={minPrice}                     
                    onChange={handleMinPriceChange} 
                    onFocus={() => setPriceRange('custom')}
                    readOnly={priceRange !== 'custom'}
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
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    onFocus={() => setPriceRange('custom')}
                    readOnly={priceRange !== 'custom'}
                  />
                  <span className={styles['unit']}>원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Apply button */}
      <div className={styles['apply-row']}>
        <button
          type="button" 
          className={styles['apply-button']}
          onClick={applyButtonClicked}
        >
          적용
        </button>
      </div>
    </div>
  );
}
