import type { LoaderFunctionArgs } from "react-router-dom";
import { ProductService } from "../../features/products/services/ProductService";

export async function productDetailLoader({params}: LoaderFunctionArgs){
  const productId = params.productId;
  if (!productId) {
    throw new Response("Product not found", { status: 404 });
  }

  return ProductService.getProductDetail(productId);
}
