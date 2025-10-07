import type { LoaderFunctionArgs } from "react-router-dom";
import type { BookCategory } from "../../features/books/types";
import { BookService } from "../../features/books/services/BookService";

export type BooksCategoryLoaderData = {
  bookCategories: BookCategory[],
};

export async function booksCategoryLoader(_args: LoaderFunctionArgs): Promise<BooksCategoryLoaderData> {

  try {
    const bookCategories = await BookService.getBooksAllCategories();

    return { bookCategories };
  } catch (error) {
    console.error("booksCategoryLoader error", error);
    throw new Error("booksCategoryLoader: failed to fetch");
  }
}