import type { LoaderFunctionArgs } from "react-router-dom";
import type { BookDetails, BookSummary } from "../../features/books/types";
import { BooksService } from "../../features/books/services/BookService";

export type BooksHomeLoaderData = {
  top3BestSellers: BookDetails[];
  booksByCategory: Record<string, BookSummary[]>;
};

// Categories shown in the book's new releases
export const booksHomeNewReleaseCategories = [
  { key: "fiction", label: "소설" },
  { key: "humanities", label: "인문" },
  { key: "selfImprovement", label: "자기계발" },
  { key: "health", label: "건강" },
];

export async function booksHomeLoader(_args: LoaderFunctionArgs): Promise<BooksHomeLoaderData> {

  try {
    const top3BestSellers = await BooksService.getDetailedBooks('all', 'all', 1, 3, 'sales', 'desc');

    const categoryResults = await Promise.all(
      booksHomeNewReleaseCategories.map(async (cat) => {
        const books = await BooksService.getBookSummaries(cat.key, "all", 1, 7, "published", "desc");
        return { key: cat.key, books };
      })
    );

    const booksByCategory: Record<string, BookSummary[]> = {};
    categoryResults.forEach(r => { booksByCategory[r.key] = r.books; });

    return { top3BestSellers, booksByCategory };
  } catch (error) {
    console.error("booksHomeLoader error", error);
    throw new Error("booksHomeLoader: failed to fetch books");
  }
}
