import { useSession } from "../../../hooks/useSession";
import { apiAuthPath } from "../../../shared/api";
import type { BookReview, ReviewedItem } from "../types";

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
