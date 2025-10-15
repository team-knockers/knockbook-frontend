import ProductSummaryCard from '../../features/products/components/ProductSummaryCard';
import s from './AccountLikeBookPage.module.css'
import BookImg from '../../assets/feed_slider_img1.png'

export default function AccountLikeBookPage() {
  // dummy date
  const likedBook = [
    {
      BookId: "p1",
      name: "날씨가 좋으면 찾아가겠어요",
      unitPriceAmount: 18000,
      salePriceAmount: 15000,
      averageRating: 4.8,
      reviewCount: 123,
      thumbnailUrl: BookImg,
    },
    {
      BookId: "p2",
      name: "트렌드 코리아",
      unitPriceAmount: 12000,
      salePriceAmount: null,
      averageRating: 4.5,
      reviewCount: 98,
      thumbnailUrl: BookImg,
    },
    {
      BookId: "p3",
      name: "재무제표, 돈의 흐름을 읽어라",
      unitPriceAmount: 18000,
      salePriceAmount: 15000,
      averageRating: 4.8,
      reviewCount: 123,
      thumbnailUrl: BookImg,
    },
    {
      BookId: "p4",
      name: "날씨가 좋으면 찾아가겠어요",
      unitPriceAmount: 12000,
      salePriceAmount: null,
      averageRating: 4.5,
      reviewCount: 98,
      thumbnailUrl: BookImg,
    },
    {
      BookId: "p5",
      name: "트렌드 코리아",
      unitPriceAmount: 18000,
      salePriceAmount: 15000,
      averageRating: 4.8,
      reviewCount: 123,
      thumbnailUrl: BookImg,
    },
    {
      BookId: "p6",
      name: "재무제표, 돈의 흐름을 읽어라",
      unitPriceAmount: 12000,
      salePriceAmount: null,
      averageRating: 4.5,
      reviewCount: 98,
      thumbnailUrl: BookImg,
    },
  ];

  const handleCardClick = (id: string) => {
    console.log(`도서 ${id} 클릭됨`);
  };

  return (
    <main className={s["page-layout"]}>
      <div className={s["like-list-layout"]}>
        {likedBook.map((p) => (
          <div key={p.BookId} className={s["like-list-item"]}>
            <ProductSummaryCard
              key={p.BookId}
              imageSrc={p.thumbnailUrl}
              name={p.name}
              price={p.unitPriceAmount}
              salePrice={p.salePriceAmount ?? undefined}
              rating={p.averageRating}
              reviewCount={p.reviewCount}
              onClick={() => handleCardClick(p.BookId)}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
