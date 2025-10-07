import type { LoaderFunctionArgs } from "react-router-dom";
import type { BookCategory } from "../../features/books/types";
import { BookService } from "../../features/books/services/BookService";

export type BooksSearchLoaderData = {
  bookCategories: BookCategory[],
};

export async function booksSearchLoader(_args: LoaderFunctionArgs): Promise<BooksSearchLoaderData> {

  try {
    const bookCategories = await BookService.getBooksAllCategories();

    return { bookCategories };
  } catch (error) {
    console.error("booksSearchLoader error", error);
    throw new Error("booksSearchLoader: failed to fetch");
  }
}
