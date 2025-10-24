import ProductSummaryCard from '../../features/products/components/ProductSummaryCard';
import s from './LikeProductPage.module.css'
import ProductImg from '../../assets/feed_slider_img2.png'

export default function LikeProductPage() {
  // dummy date
  const likedProducts = [
    {
      productId: "p1",
      name: "2025 다이어리 세트",
      unitPriceAmount: 18000,
      salePriceAmount: 15000,
      averageRating: 4.8,
      reviewCount: 123,
      thumbnailUrl: ProductImg,
      wishedByMe: true,
    },
    {
      productId: "p2",
      name: "아트 포스터 캘린더",
      unitPriceAmount: 12000,
      salePriceAmount: null,
      averageRating: 4.5,
      reviewCount: 98,
      thumbnailUrl: ProductImg,
      wishedByMe: true,
    },
    {
      productId: "p3",
      name: "2025 다이어리 세트",
      unitPriceAmount: 18000,
      salePriceAmount: 15000,
      averageRating: 4.8,
      reviewCount: 123,
      thumbnailUrl: ProductImg,
      wishedByMe: true,
    },
    {
      productId: "p4",
      name: "아트 포스터 캘린더",
      unitPriceAmount: 12000,
      salePriceAmount: null,
      averageRating: 4.5,
      reviewCount: 98,
      thumbnailUrl: ProductImg,
      wishedByMe: true,
    },
    {
      productId: "p5",
      name: "2025 다이어리 세트",
      unitPriceAmount: 18000,
      salePriceAmount: 15000,
      averageRating: 4.8,
      reviewCount: 123,
      thumbnailUrl: ProductImg,
      wishedByMe: true,
    },
    {
      productId: "p6",
      name: "아트 포스터 캘린더",
      unitPriceAmount: 12000,
      salePriceAmount: null,
      averageRating: 4.5,
      reviewCount: 98,
      thumbnailUrl: ProductImg,
      wishedByMe: true,
    },
  ];

  const handleCardClick = (id: string) => {
    console.log(`상품 ${id} 클릭됨`);
  };

  return (
    <main className={s["page-layout"]}>
      <div className={s["like-list-layout"]}>
        {likedProducts.map((p) => (
          <div key={p.productId} className={s["like-list-item"]}>
            <ProductSummaryCard
              key={p.productId}
              imageSrc={p.thumbnailUrl}
              name={p.name}
              price={p.unitPriceAmount}
              salePrice={p.salePriceAmount ?? undefined}
              rating={p.averageRating}
              reviewCount={p.reviewCount}
              onClick={() => handleCardClick(p.productId)}
              wishedByMe={p.wishedByMe}
              onWishButtonClick={() => {/* TODO */}}
              onCartButtonClick={() => {/* TODO */}}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
