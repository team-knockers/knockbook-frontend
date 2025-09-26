import { apiAuthPathAndQuery } from "../../../shared/api";
import type { BooksApiResponse, BookSummary, BookDetails } from "../types";

const basePath = (currentUserId: string) => `/books/${currentUserId}`;

export default class BooksService {
  static async getHomeBestSellers(currentUserId: string): Promise<BookDetails[]> {
    const res = await apiAuthPathAndQuery<BooksApiResponse>(
      basePath(currentUserId),
      {},
      { category: "all", subcategory: "all", page: 1, size: 3, sortBy: "sales", order: "desc" }
    );
    const details = await Promise.all(
      res.books.map(b => apiAuthPathAndQuery<BookDetails>(`${basePath(currentUserId)}/${b.id}`))
    );
    return details;
  }

  static async getHomeNewBooksByCategory(currentUserId: string, categoryKey: string): Promise<BookSummary[]> {
    const res = await apiAuthPathAndQuery<BooksApiResponse>(
      basePath(currentUserId),
      {},
      { category: categoryKey, subcategory: "all", page: 1, size: 7, sortBy: "published", order: "desc" }
    );
    return res.books;
  }
}
