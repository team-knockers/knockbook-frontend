import { apiAuthPath, apiAuthPathAndQuery } from "../../../shared/api";
import { useSession } from "../../../hooks/useSession";
import type { BooksApiResponse, BookSummary, BookDetails } from "../types";

export const BooksService = {
  
  async getBooksWithDetails(
    category: string,
    subcategory: string,
    page: number,
    size: number,
    sortBy: string = "sales",
    order: string = "desc"
  ): Promise<BookDetails[]> {
    const summaries = await this.getBooksSummary(category, subcategory, page, size, sortBy, order);
    if (!summaries || summaries.length === 0) { return []; }

    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    // 1. Create a request list from summaries
    const reqs = summaries.map((b) => ({
      bookId: b.id,
      req: apiAuthPath<BookDetails>(
        "/books/{userId}/{bookId}",
        { userId, bookId: b.id },
        { method: "GET" }
      )
    }));

    // 2. Execute all requests in parallel
    const res = await Promise.all(reqs.map(r => r.req));

    // 3. Use responses directly as BookDetails[]
    const booksWithDetails: BookDetails[] = res;

    return booksWithDetails satisfies BookDetails[];
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
