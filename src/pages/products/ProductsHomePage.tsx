import SearchBar from "../../components/navigation/SearchBar"
import ProductCategoryList from "../../features/products/components/ProductCategoryList";
import ProductSummaryList from "../../features/products/components/ProductSummaryList";
import Footer from "../../components/layout/Footer";    
import ProductSummaryListHeader from "../../features/products/components/ProductSummaryListHeader";
import ProductSummaryListBody from "../../features/products/components/ProductSummaryListBody";
import ProductSummaryCard from "../../features/products/components/ProductSummaryCard";
import ProductBannerSlider from "../../features/products/components/ProductBannerSlider";
import styles from './styles/ProductsHomePage.module.css';
import ProductBanner from "../../features/products/components/ProductBanner";
import { PRODUCT_BANNERS } from "../../features/products/resources/ProductBanner.dummy";
import Pagination from "../../components/navigation/Pagination";
import { useLoaderData, useSearchParams, useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";

export default function ProductsHomePage() {
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

  // Pagination: change only the page param; loader reruns automatically 
  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);
  };

  // Search: navigate to search page with query 
  const handleSearch = (searchKeyword: string) => {
    const kw = searchKeyword.trim();
    if (!kw) return; 
    const next = new URLSearchParams();
    next.set("searchKeyword", kw);

    nav({ pathname: PATHS.productsSearch, search: next.toString() });
  }

  const handleCardClick = (id: string) => {
    console.log(id);
  };

  return (
    <div className={styles['home-layout']}>
      <main className={styles['main-layout']}>
        {/* SearchBar */}
        <SearchBar
          placeholder='상품명을 입력하세요'
          onSearch={handleSearch}
        />
        <ProductBannerSlider>
          {PRODUCT_BANNERS.map((b, i) => (
            <ProductBanner
              key={i}
              bannerImgUrl={b.bannerImgUrl}
              badge={b.badge}
              title1={b.title1}
              title2={b.title2}
              desc={b.desc}
              tone={b.tone}
            />
          ))}
        </ProductBannerSlider>
        {/* Category List */}
        <ProductCategoryList />
        {/* Product Summary List */}
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
      </main>
      <Footer />
    </div>
  );
}
