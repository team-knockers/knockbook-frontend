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
  maunfacturerName: string;
  isImported: string;
  importCountry: string;
  averageRating: number;
  reviewCount: number;
  stockQty: number;
  galleryImageUrls: string[];
  descriptionImageUrls: string[];
};
