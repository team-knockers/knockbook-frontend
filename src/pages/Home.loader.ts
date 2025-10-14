import type { LoaderFunctionArgs } from "react-router-dom";
import type { BookSummary } from "../features/books/types";
import { BookService } from "../features/books/services/BookService";

export type HomeLoaderData = {
  mbtiRecommendations: BookSummary[],
  preferenceRecommendations: BookSummary[]
};

export async function homeLoader(_args: LoaderFunctionArgs): Promise<HomeLoaderData> {
  
  // 토큰을 통해 사용자 정보 가져올 것?
  // const token = localStorage.getItem('accessToken') ?? '';
  // const opts = { headers: { Authorization: token ? `Bearer ${token}` : '' } };
  // console.log(opts);

  const [mbtiRecommendations, preferenceRecommendations] = await Promise.all([
    BookService.getBookSummaries('fiction', 'koreanFiction', 1, 7, 'published', 'desc'),
    BookService.getBookSummaries('cooking', 'all', 1, 7, 'published', 'desc')
  ]);

  return { mbtiRecommendations, preferenceRecommendations };
}
