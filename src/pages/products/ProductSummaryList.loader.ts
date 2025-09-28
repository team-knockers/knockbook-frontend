import type { LoaderFunctionArgs } from "react-router-dom";
import { ProductService } from "../../features/products/services/ProductService";

export async function productSummaryListLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Read query params from URL 
  const page     = toInt(url.searchParams.get("page"), 1);
  const size     = toInt(url.searchParams.get("size"), 16);
  const category = (url.searchParams.get("category") ?? "all").trim();
  const sortBy   = (url.searchParams.get("sortBy") ?? "createdAt").trim() as
                   "createdAt" | "unitPriceAmount" | "averageRating" | "reviewCount";
  const order    = (url.searchParams.get("order") ?? "desc").trim() as "asc" | "desc";

  const kw       = (url.searchParams.get("searchKeyword") ?? "").trim();
  const minPrice = toIntOpt(url.searchParams.get("minPrice"));
  const maxPrice = toIntOpt(url.searchParams.get("maxPrice"));

  // Mobile rule: ignore page/size and load a big chunk of data at once
  const isMobile =
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 1024px)").matches;

  const MOBILE_BIG_SIZE = 1000; // adjust as needed 

  // Effective page/size to request
  const effectivePage = isMobile ? 1 : page;
  const effectiveSize = isMobile ? MOBILE_BIG_SIZE : size;

  return ProductService.getProductSummaryList({
    category, 
    page: effectivePage, 
    size: effectiveSize, 
    sortBy, 
    order,
    ...(kw ? { searchKeyword: kw } : {}),
    ...(minPrice!=null && maxPrice!=null && minPrice>maxPrice ? {} : {
      ...(minPrice!=null ? { minPrice } : {}),
      ...(maxPrice!=null ? { maxPrice } : {}),
    }),
  });
}

const toInt = (v: string | null, d: number) => {
  const n = Number(v); 
  return Number.isFinite(n) && n > 0 ? n : d;
};
const toIntOpt = (v: string | null) => {
  if (v == null || v.trim() === "") return undefined;
  const n = Number(v); 
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};
