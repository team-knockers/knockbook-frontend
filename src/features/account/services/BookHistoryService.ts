import { useSession } from "../../../hooks/useSession";
import { apiAuthPath, apiAuthPathAndQuery } from "../../../shared/api";
import type { 
  BookPreferCategoryStat, BookPurchaseHistory,
  BookReadCountStat, BookRentalHistory, 
  BookReviewHistory} from "../../feeds/types";

export const BookHistoryService = {

  // from: YYYY-MM-DD ISO string (ex: 2025-05-01)
  // to: YYYY-MM-DD ISO string (ex: 2025-10-30)
  async getReadCountInPeriod(from: string, to: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathAndQuery<BookReadCountStat[]>(
      "/users/{userId}/history/books/stat/average",
      { userId },
      { from, to },
      { method: "GET" }
    );
  },

  async getCategoryPreferenceAll() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<BookPreferCategoryStat[]>(
      "/users/{userId}/history/books/stat/category-preference",
      { userId },
      { method: "GET" }
    );
  },

  async listBookPurchases() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<BookPurchaseHistory[]>(
      "/users/{userId}/history/books/purchases",
      { userId },
      { method: "GET" }
    );
  },

  async listBookRentals() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<BookRentalHistory[]>(
      "/users/{userId}/history/books/rentals",
      { userId },
      { method: "GET" }
    );
  },

  async listBookReviews() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<BookReviewHistory[]>(
      "/users/{userId}/history/books/reviews",
      { userId },
      { method: "GET" }
    );
  }
}
