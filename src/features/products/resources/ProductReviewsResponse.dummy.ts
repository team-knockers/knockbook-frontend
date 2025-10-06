import type { ProductReviewList } from "../types";

export const productReviewsResponseDummy: ProductReviewList = {
  productId: 'p-1001',
  page: 1,
  size: 5,
  totalItems: 23,
  totalPages: 5,

  averageRating: 4.3,
  starCounts: [
    { score: 5, count: 14 },
    { score: 4, count: 5 },
    { score: 3, count: 3 },
    { score: 2, count: 1 },
    { score: 1, count: 0 },
  ],

  reviews: [
    { reviewId: 'r101', userId: 'sally12', createdAt: '2025-10-05', rating: 5, content: '배송 빠르고 포장 깔끔.',        likesCount: 34, liked: false },
    { reviewId: 'r102', userId: 'mike',    createdAt: '2025-10-04', rating: 4, content: '품질 좋음. 재구매 의사 있어요.', likesCount: 12, liked: true  },
    { reviewId: 'r103', userId: 'hani',    createdAt: '2025-10-03', rating: 3, content: '가격 대비 무난.',               likesCount: 2,  liked: false },
    { reviewId: 'r104', userId: 'kk_dev',  createdAt: '2025-10-03', rating: 5, content: '조립 간단, 설명서 친절.',        likesCount: 6,  liked: false },
    { reviewId: 'r105', userId: 'eunji',   createdAt: '2025-10-02', rating: 5, content: '선물용으로 추천!',               likesCount: 18, liked: true  },
    { reviewId: 'r106', userId: 'junho',  createdAt: '2025-10-02', rating: 4, content: '색감 예뻐요. 마감도 괜찮았습니다.',        likesCount: 5,  liked: false },
    { reviewId: 'r107', userId: 'yuri',   createdAt: '2025-10-01', rating: 2, content: '생각보다 작아요. 교환 고민 중.',          likesCount: 1,  liked: false },
    { reviewId: 'r108', userId: 'leo',    createdAt: '2025-09-30', rating: 5, content: '가성비 최고. 가족들도 만족했어요!',      likesCount: 9,  liked: true  },
    { reviewId: 'r109', userId: 'nari',   createdAt: '2025-09-29', rating: 3, content: '무난무난. 배송은 보통, 품질 보통.',       likesCount: 0,  liked: false },
    { reviewId: 'r110', userId: 'dev_k',  createdAt: '2025-09-28', rating: 1, content: '불량이 와서 실망… 고객센터 문의했습니다.', likesCount: 2,  liked: false },
  ],
};
