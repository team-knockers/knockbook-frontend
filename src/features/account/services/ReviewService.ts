import { useSession } from "../../../hooks/useSession";
import { apiAuthPath, apiAuthPathWithJson } from "../../../shared/api";
import type { BookReview, ProductReview, ProductReviewCreateRequest, ReviewedItem } from "../types";

export const ReviewService = {

  async createBookReview(
    transactionType: string,
    bookId: string,
    rating: number,
    content: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    const form = new FormData();
    form.append(
      "review",
      new Blob([JSON.stringify({ transactionType, rating, content })],
      { type: "application/json" }));
    return await apiAuthPath<BookReview>(
      "/books/{userId}/{bookId}/reviews",
      { userId, bookId },
      { method: "POST", body: form }
    );
  },

  async createProductReview(
    productId: string,
    rating: number,
    content: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    const req = { body: content, rating } as ProductReviewCreateRequest;
    return await apiAuthPathWithJson<ProductReview, ProductReviewCreateRequest>(
      "/products/{productId}/reviews/{userId}",
      { userId, productId },
      { method: "POST", json: req }
    );
  },

  async getMyBookReviewedKeys() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<ReviewedItem[]>(
      "/users/{userId}/reviews",
      { userId },
      { method: "GET" }
    )
  },
}
