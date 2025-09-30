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
      const next = new URLSearchParams();
      if (kw) next.set("searchKeyword", kw);
    }

  return (
    <div className={styles['search-layout']}>
    <main className={styles['main-layout']}>
      <SearchBar
        placeholder='상품명을 입력하세요'
        onSearch={handleSearch}
      />
      <div className={styles['search-content']}>
        <ProductFilterSidebar /> 
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
