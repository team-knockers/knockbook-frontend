import { apiAuthPath, apiAuthPathAndQuery } from "../../../shared/api";
import { useSession } from "../../../hooks/useSession";
import type { BooksApiResponse, BookSummary, BookDetails } from "../types";

export const BooksService = {
  
  async getBooksWithDetails(
    category: string,
    subcategory: string,
    page: number = 1,
    size: number = 3,
    sortBy: string = "sales",
    order: string = "desc"
  ): Promise<BookDetails[]> {
    const summaries = await this.getBooksSummary(category, subcategory, page, size, sortBy, order);
    if (!summaries || summaries.length === 0) return [];

    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const BooksWithDetails: BookDetails[] = await Promise.all(
      summaries.map((b) =>
        apiAuthPath<BookDetails>(
          "/books/{userId}/{bookId}",
          { userId: userId, bookId: b.id },
          { method: "GET" }
        )
      )
    );

    return BooksWithDetails satisfies BookDetails[];
  },

  async getBooksSummary(
    category: string,
    subcategory: string,
    page: number,
    size: number,
    sortBy: string = "published",
    order: string = "desc"
  ): Promise<BookSummary[]> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!category) { throw new Error("NO_CATEGORY"); }

    const res = await apiAuthPathAndQuery<BooksApiResponse>(
      "/books/{userId}",
      { userId: userId },
      { category, subcategory, page, size, sortBy, order },
      { method: "GET" }
    );

    return res.books satisfies BookSummary[];
  }
};
