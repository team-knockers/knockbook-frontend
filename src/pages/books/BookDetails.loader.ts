import type { BookDetails, BookReviewsStatistics } from '../../features/books/types';
import { BookService } from '../../features/books/services/BookService';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { UserService } from '../../features/account/services/UserService';

export type BookDetailsLoaderData = {
  bookDetails: BookDetails;
  statistics: BookReviewsStatistics;
  myMbti: string | null;
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
  const myProfile = await UserService.getMyProfile();
  const myMbti: string | null = myProfile.mbti;

  if (!bookId) {
    throw new Error('Missing bookId');
  }

  const [bookDetails, stats] = await Promise.all([
    BookService.getBookDetails(bookId),
    BookService.getBookReviewStatistics(bookId)
  ]);

  const statistics = normalizeScoreCounts(stats)

  return { bookDetails, statistics, myMbti };
}
