import type { LoaderFunctionArgs } from "react-router-dom";
import type { BookSummary } from "../features/books/types";
import { BookService } from "../features/books/services/BookService";
import { UserService } from "../features/account/services/UserService";
import { BookHistoryService } from "../features/feeds/services/BookHistoryService";

export type HomeLoaderData = {
  mbtiRecommendations: BookSummary[],
  preferenceRecommendations: BookSummary[][],
  myMbti: string | null,
  myFavoriteBookCategories: string[] | null
};

export async function homeLoader(_args: LoaderFunctionArgs): Promise<HomeLoaderData> {

  const myProfile = await UserService.getMyProfile();
  const myMbti: string | null = myProfile.mbti;
  const myFavoriteBookCategories: string[] | null = myProfile.favoriteBookCategories;

  const mbtiRecommendations = await BookService.getBookSummaries('fiction', 'koreanFiction', 1, 7, 'published', 'desc');

  const categoriesArray = Array.isArray(myFavoriteBookCategories) && myFavoriteBookCategories.length > 0
    ? myFavoriteBookCategories
    : ['all'];

  const preferencePromises = categoriesArray.map(category =>
    BookService.getBookSummaries(category, 'all', 1, 7, 'published', 'desc')
  );

  const preferenceRecommendations = await Promise.all(preferencePromises)

  return { mbtiRecommendations, preferenceRecommendations, myMbti, myFavoriteBookCategories };
}
