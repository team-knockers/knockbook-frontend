import SearchBar from "../../components/navigation/SearchBar"
import ProductCategoryList from "../../features/products/components/ProductCategoryList";
import ProductSummaryList from "../../features/products/components/ProductSummaryList";
import Footer from "../../components/layout/Footer";    
import ProductSummaryListHeader from "../../features/products/components/ProductSummaryListHeader";
import { productSummaryDummy }  from "../../features/products/resources/ProductSummary.dummy";
import { useState } from "react";
import ProductSummaryListBody from "../../features/products/components/ProductSummaryListBody";
import ProductSummaryCard from "../../features/products/components/ProductSummaryCard";
import ProductBannerSlider from "../../features/products/components/ProductBannerSlider";
import styles from './styles/ProductsHomePage.module.css';
import ProductBanner from "../../features/products/components/ProductBanner";
import { PRODUCT_BANNERS } from "../../features/products/resources/ProductBanner.dummy";
import Pagination from "../../components/navigation/Pagination";

export default function ProductsHomePage() {
  
  function handleSearch(searchKeyword: string) {
    // searchKeyword를 searchBar component로부터 받아서
    // backend API 요청을 보내는 로직 작성 예정
    console.log(searchKeyword);
  }

  // 임시 더미 데이터 사용 (추후 API 연동 예정)
  const items = productSummaryDummy;
  const [categoryLabel] = useState('전체');
  const [sortLabel] = useState('인기순');

  const openCategoryDropdown = () => {};
  const openSortDropdown = () => {};  
  const handleCardClick = (id: string) => {
    console.log(id);
  };

  const [page, setPage] = useState(1);

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
          <ProductSummaryListHeader
            categoryLabel={categoryLabel}
            sortLabel={sortLabel}
            totalCount={items.length}
            onCategoryClick={openCategoryDropdown}
            onSortClick={openSortDropdown}
          />
          <ProductSummaryListBody>
            {items.map(p => (
              <ProductSummaryCard
                key={p.id}
                imageSrc={p.imageSrc}
                name={p.name}
                price={p.price}
                salePrice={p.salePrice}
                rating={p.rating}
                reviewCount={p.reviewCount}
                onClick={() => handleCardClick(p.id)}
              />
            ))}
          </ProductSummaryListBody>  
        </ProductSummaryList>
        <Pagination
          page={page}  
          totalPages={50}
          onChange={setPage}
        />
      </main>
      <Footer />
    </div>
  );
}
