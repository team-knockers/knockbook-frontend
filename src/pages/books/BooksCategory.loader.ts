import type { LoaderFunctionArgs } from "react-router-dom";
import type { BookCategory, BookDetails, BookSummary } from "../../features/books/types";
import { BookService } from "../../features/books/services/BookService";

export type BooksCategoryLoaderData = {
  bookCategories: BookCategory[],
  top3BestSellers: BookDetails[];
  newBooksBySection: { key: string; label: string; books: BookSummary[] }[];
};

export async function booksCategoryLoader({ params }: LoaderFunctionArgs): Promise<BooksCategoryLoaderData> {

  const categoryCodeName = params.categoryCodeName ?? 'all';

  // always request top3 bestsellers
  const top3Promise = BookService.getDetailedBooks(categoryCodeName, 'all', 1, 3, 'sales', 'desc');

  // newBooks loading branch: if category is 'all' load by category, otherwise load by subcategory for the given category
  let newBooksPromise: Promise<BooksCategoryLoaderData['newBooksBySection']> = Promise.resolve([]);

  if (categoryCodeName === 'all') {
    newBooksPromise = (async () => {
      try {
        const categories = await BookService.getBooksAllCategories();
        const results = await Promise.all(categories.map(async (cat) => {
          try {
            const books = await BookService.getBookSummaries(cat.categoryCodeName, 'all', 1, 7, 'published', 'desc');
            return { key: cat.categoryCodeName, label: cat.categoryDisplayName, books };
          } catch {
            return { key: cat.categoryCodeName, label: cat.categoryDisplayName, books: [] };
          }
        }));
        return results;
      } catch {
        return [];
      }
    })();
  } else {
    newBooksPromise = (async () => {
      try {
        const subcats = await BookService.getBookSubcategories(categoryCodeName);
        const results = await Promise.all((subcats || []).map(async (sub) => {
          try {
            const books = await BookService.getBookSummaries(categoryCodeName, sub.subcategoryCodeName, 1, 7, 'published', 'desc');
            return { key: sub.subcategoryCodeName, label: sub.subcategoryDisplayName, books };
          } catch {
            return { key: sub.subcategoryCodeName, label: sub.subcategoryDisplayName, books: [] };
          }
        }));
        return results;
      } catch {
        return [];
      }
    })();
  }

  const [top3BestSellers, newBooksBySection, bookCategories] = await Promise.all([
    top3Promise.catch(() => []),
    newBooksPromise.catch(() => []),
    BookService.getBooksAllCategories().catch(() => []),
  ]);

  return { bookCategories, top3BestSellers, newBooksBySection };
}
