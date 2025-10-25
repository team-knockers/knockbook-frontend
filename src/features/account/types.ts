export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  mbti: string;
  bio: string;
  favoriteBookCategories: string[];
}

export type UpdateProfilePatch = Partial<{
  displayName: string;
  avatarUrl: string;
  mbti: string;
  bio: string;
  favoriteBookCategories: string[];
}>;

export type UploadAvatarResponse = {
  avatarUrl: string;
}

export type ChangePasswordRequest = {
  password: string;
}

export type VerifyPasswordRequest = {
  password: string;
}

export type Address = {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2: string;
  entryInfo: string;
  deliveryMemo: string;
  isDefault: boolean;
}

export type InsertAddressRequest = {
  recipientName: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2?: string;
  label: string;
  entryInfo?: string;
  deliveryMemo?: string;
  isDefault: boolean;
}

export type UpdateAddressRequest = {
  recipientName?: string;
  phone?: string;
  postalCode?: string;
  address1?: string;
  address2?: string;
  label?: string;
  entryInfo?: string;
  deliveryMemo?: string;
  isDefault?: boolean;
}

export type BookReviewCreateRequest = {
  transactionType: string;  // "PURCHASE" | "RENTAL"
  rating: number;
  content: string;
}

export type BookReview = {
  id: string;
  bookId: string;
  userId: string;
  displayName: string;
  mbti: string | null;
  transactionType: string;
  createdAt: string;
  content: string;
  rating: number;
  imageUrls: string[];
  likesCount: number;
}

export type ReviewedItem = {
  itemType: string; // BOOK, PRODUCT
  id: string;
}

export type ProductReviewCreateRequest = {
  body: string;
  rating: number;
}

export type ProductReview = {
  reviewId: string;
  displayName: string;
  body: string;
  rating: string;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
}

export type GetProductWishlistResponse = {
  products: ProductWish[];
}

export type ProductWish = {
  productId: string;
  name: string;
  unitPriceAmount: number;
  salePriceAmount: number;
  averageRating: number;
  reviewCount: number;
  thumbnailUrl: string;
  availability: string;
  wishedByMe: boolean;
}

export type BookWish = {
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
}
