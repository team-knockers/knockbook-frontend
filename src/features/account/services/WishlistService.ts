import { useSession } from "../../../hooks/useSession";
import { apiAuthPath } from "../../../shared/api";
import type { BookWish, GetProductWishlistResponse } from "../types";

export const WishlistService = {

  async getProductWishlist() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<GetProductWishlistResponse>(
      "/products/wishes/{userId}",
      { userId },
      { method: "GET" }
    )
  },

    async getBookWishlist() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<BookWish[]>(
      "/books/{userId}/wishlist",
      { userId },
      { method: "GET" }
    )
  },
}