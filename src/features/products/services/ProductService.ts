import { useSession } from "../../../hooks/useSession";
import { apiAuthPathAndQuery, apiAuthPathWithJson } from "../../../shared/api";
import type { PageResponse } from "../../../shared/types";
import type { 
  CreateProductRequest, Product, ProductInquiryList, ProductReviewList,
  ProductSummaryList, UpdateProductRequest } from "../types";
import type { ProductDetail } from "../types";

export type SummaryListParams = {
  category: string;
  page: number;
  size: number;
  sortBy: "createdAt" | "unitPriceAmount" | "averageRating" | "reviewCount"; 
  order: "asc" | "desc";
  searchKeyword?: string;
  minPrice?: number;
  maxPrice?: number;
};

type InquiryListParams = {
  productId: string;
  page: number;
  size: number;
}

type ReviewListParams = {
  productId: string;
  page: number;
  size: number;
  sortBy: "createdAt" | "rating" | "likesCount";
  order: "asc" | "desc";
}

export const ProductService = {
  async getProductSummaryList(p: SummaryListParams): Promise<ProductSummaryList> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const q = {
      category: p.category,
      page: p.page,
      size: p.size,
      sortBy: p.sortBy,
      order: p.order,
      ...(p.searchKeyword ? { searchKeyword: p.searchKeyword } : {}),
      ...(p.minPrice !== undefined ? { minPrice: p.minPrice } : {}),
      ...(p.maxPrice !== undefined ? { maxPrice: p.maxPrice } : {}),
    };

    return apiAuthPathAndQuery<ProductSummaryList>(
        "/products/{userId}", 
        { userId }, 
        q, 
        { method: "GET" }
    );
  },

  async getProductDetail(productId: string): Promise<ProductDetail> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery<ProductDetail>(
      "/products/{productId}/{userId}",
      { productId, userId },
      undefined,
      { method: "GET" }
    );
  },

  async getProductInquiryList(p: InquiryListParams): Promise<ProductInquiryList> {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return apiAuthPathAndQuery<ProductInquiryList>(
      "/products/{productId}/inquiries/{userId}",
      { productId: p.productId, userId },
      { page: p.page, size: p.size },
      { method: "GET" }
    );
  },

  async getProductReviewList(p: ReviewListParams): Promise<ProductReviewList> {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return apiAuthPathAndQuery<ProductReviewList>(
      "/products/{productId}/reviews/{userId}",
      { productId: p.productId, userId },
      { page: p.page, size: p.size, sortBy: p.sortBy, order: p.order, _: Date.now() },
      { method: "GET" }
    );
  },

  async likeReview(reviewId: string): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");
    
    return apiAuthPathAndQuery<void>(
      "/products/reviews/{reviewId}/likes/{userId}",
      { reviewId, userId},
      undefined,
      { method: "PUT" }
    );
  },

  async unlikeReview(reviewId: string): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");
    
    return apiAuthPathAndQuery<void>(
      "/products/reviews/{reviewId}/likes/{userId}",
      { reviewId, userId},
      undefined,
      { method: "DELETE" }
    );
  },

  async createInquiry(
    productId: string,
    payload: { title: string; questionBody: string; }
  ): Promise<void>{
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return apiAuthPathAndQuery<void>(
      "/products/{productId}/inquiries/{userId}",
      { productId, userId },
      undefined,
      { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
  },

  async addToWishlist (
    productId: string
  ): Promise<void>{
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return apiAuthPathAndQuery<void>(
      "/products/wishes/{productId}/{userId}",
      { productId, userId },
      undefined,
      { method: "PUT" }
    );
  },

  async removeFromWishlist (
    productId: string
  ): Promise<void>{
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return apiAuthPathAndQuery<void>(
      "/products/wishes/{productId}/{userId}",
      { productId, userId },
      undefined,
      { method: "DELETE" }
    );
  },

  async listProducts(page: number, size: number) {
    return await apiAuthPathAndQuery<PageResponse<Product>>(
      "/products",
      {},
      { page, size },
      { method: "GET" }
    );
  },

  async registerProduct(req: CreateProductRequest) {
    return await apiAuthPathWithJson<ProductDetail, CreateProductRequest>(
      "/products",
      {},
      { method: 'POST', json: req }
    )
  },

  async updateProduct(productId: string, req: UpdateProductRequest) {
    return await apiAuthPathWithJson<ProductDetail, UpdateProductRequest>(
      "/products/{productId}",
      { productId },
      { method: 'PATCH', json: req }
    )
  },
};
