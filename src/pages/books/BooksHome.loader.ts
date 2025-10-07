import type { LoaderFunctionArgs } from "react-router-dom";
import type { BookCategory, BookDetails, BookSummary } from "../../features/books/types";
import { BookService } from "../../features/books/services/BookService";

export type BooksHomeLoaderData = {
  bookCategories: BookCategory[],
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
    const bookCategories = await BookService.getBooksAllCategories();

    const top3BestSellers = await BookService.getDetailedBooks('all', 'all', 1, 3, 'sales', 'desc');

    const categoryResults = await Promise.all(
      booksHomeNewReleaseCategories.map(async (cat) => {
        const books = await BookService.getBookSummaries(cat.key, "all", 1, 7, "published", "desc");
        return { key: cat.key, books };
      })
    );

    const booksByCategory: Record<string, BookSummary[]> = {};
    categoryResults.forEach(r => { booksByCategory[r.key] = r.books; });

    return { bookCategories, top3BestSellers, booksByCategory };
  } catch (error) {
    console.error("booksHomeLoader error", error);
    throw new Error("booksHomeLoader: failed to fetch");
  }
}
