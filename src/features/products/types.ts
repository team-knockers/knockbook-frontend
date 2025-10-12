export type ProductSummary = {
  productId: string;      
  name: string;
  unitPriceAmount: number;
  salePriceAmount: number | null;
  averageRating: number;
  reviewCount: number;
  thumbnailUrl: string;
  availability: string;
};

export type ProductSummaryList = {
  products: ProductSummary[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type ProductDetail = {
  productId: string;
  name: string;
  unitPriceAmount: number;
  salePriceAmount: number | null;
  manufacturerName: string;
  isImported: string;
  importCountry: string;
  averageRating: number;
  reviewCount: number;
  stockQty: number;
  galleryImageUrls: string[];
  descriptionImageUrls: string[];
};

export type ProductInquiry = {
  inquiryId: string;
  displayName: string;
  title: string;
  questionBody: string;
  createdAt: string;
  answerBody: string | null;
  answeredAt: string | null;
  status: string; // "ANSWERED" | "WAITING"
};

export type ProductInquiryList = {
  productInquiries: ProductInquiry[];
  page: number;
  totalPages: number;
};

export type ProductReview = {
  reviewId: string;
  displayName: string;
  body: string;
  rating: 1|2|3|4|5;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
}

export type ProductReviewList = {
  productReviews: ProductReview[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  averageRating: number;
  starCounts: Record<'5'|'4'|'3'|'2'|'1', number>;
}
