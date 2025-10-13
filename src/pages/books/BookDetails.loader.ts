import type { BookDetails, BookReviewsStatistics } from '../../features/books/types';
import { BookService } from '../../features/books/services/BookService';
import type { LoaderFunctionArgs } from 'react-router-dom';

export type BookDetailsLoaderData = {
  bookDetails: BookDetails;
  statistics: BookReviewsStatistics;
};

function normalizeScoreCounts(stats: BookReviewsStatistics): BookReviewsStatistics {
  return {
    ...stats,
    scoreCounts: stats.scoreCounts.map(s => ({
      ...s,
      score: String(s.score)
    }))
  };
}

export async function bookDetailsLoader({ params }: LoaderFunctionArgs): Promise<BookDetailsLoaderData> {
  const bookId = params.bookId;
  if (!bookId) {
    throw new Error('Missing bookId');
  }

  const [bookDetails, stats] = await Promise.all([
    BookService.getBookDetails(bookId),
    BookService.getBookReviewStatistics(bookId)
  ]);

  const statistics = normalizeScoreCounts(stats)

  return { bookDetails, statistics };
}
