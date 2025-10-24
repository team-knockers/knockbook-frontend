import { UserService } from "../../features/account/services/UserService";
import type { UserProfile } from "../../features/account/types";
import { BookHistoryService } from "../../features/account/services/BookHistoryService";
import type { BookPurchaseHistory, BookRentalHistory, BookReviewHistory } from "../../features/feeds/types";

export type InsightStatLoaderData = {
  categoryRatioStat: Awaited<ReturnType<typeof BookHistoryService.getCategoryPreferenceAll>>;
  readCountStat: Awaited<ReturnType<typeof BookHistoryService.getReadCountInPeriod>>;
}

export type InsightHistoryLoaderData = {
  purchases: BookPurchaseHistory[];
  rentals: BookRentalHistory[];
  reviews: BookReviewHistory[];
}

export type InsightLoaderData = {
  profile: UserProfile;
  stat: InsightStatLoaderData;
  history: InsightHistoryLoaderData;
};

export async function InsightPageLoader(): Promise<InsightLoaderData> {
  const profile = await UserService.getMyProfile();

  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const startDate = sixMonthsAgo.toISOString().slice(0, 10);
  const endDate = now.toISOString().slice(0, 10);

  const [categoryRatioStat, readCountStat] = await Promise.all([
    BookHistoryService.getCategoryPreferenceAll(),
    BookHistoryService.getReadCountInPeriod(startDate, endDate),
  ]);

  const stat = {
    categoryRatioStat, readCountStat
  } satisfies InsightStatLoaderData;

  const [purchases, rentals, reviews ] = await Promise.all([
    BookHistoryService.listBookPurchases(),
    BookHistoryService.listBookRentals(),
    BookHistoryService.listBookReviews()
  ]);

  const history = {
    purchases, rentals, reviews
  } satisfies InsightHistoryLoaderData;

  return { profile, stat, history } satisfies InsightLoaderData;
}
