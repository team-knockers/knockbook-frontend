import { WishlistService } from "../../../features/account/services/WishlistService"
import type { BookWish, ProductWish } from "../../../features/account/types"


export type WishlistPageLoaderData = {
  productWishes: ProductWish[]
  bookWishes: BookWish[]
}

export async function WishlistPageLoader(): Promise<WishlistPageLoaderData> {

  const productWishes = (await WishlistService.getProductWishlist()).products;
  const bookWishes = await WishlistService.getBookWishlist();
  return { productWishes, bookWishes } satisfies WishlistPageLoaderData;
}