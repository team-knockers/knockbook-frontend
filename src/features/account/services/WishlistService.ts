import { apiAuthPath } from "../../../shared/api";
import { ensureUserId } from "../../../shared/authReady";
import type { BookWish, GetProductWishlistResponse } from "../types";

export const WishlistService = {

  async getProductWishlist() {
    const userId = await ensureUserId();
    return await apiAuthPath<GetProductWishlistResponse>(
      "/products/wishes/{userId}",
      { userId },
      { method: "GET" }
    )
  },

    async getBookWishlist() {
    const userId = await ensureUserId();
    return await apiAuthPath<BookWish[]>(
      "/books/{userId}/wishlist",
      { userId },
      { method: "GET" }
    )
  },
}