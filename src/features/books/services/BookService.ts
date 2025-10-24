import { apiAuthMultipartPath, apiAuthPath, apiAuthPathAndQuery } from "../../../shared/api";
import { useSession } from "../../../hooks/useSession";
import type { BooksApiResponse, BookSummary, BookDetails, BookCategory, BookSubcategory, BookReviewsApiResponse, BookReviewsStatistics, BookWishlistActionResponse, BookWishStatusResponse, BookReviewCreateRequest, BookReview, GetRandomBookReviewResponse } from "../types";

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

  // API-BOOKS-03 : Fetch paginated book reviews data
  async getBookReviews(
    bookId: string,
    page: number,
    size: number,
    transactionType?: string,
    sortBy?: string,
    order?: string,
    sameMbti?: boolean
  ): Promise<BookReviewsApiResponse> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!bookId) { throw new Error("NO_BOOK_ID"); }
    if (page == null) { throw new Error("NO_PAGE"); }
    if (size == null) { throw new Error("NO_SIZE"); }

    return apiAuthPathAndQuery<BookReviewsApiResponse>(
      "/books/{userId}/{bookId}/reviews",
      { userId, bookId },
      { page, size, transactionType, sortBy, order, sameMbti },
      { method: "GET" }
    );
  },

  // API-BOOKS-04 : Fetch book review statistics
  async getBookReviewStatistics(
    bookId: string,
  ): Promise<BookReviewsStatistics> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!bookId) { throw new Error("NO_BOOK_ID"); }

    return apiAuthPathAndQuery<BookReviewsStatistics>(
      "/books/{userId}/{bookId}/reviews/statistics",
      { userId, bookId },
      { method: "GET" }
    );
  },

  // API-BOOKS-05 : Toggle like (PUT) for a review
  async likeReview(
    bookId: string,
    reviewId: string
  ): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!bookId) { throw new Error("NO_BOOK_ID"); }
    if (!reviewId) { throw new Error("NO_REVIEW_ID"); }

    await apiAuthPath<void>(
      "/books/{userId}/{bookId}/reviews/{reviewId}/likes",
      { userId, bookId, reviewId },
      { method: "PUT" }
    );
  },

  // API-BOOKS-06 : Unlike (DELETE) for a review
  async unlikeReview(
    bookId: string,
    reviewId: string
  ): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!bookId) { throw new Error("NO_BOOK_ID"); }
    if (!reviewId) { throw new Error("NO_REVIEW_ID"); }

    await apiAuthPath<void>(
      "/books/{userId}/{bookId}/reviews/{reviewId}/likes",
      { userId, bookId, reviewId },
      { method: "DELETE" }
    );
  },

  // API-BOOKS-07 : Add a specific book to the user's wishlist
  async addToWishlist(
    bookId: string
  ): Promise<BookWishlistActionResponse> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!bookId) { throw new Error("NO_BOOK_ID"); }

    return apiAuthPath<BookWishlistActionResponse>(
      "/books/{userId}/{bookId}/wish",
      { userId, bookId },
      { method: "PUT" }
    );
  },

  // API-BOOKS-08 : Remove a specific book from the user's wishlist
  async removeFromWishlist(
    bookId: string
  ): Promise<BookWishlistActionResponse> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!bookId) { throw new Error("NO_BOOK_ID"); }

    return apiAuthPath<BookWishlistActionResponse>(
      "/books/{userId}/{bookId}/wish",
      { userId, bookId },
      { method: "DELETE" }
    );
  },

  // API-BOOKS-09 : Check if a specific book is in the user's wishlist
  async hasBookInWishlist(
    bookId: string
  ): Promise<BookWishStatusResponse> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!bookId) { throw new Error("NO_BOOK_ID"); }

    return apiAuthPath<BookWishStatusResponse>(
      "/books/{userId}/{bookId}/wish",
      { userId, bookId },
      { method: "GET" }
    );
  },

  // API-BOOKS-10 : Retrieve all books in the user's wishlist
  async getUserWishlist(): Promise<BookSummary[]> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPath<BookSummary[]>(
      "/books/{userId}/wishlist",
      { userId },
      { method: "GET" }
    );
  },

  // API-BOOKS-11 : Fetch all book categories
  async getBooksAllCategories(
  ): Promise<BookCategory[]> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPath<BookCategory[]>(
      "/books/{userId}/categories",
      { userId },
      { method: "GET" }
    );
  },

  // API-BOOKS-12 : Fetch subcategories for a specific category
  async getBookSubcategories(
    categoryCodeName: string
  ): Promise<BookSubcategory[]> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!categoryCodeName) { throw new Error("NO_CATERGORY"); }

    return apiAuthPath<BookSubcategory[]>(
      "/books/{userId}/categories/{categoryCodeName}/subcategories",
      { userId, categoryCodeName },
      { method: "GET" }
    );
  },

  // API-BOOKS-13 : Create a review for a specific book with optional images
  async createBookReview(
    bookId: string,
    review: BookReviewCreateRequest,
    images?: File[]
  ): Promise<BookReview> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!bookId) { throw new Error("NO_BOOK_ID"); }
    if (!review) { throw new Error("NO_REVIEW_DATA"); }

    const form = new FormData();
    form.append("post", new Blob([JSON.stringify({ review })], { type: "application/json" }));

    images?.forEach((f: File) => form.append("images", f));

    return apiAuthMultipartPath<BookReview>(
      "/books/{userId}/{bookId}/reviews",
      { userId, bookId },
      form,
      { method: "POST" }
    );
  },

  // API-BOOKS-14 : Soft delete a specific review for the current user
  async deleteBookReview(
    reviewId: string
  ): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (!reviewId) { throw new Error("NO_REVIEW_ID"); }

    return apiAuthPath<void>(
      "/books/{userId}/reviews/{reviewId}",
      { userId, reviewId },
      { method: "DELETE" }
    );
  },

  // API-BOOKS-15 : Retrieve a random life book review (temporarily implemented using a random review)
  async getRandomBookReview(
    rating?: number
  ): Promise<GetRandomBookReviewResponse> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery<GetRandomBookReviewResponse>(
      "/books/{userId}/reviews/random",
      { userId },
      { rating },
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
