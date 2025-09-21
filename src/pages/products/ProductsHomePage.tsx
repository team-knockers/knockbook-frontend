import SearchBar from "../../components/navigation/SearchBar"
import ProductCategoryList from "../../features/products/components/ProductCategoryList";
import ProductSummaryList from "../../features/products/components/ProductSummaryList";

export default function ProductsHomePage() {
  
  function handleSearch(searchKeyword: string) {
    // searchKeyword를 searchBar component로부터 받아서
    // backend API 요청을 보내는 로직 작성 예정
    console.log(searchKeyword);
  }
  return (
    <main>
      <SearchBar
        placeholder='상품명을 입력하세요'
        onSearch={handleSearch}
      />
      <ProductCategoryList />
      <ProductSummaryList />
    </main>
  );
}
