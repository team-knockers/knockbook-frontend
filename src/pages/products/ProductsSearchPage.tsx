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
import { useNavigate, generatePath } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

export default function ProductsSearchPage() {
  const nav = useNavigate();

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
  
  // URL -> initial seeds 
  const urlKw = sp.get('searchKeyword') ?? '';
  const urlCat  = sp.get('category') ?? 'all';
  const urlMinS = sp.get('minPrice'); 
  const urlMaxS = sp.get('maxPrice');

  // FilterSidebar remount key
  const sidebarKey = `${urlCat}|${urlMinS ?? ''}|${urlMaxS ?? ''}`;

  // SearchBar -> update URL 
  const handleSearch = (searchKeyword: string) => {
      const kw = searchKeyword.trim();
      const next = new URLSearchParams(sp);
      if (kw) { next.set("searchKeyword", kw); } 
      else { next.delete("searchKeyword"); }
      next.delete("page");
      setSp(next);
  }

  // Sidebar -> only min/max + category back to parent 
  const handleApplyFilters = (f: {
    category: string;
    minPrice?: number | null;
    maxPrice?: number | null;
  }) => {
    const next = new URLSearchParams(sp);

    if (f.category && f.category !== 'all') { next.set('category', f.category); }
    else { next.delete('category'); }

    if (f.minPrice != null) { next.set('minPrice', String(f.minPrice)); }
    else { next.delete('minPrice'); }

    if (f.maxPrice != null) { next.set('maxPrice', String(f.maxPrice)); }
    else { next.delete('maxPrice'); }

    next.delete('page'); // reset page on filter change
    setSp(next); 
  };

  // Pagination
  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);
  };

  const handleCardClick = (id: string) => {
    nav(generatePath(PATHS.productsDetail, { productId: id }));
  };

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
