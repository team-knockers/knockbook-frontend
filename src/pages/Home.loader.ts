import type { LoaderFunctionArgs } from "react-router-dom";
import type { BookCategory, BookSummary, GetRandomBookReviewResponse } from "../features/books/types";
import { BookService } from "../features/books/services/BookService";
import { UserService } from "../features/account/services/UserService";

export type HomeLoaderData = {
  mbtiRecommendations: BookSummary[],
  preferenceRecommendations: BookSummary[][],
  myMbti: string | null,
  myFavoriteBookCategories: string[] | null,
  favoriteCategoryDisplayNames: string[], // 표시명 배열 추가
  randomFiveStarReview: GetRandomBookReviewResponse
};

export async function homeLoader(_args: LoaderFunctionArgs): Promise<HomeLoaderData> {

  const myProfile = await UserService.getMyProfile();
  const myMbti: string | null = myProfile.mbti;
  const myFavoriteBookCategories: string[] | null = myProfile.favoriteBookCategories;

  const mbtiRecommendations = await BookService.getBookSummaries('fiction', 'koreanFiction', 1, 7, 'published', 'desc');

  const allCategories: BookCategory[] = await BookService.getBooksAllCategories();
  const categoryMapping: Record<string, string> = {};
  allCategories.forEach(cat => {
    categoryMapping[cat.categoryCodeName] = cat.categoryDisplayName;
  });

  const categoriesArray = Array.isArray(myFavoriteBookCategories) && myFavoriteBookCategories.length > 0
    ? myFavoriteBookCategories
    : ['all'];

  const favoriteCategoryDisplayNames = categoriesArray.map(code => categoryMapping[code] ?? code);

  const preferencePromises = categoriesArray.map(category =>
    BookService.getBookSummaries(category, 'all', 1, 7, 'published', 'desc')
  );

  const preferenceRecommendations = await Promise.all(preferencePromises)

  const randomFiveStarReview = await BookService.getRandomBookReview('5');

  return { mbtiRecommendations, preferenceRecommendations, myMbti, myFavoriteBookCategories, favoriteCategoryDisplayNames, randomFiveStarReview };
}
