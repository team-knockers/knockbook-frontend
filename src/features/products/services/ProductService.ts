import { useSession } from "../../../hooks/useSession";
import { apiAuthPathAndQuery } from "../../../shared/api";
import type { ProductInquiryList, ProductSummaryList } from "../types";
import type { ProductDetail } from "../types";

type SummaryListParams = {
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

  async getProductDetail(p: {productId: string}): Promise<ProductDetail> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery<ProductDetail>(
      "/products/{productId}/{userId}",
      { productId: p.productId, userId },
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
};
