import styles from './styles/ProductsSearchPage.module.css';
import SearchBar from "../../components/navigation/SearchBar";
import ProductSummaryList from "../../features/products/components/ProductSummaryList";
import ProductSummaryListHeader from "../../features/products/components/ProductSummaryListHeader";
import ProductSummaryListBody from "../../features/products/components/ProductSummaryListBody";
import ProductSummaryCard from "../../features/products/components/ProductSummaryCard";
import { useLoaderData, useSearchParams } from "react-router-dom";
import ProductFilterSidebar from "../../features/products/components/ProductFilterSidebar";
import Pagination from "../../components/navigation/Pagination";
import Footer from '../../components/layout/Footer';

export default function ProductsSearchPage() {
  // Get server data prepared by the route loader 
  const { products, page, totalItems, totalPages } = useLoaderData() as {
    products: Array<{
      productId: string;
      name: string;
      unitPriceAmount: number;
      salePriceAmount: number | null;
      averageRating: number;
      reviewCount: number;
      thumbnailUrl: string;
      availability: string;
    }>;
    page: number;
    totalItems: number;
    totalPages: number;
  };

  // Read/write URL query params (pagination, filters, ...)
  const [ sp, setSp ] = useSearchParams();
  
  // Keyword from URL -> used for SearchBar defaultValue and remount key 
  const urlKw = sp.get('searchKeyword') ?? '';
  // Filters from URL -> used to seed FilterSidebar (via remount key)
  const urlCat  = sp.get('category') ?? 'all';
  const urlMinS = sp.get('minPrice'); 
  const urlMaxS = sp.get('maxPrice');

  // Map URL min/max -> FilterSidebar radio code 
  const initialPriceRange = (() => {
    const min = urlMinS ? Number(urlMinS) : null;
    const max = urlMaxS ? Number(urlMaxS) : null;
    if (min === null && max === null) return '';
    if (min === null && max !== null && max < 10000) return 'lt-10000';
    if (min === 10000 && max === 30000) return '10000-30000';
    if (min === 30000 && max === 100000) return '30000-100000';
    if (min === 100000 && max === null) return 'gte-100000';
    return 'custom';
  })();

  // Remount key for FilterSidebar (re-seed initial filter UI when URL changes)
  const sidebarKey = `${urlCat}|${initialPriceRange}|${urlMinS ?? ''}|${urlMaxS ?? ''}`;

  const handleApplyFilters = (f: {
    category: string;
    priceRange: '' | 'lt-10000' | '10000-30000' | '30000-100000' | 'gte-100000' | 'custom';
    minPrice?: number | null;
    maxPrice?: number | null;
  }) => {
    const next = new URLSearchParams(sp);

    // category
    if (f.category && f.category !== 'all') next.set('category', f.category);
    else next.delete('category');

    // radio code -> URL min/max 
    const setMinMax = (min: number | null, max: number | null) => {
      if (min != null) next.set('minPrice', String(min)); else next.delete('minPrice');
      if (max != null) next.set('maxPrice', String(max)); else next.delete('maxPrice');
    };

    switch (f.priceRange) {
      case 'lt-10000':      setMinMax(null, 10000); break;
      case '10000-30000':   setMinMax(10000, 30000); break;
      case '30000-100000':  setMinMax(30000, 100000); break;
      case 'gte-100000':    setMinMax(100000, null); break;
      case 'custom':        setMinMax(f.minPrice ?? null, f.maxPrice ?? null); break;
      default:              setMinMax(null, null); // 가격 필터 없음
    }

    next.delete('page');
    setSp(next); 
  };

  // Pagination: change only the page param; loader reruns automatically 
  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);
  };

  const handleCardClick = (id: string) => {
    console.log(id);
  };
  const handleSearch = (searchKeyword: string) => {
      const kw = searchKeyword.trim();
      const next = new URLSearchParams(sp);
      
      if (kw) {
        next.set("searchKeyword", kw);
      } else {
        next.delete("searchKeyword");   
      }

      next.delete("page");
      setSp(next);
    }

  return (
    <div className={styles['search-layout']}>
    <main className={styles['main-layout']}>
      <SearchBar
        key={urlKw}
        defaultValue={urlKw}
        placeholder='상품명을 입력하세요'
        onSearch={handleSearch}
      />
      <div className={styles['search-content']}>
        <ProductFilterSidebar 
          key={sidebarKey}
          onApply={handleApplyFilters}
          initialCategory={urlCat}
          initialPriceRange={initialPriceRange}
          initialMinPrice={urlMinS ?? ''}
          initialMaxPrice={urlMaxS ?? ''}
        /> 
        <div className={styles['results-pane']}>
          <ProductSummaryList>
            <ProductSummaryListHeader totalCount={totalItems} />
            <ProductSummaryListBody>
              {products.map(p => (
                <ProductSummaryCard
                  key={p.productId}
                  imageSrc={p.thumbnailUrl}
                  name={p.name}
                  price={p.unitPriceAmount}
                  salePrice={p.salePriceAmount ?? undefined}
                  rating={p.averageRating}
                  reviewCount={p.reviewCount}
                  onClick={() => handleCardClick(p.productId)}
                />
              ))}
            </ProductSummaryListBody>  
          </ProductSummaryList>     
          <Pagination
            page={page}  
            totalPages={totalPages}
            onChange={goPage}
          />  
        </div>
      </div>
    </main>
    <Footer />
    </div>
  );
}
