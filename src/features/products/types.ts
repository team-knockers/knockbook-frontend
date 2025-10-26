export type ProductSummary = {
  productId: string;      
  name: string;
  unitPriceAmount: number;
  salePriceAmount: number | null;
  averageRating: number;
  reviewCount: number;
  thumbnailUrl: string;
  availability: string;
  wishedByMe: boolean;
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

export type Product = {
  productId: string;
  categoryId: string;
  sku: string;
  name: string;
  stockQty: number;
  unitPriceAmount: number;
  salePriceAmount: number | null;
  manufacturerName: string;
  isImported: string;
  importCountry: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  releasedAt: string | null;
  status: string;
  availability: string;
  averageRating: number;
  reviewCount: number;
}

export type CreateProductRequest = {
  categoryCode: string;
  sku: string;
  name: string;
  stockQty: number;
  unitPriceAmount: number;
  salePriceAmount?: number | null;

  manufacturerName: string;
  isImported: '국산' | '수입';
  importCountry: string;
  releasedAt?: string; // Instant → ISO("2025-10-26T12:34:56Z")

  status: 'ACTIVE' | 'HIDDEN' | 'DISCONTINUED';
  availability: 'AVAILABLE' | 'OUT_OF_STOCK' | 'PREORDER' | 'BACKORDER' | 'COMING_SOON' | 'SOLD_OUT';

  galleryImageUrls: string[];
  descriptionImageUrls: string[];
};


export type UpdateProductRequest = {
  unitPriceAmount?: number;
  salePriceAmount?: number;
  stockQty?: number;
  status?: 'ACTIVE' | 'HIDDEN' | 'DISCONTINUED';
  availability?: 'AVAILABLE' | 'OUT_OF_STOCK' | 'PREORDER' | 'BACKORDER' | 'COMING_SOON' | 'SOLD_OUT';
};

