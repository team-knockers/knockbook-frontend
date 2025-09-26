import type { LoaderFunctionArgs } from "react-router-dom";
import { useSession } from "../../hooks/useSession";
import type { BookDetails, BookSummary } from "../../features/books/types";
import BooksService from "../../features/books/services/BookService";

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
  const { userId } = useSession.getState();

  if (!userId) {
    return { top3BestSellers: [], booksByCategory: {} };
  }

  try {
    const top3Promise = BooksService.getHomeBestSellers(userId, 3);

    const categoryPromises = booksHomeNewReleaseCategories.map(async (cat) => {
      const books = await BooksService.getHomeNewBooksByCategory(userId, cat.key, 7);
      return { key: cat.key, books };
    });

    const categoryResults = await Promise.all(categoryPromises);
    const booksByCategory: Record<string, BookSummary[]> = {};
    categoryResults.forEach(r => { booksByCategory[r.key] = r.books; });

    const top3BestSellers = await top3Promise;

    return { top3BestSellers, booksByCategory };
  } catch (error) {
    console.error("booksHomeLoader error", error);
    return { top3BestSellers: [], booksByCategory: {} };
  }
}
