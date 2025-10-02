import type { BookDetails } from '../../features/books/types';
import { BookService } from '../../features/books/services/BookService';
import type { LoaderFunctionArgs } from 'react-router-dom';

export async function bookDetailsLoader({ params }: LoaderFunctionArgs): Promise<BookDetails> {
  const bookId = params.bookId;
  if (!bookId) {
    throw new Error('Missing bookId');
  }

  const res = await BookService.getBookDetails(bookId);

  return res as BookDetails;
}
