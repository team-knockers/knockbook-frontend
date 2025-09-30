import { apiAuthPath, apiAuthPathAndQuery } from "../../../shared/api";
import { useSession } from "../../../hooks/useSession";
import type { BooksApiResponse, BookSummary, BookDetails } from "../types";

export const BookService = {

  // API-BOOKS-01 : Fetch paginated book summaries
  async getPaginatedBookSummaries(
    category: string,
    subcategory: string,
    page: number,
    size: number,
    sortBy?: string,
    order?: string,
    searchBy?: string,
    searchKeyword?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<BooksApiResponse> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!category) { throw new Error("NO_CATEGORY"); }
    if (!subcategory) { throw new Error("NO_SUBCATEGORY"); }
    if (page == null) { throw new Error("NO_PAGE"); }
    if (size == null) { throw new Error("NO_SIZE"); }

    return apiAuthPathAndQuery<BooksApiResponse>(
      "/books/{userId}",
      { userId: userId },
      { category, subcategory, page, size, sortBy, order, 
        searchBy, searchKeyword, minPrice, maxPrice },
      { method: "GET" }
    );
  },

  // API-BOOKS-02 : Fetch detailed information for a single book
  async getBookDetails(
    bookId: string
  ): Promise<BookDetails> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPath<BookDetails>(
      "/books/{userId}/{bookId}",
      { userId, bookId },
      { method: "GET" }
    );
  },

  // Fetch detailed info for multiple books [Using API-BOOKS-01,02]
  async getDetailedBooks(
    category: string,
    subcategory: string,
    page: number,
    size: number,
    sortBy: string = "sales",
    order: string = "desc"
  ): Promise<BookDetails[]> {
    const summariesPage = await this.getPaginatedBookSummaries(category, subcategory, page, size, sortBy, order);
    
    const bookSummaries = summariesPage.books;
    if (!Array.isArray(bookSummaries)) { return []; }

    const detailedBooks = await Promise.all(
      bookSummaries.map((bookSummary) => this.getBookDetails(bookSummary.id))
    );

    return detailedBooks satisfies BookDetails[];
  },

  // Fetch book summaries (items only, no pagination metadata) [Using API-BOOKS-01]
  async getBookSummaries(
    category: string,
    subcategory: string,
    page: number,
    size: number,
    sortBy: string = "published",
    order: string = "desc"
  ): Promise<BookSummary[]> {

    const summariesPage = await this.getPaginatedBookSummaries(category, subcategory, page, size, sortBy, order);
    const bookSummaries = summariesPage.books;

    return bookSummaries satisfies BookSummary[];
  }
};
