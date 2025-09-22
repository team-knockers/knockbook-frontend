import styles from './styles/ProductFilterSidebar.module.css';
import { FiRefreshCcw } from 'react-icons/fi';
import { Input } from 'reactstrap';
import { useState } from 'react';   

type Filters = {
  category: string;
  priceRange: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export default function ProductFilterSidebar({
    onApply = () => {},
}: {onApply?: (f:Filters) => void}) {
  const [category, setCategory]     = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('');
  const [minPrice, setMinPrice]     = useState<string>(''); 
  const [maxPrice, setMaxPrice]     = useState<string>('');
  const isCustom = priceRange === 'custom';

  // 초기화 버튼 
  const handleReset = () => {
    setCategory('all');
    setPriceRange('');
    setMinPrice('');
    setMaxPrice('');
  }

  // 적용 버튼 
  const handleApply = () => {
    const filters: Filters = {
      category,
      priceRange,
      minPrice: isCustom && minPrice ? Number(minPrice) : null,
      maxPrice: isCustom && maxPrice ? Number(maxPrice) : null,
    };
    // todo
    onApply(filters);
  }

  return (
    <div className={styles['product-filter-sidebar']}>
      {/* 헤더: 필터 + 초기화 */}
      <div className={styles['header']}>
        <div className={styles['header-title']}>필터</div>
        <button className={styles['header-reset']} 
                type="button"
                onClick={handleReset}
        >
          <FiRefreshCcw size={14} />
        </button>
      </div>

      {/* 카테고리 섹션 */}
      <div className={styles['category-section']}>
        <div className={styles['category-title']}>카테고리</div>
        
        <div className={styles['category-list']}>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="all" 
              checked={category === 'all'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>전체</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="bookStand" 
              checked={category === 'bookStand'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>독서대</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="bookCover" 
              checked={category === 'bookCover'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>북커버</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="bookMark" 
              checked={category === 'bookMark'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>북마크</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="bookStorage" 
              checked={category === 'bookStorage'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>책수납</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="magnifier" 
              checked={category === 'magnifier'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>돋보기</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="footRest" 
              checked={category === 'footRest'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>발받침대</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="bookPerfume"
              checked={category === 'bookPerfume'}
              onChange={(e) => setCategory(e.target.value)} 
            />
            <span className={styles['category-label']}>북퍼퓸</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="bookLight" 
              checked={category === 'bookLight'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>북라이트</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="paperWeight" 
              checked={category === 'paperWeight'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>문진</span>
          </div>
          <div className={styles['category-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="category" 
              value="readingNote" 
              checked={category === 'readingNote'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <span className={styles['category-label']}>독서노트</span>
          </div>
        </div>
      </div>

      {/* 가격 섹션 */}
      <div className={styles['price-section']}>
        <div className={styles['price-title']}>가격대</div>

        <div className={styles['price-list']}>
          <div className={styles['price-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="priceRange" 
              value="lt-10000" 
              checked={priceRange === 'lt-10000'}
              onChange={(e) => setPriceRange(e.target.value)}
            />
            <span className={styles['price-label']}>1만원 이하</span>
          </div>
          <div className={styles['price-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="priceRange" 
              value="10000-30000"
              checked={priceRange === '10000-30000'}
              onChange={(e) => setPriceRange(e.target.value)} 
            />
            <span className={styles['price-label']}>1만원–3만원</span>
          </div>
          <div className={styles['price-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="priceRange" 
              value="30000-100000" 
              checked={priceRange === '30000-100000'}
              onChange={(e) => setPriceRange(e.target.value)}
            />
            <span className={styles['price-label']}>3만원–10만원</span>
          </div>
          <div className={styles['price-item']}>
            <Input 
              className={styles['filter-radio']} 
              type="radio" 
              name="priceRange" 
              value="gte-100000" 
              checked={priceRange === 'gte-100000'}
              onChange={(e) => setPriceRange(e.target.value)}
            />
            <span className={styles['price-label']}>10만원 이상</span>
          </div>

          {/* 직접 설정 */}
          <div className={styles['custom-price']}>
            <div className={styles['custom-header']}>
              <Input 
                className={styles['filter-radio']} 
                type="radio" 
                name="priceRange" 
                value="custom" 
                checked={priceRange === 'custom'}
                onChange={(e) => setPriceRange(e.target.value)}
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
                  onChange={(e) => setMinPrice(e.target.value)} 
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
                  onChange={(e) => setMaxPrice(e.target.value)}
                  disabled={!isCustom}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['apply-row']}>
        <button type="button" 
                className={styles['apply-btn']}
                onClick={handleApply}
        >적용</button>
      </div>
    </div>
  );
}
