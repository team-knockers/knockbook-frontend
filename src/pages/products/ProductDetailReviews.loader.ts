import type { LoaderFunctionArgs } from "react-router-dom";
import { ProductService } from "../../features/products/services/ProductService";

export async function productDetailReviewsLoader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const productId = params.productId;
  if (!productId) throw new Response("Product not found", { status: 404 });

  const page = toInt(url.searchParams.get("page"), 1);
  const size = toInt(url.searchParams.get("size"), 10);
  const sortBy   = (url.searchParams.get("sortBy") ?? "createdAt").trim() as
                   "createdAt" | "rating" | "likesCount";
  const order    = (url.searchParams.get("order") ?? "desc").trim() as "asc" | "desc";

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023.98px)").matches;

  const MOBILE_BIG_SIZE = 1000;
  const effectivePage = isMobile ? 1 : page;
  const effectiveSize = isMobile ? MOBILE_BIG_SIZE : size;

  return ProductService.getProductReviewList({
    productId,
    page: effectivePage,
    size: effectiveSize,
    sortBy,
    order,
  });
}

const toInt = (v: string | null, d: number) => {
  const n = parseInt((v ?? "").trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : d;
};
