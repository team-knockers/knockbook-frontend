export type BookSummary = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  categoryId: string;
  subcategoryId: string;
  rentalAmount: number;
  purchaseAmount: number;
  discountedPurchaseAmount: number;
  coverThumbnailUrl: string;
  rentalAvailability: string;
  purchaseAvailability: string;
  viewCount: number;
  salesCount: number;
  rentalCount: number;
  averageRating: number;
};

export type BooksApiResponse = {
  books: BookSummary[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type BookDetails = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  categoryId: string;
  subcategoryId: string;
  introductionTitle: string;
  introductionDetail: string;
  tableOfContents: string;
  publisherReview: string;
  isbn13: string;
  pageCountText: string;
  dimensionsText: string;
  weightText: string;
  totalVolumesText: string;
  rentalAmount: number;
  purchaseAmount: number;
  discountedPurchaseAmount: number;
  coverImageUrl: string;
  rentalAvailability: string;
  purchaseAvailability: string;
  viewCount: number;
  salesCount: number;
  rentalCount: number;
  averageRating: number;
  ratingCount: number;
  rentalPoint: number;
  purchasePoint: number;
};

export type BookCategory = {
  id: string;
  categoryCodeName: string;
  categoryDisplayName: string;
};

export type BookSubcategory = {
  id: string;
  subcategoryCodeName: string;
  subcategoryDisplayName: string;
};

// Common SelectOption type
export type ListHeaderSelectOption = {
  value: string;
  label: string;
};

export type SearchOption = 'title' | 'author' | 'publisher';

export const SEARCH_OPTIONS: { value: SearchOption; label: string }[] = [
  { value: 'title', label: '도서명' },
  { value: 'author', label: '저자명' },
  { value: 'publisher', label: '출판사' },
] as const;

export type CommonSearchState = {
  category: string;
  subcategory: string;
  page: number;
  size: number;
  sortBy: 'published' | 'views' | 'sales' | 'rentals' | 'price';
  order: 'asc' | 'desc';
};

export type BookSearchState = CommonSearchState & {
  searchBy: 'title' | 'author' | 'publisher';
  searchKeyword: string;
  minPrice?: number;
  maxPrice?: number;
};

export type BookSearchFilters = {
  category: string;
  minPrice?: number;
  maxPrice?: number;
};

/* Category option for RadioButton */
export const categoryOptions = [
  { value: 'all', label: '전체' },
  { value: 'fiction', label: '소설' },
  { value: 'essay', label: '시/에세이' },
  { value: 'humanities', label: '인문' },
  { value: 'parenting', label: '가정/육아' },
  { value: 'cooking', label: '요리' },
  { value: 'health', label: '건강' },
  { value: 'lifestyle', label: '취미/실용/스포츠' },
  { value: 'business', label: '경제/경영' },
  { value: 'selfImprovement', label: '자기계발' },
  { value: 'politics', label: '정치/사회' },
  { value: 'culture', label: '역사/문화' },
  { value: 'religion', label: '종교' },
  { value: 'entertainment', label: '예술/대중문화' },
  { value: 'technology', label: '기술/공학' },
  { value: 'language', label: '외국어' },
  { value: 'science', label: '과학' },
  { value: 'travel', label: '여행' },
  { value: 'it', label: '컴퓨터/IT' },
];

/* Price option for RadioButton */
export const priceOptions = [
  { label: '1.5만원 이하', minValue: 0, maxValue: 15000 },
  { label: '1.5만원–2.5만원', minValue: 15000, maxValue: 25000 },
  { label: '2.5만원–3.5만원', minValue: 25000, maxValue: 35000 },
  { label: '3.5만원 이상', minValue: 35000, maxValue: undefined },
];

export const sortOptions = [
  { value: 'published', label: '최신순', order: 'desc' },
  { value: 'views', label: '조회순', order: 'desc' },
  { value: 'sales', label: '구매순', order: 'desc' },
  { value: 'rentals', label: '대여순', order: 'desc' },
  { value: 'price', label: '가격순', order: 'asc' }
] as const;

export type BookMbtiPercentage = {
  mbti: string;
  percentage: number;
};

export type BookStarCount = {
  score: string,
  count: number,
};

export const transactionOptions = [
  { value: 'all', label: '전체' },
  { value: 'purchase', label: '구매' },
  { value: 'rental', label: '대여' },
];

export const reviewsSortOptions = [
  { value: 'likes', label: '인기순', order: 'desc' },
  { value: 'createdAt', label: '최신순', rder: 'desc' },
  { value: 'rating', label: '별점 높은순', order: 'desc' },
] as const;

export type BookReviewsApiResponse = {
  reviews: BookReview[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type BookReview = {
  id: string,
  displayName: string,
  mbti: string,
  transactionType: string,
  createdAt: string,
  content: string,
  rating: number,
  imageUrls: string[],
  likesCount: number,
  likedByMe: boolean
};

export type BookReviewsStatistics = {
  averageRating: number,
  reviewCount: number,
  scoreCounts: BookStarCount[],
  mbtiPercentage: BookMbtiPercentage[]
};


export type BookWishlistActionResponse = {
    bookId: string;
    wishlisted: boolean;
    action :string;
}

export type BookWishStatusResponse = {
    wished: boolean;
}

export type BookReviewCreateRequest = {
    transactionType: string;
    rating: number;
    content: string;
}

export type GetRandomBookReviewResponse = {
    id: string;
    userId: string;
    displayName: string;
    bookId: string;
    coverThumbnailUrl: string;
    content: string;
}
