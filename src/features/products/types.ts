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

export type ProductReview = {
  reviewId: string;
  userId: string;
  createdAt: string;      
  rating: 1|2|3|4|5;      
  content: string;
  likesCount: number;
  liked: boolean;         
};

export type ProductReviewList = {
  reviews: ProductReview[];
  productId: string;
  page: number;         
  size: number;         
  totalItems: number;
  totalPages: number;
  averageRating: number;   
  starCounts: Array<{ score: 1|2|3|4|5; count: number }>; 
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
