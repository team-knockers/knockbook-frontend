import { apiAuthPathAndQuery } from "../../../shared/api";
import type { BooksApiResponse, BookSummary, BookDetails } from "../types";

const basePath = (currentUserId: string) => `/books/${currentUserId}`;

export default class BooksService {
  static async getHomeBestSellers(currentUserId: string, size = 3): Promise<BookDetails[]> {
    const res = await apiAuthPathAndQuery<BooksApiResponse>(
      basePath(currentUserId),
      {},
      { category: "all", subcategory: "all", page: 1, size, sortBy: "sales", order: "desc" }
    );
    const details = await Promise.all(
      res.books.map(b => apiAuthPathAndQuery<BookDetails>(`${basePath(currentUserId)}/${b.id}`))
    );
    return details;
  }

  static async getHomeNewBooksByCategory(currentUserId: string, categoryKey: string, size = 7): Promise<BookSummary[]> {
    const res = await apiAuthPathAndQuery<BooksApiResponse>(
      basePath(currentUserId),
      {},
      { category: categoryKey, subcategory: "all", page: 1, size, sortBy: "published", order: "desc" }
    );
    return res.books;
  }
}
