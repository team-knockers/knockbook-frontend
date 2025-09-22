import SearchBar from "../../components/navigation/SearchBar"
import ProductCategoryList from "../../features/products/components/ProductCategoryList";
import ProductSummaryList from "../../features/products/components/ProductSummaryList";
import Footer from "../../components/layout/Footer";    
import ProductSummaryListHeader from "../../features/products/components/ProductSummaryListHeader";
import { productSummaryDummy }  from "../../features/products/components/DummySummary";
import { useState } from "react";
import ProductSummaryListBody from "../../features/products/components/ProductSummaryListBody";
import ProductSummaryCard from "../../features/products/components/ProductSummaryCard";

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
    // id를 이용해 상품 상세 페이지로 이동하는 로직 작성 예정
  };


  return (
    <>
      <main>
        {/* SearchBar */}
        <SearchBar
          placeholder='상품명을 입력하세요'
          onSearch={handleSearch}
        />
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
      </main>
      <Footer />
    </>
  );
}

