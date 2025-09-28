import { useSession } from "../../../hooks/useSession";
import { apiAuthPathAndQuery } from "../../../shared/api";
import type { ProductSummaryList } from "../types";

type GetParams = {
  category: string;
  page: number;
  size: number;
  sortBy: "createdAt" | "unitPriceAmount" | "averageRating" | "reviewCount"; 
  order: "asc" | "desc";
  searchKeyword?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const ProductService = {
  async getProductSummaryList(p: GetParams): Promise<ProductSummaryList> {
    const { userId, accessToken } = useSession.getState();
    
    if (!userId) throw new Error("NO_USER");

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
};