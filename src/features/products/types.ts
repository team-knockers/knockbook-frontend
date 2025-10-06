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

export type QnaStatus = 'ANSWERED' | 'WAITING';

export type QnaItem = {
  qnaId: string;
  userName: string;     
  createdAt: string;   
  status: QnaStatus;    
  summary: string;     
  questionBody: string;  
  answerBody?: string;
  answeredAt?: string;
};

export type ProductQnaList = {
  qnas: QnaItem[];
  productId: string;
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};
