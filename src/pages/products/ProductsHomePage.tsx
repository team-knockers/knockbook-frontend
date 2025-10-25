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
import { useLoaderData, useSearchParams, useNavigate, generatePath } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { useState, useEffect } from "react";
import { CartService } from "../../features/purchase/services/CartService";
import TwoButtonPopup from "../../components/overlay/TwoButtonPopup";
import { ProductService } from "../../features/products/services/ProductService";

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
      wishedByMe: boolean;
    }>;
    page: number;
    totalItems: number;
    totalPages: number;
  };

  const [items, setItems] = useState(products);
  useEffect(() => { setItems(products); }, [products]);

  // Read/write URL query params (pagination, filters, ...)
  const [ sp, setSp ] = useSearchParams();

  // Pagination: change only the page param; loader reruns automatically 
  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);
  };

  async function handleToggleWish(pid: string, current: boolean) {
    setItems(prev => prev.map(p => p.productId === pid ? { ...p, wishedByMe: !current } : p));
    try {
      if (current) {
        await ProductService.removeFromWishlist(pid);
      } else {
        await ProductService.addToWishlist(pid);
      }
    } catch (e) {
      setItems(prev => prev.map(p => p.productId === pid ? { ...p, wishedByMe: current } : p));
    }
  }

  // Search: navigate to search page with query 
  const handleSearch = (searchKeyword: string) => {
    const kw = searchKeyword.trim();
    if (!kw) { return; }
    const next = new URLSearchParams();
    next.set("searchKeyword", kw);

    nav({ pathname: PATHS.productsSearch, search: next.toString() });
  }

  const handleCardClick = (id: string) => {
    nav(generatePath(PATHS.productDetail, { productId: id }));
  };

  /* Add cart event helpers */
  const [isCartPopupVisible, setIsCartPopupVisible] = useState(false);
  async function handleAddItemsOnCart(pid: string) {
    await CartService.addCartPurchaseItem("PRODUCT", pid, 1);
    setIsCartPopupVisible(true);
  }

  return (
    <div className={styles['home-layout']}>
      { isCartPopupVisible &&
        <div className={styles['go-to-cart-popup']}>
          <TwoButtonPopup
            title='선택한 상품을 장바구니에 담았어요.'
            description='장바구니로 이동하시겠어요?'
            cancelText='취소'
            confirmText='장바구니 보기'
            onCancel={() => setIsCartPopupVisible(false)}
            onConfirm={() => nav(PATHS.cart)}/>
        </div>}

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
            {items.map(p => (
              <ProductSummaryCard
                key={p.productId}
                imageSrc={p.thumbnailUrl}
                name={p.name}
                price={p.unitPriceAmount}
                salePrice={p.salePriceAmount ?? undefined}
                rating={p.averageRating}
                reviewCount={p.reviewCount}
                wishedByMe={p.wishedByMe}
                onClick={() => handleCardClick(p.productId)}
                onWishButtonClick={() => handleToggleWish(p.productId, p.wishedByMe)}
                onCartButtonClick={() => handleAddItemsOnCart(p.productId)}
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
