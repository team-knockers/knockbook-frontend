import { UserService } from "../../features/account/services/UserService";
import type { UserProfile } from "../../features/account/types";
import { BookHistoryService } from "../../features/account/services/BookHistoryService";
import type { BookPurchaseHistory, BookRentalHistory, BookReviewHistory } from "../../features/feeds/types";
import type { ActionFunctionArgs } from "react-router-dom";
import { ReviewService } from "../../features/account/services/ReviewService";

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

export async function InsightPageAction({ request }: ActionFunctionArgs) {
  const r = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

  const form = await request.formData();
  const intent = form.get("_intent");

  if (intent === "createBookReview") {
    const bookId = String(form.get("bookId") || "");
    const transactionType = String(form.get("transactionType") || "PURCHASE");
    const rating = Number(form.get("rating") || 0);
    const content = String(form.get("content") || "");
    if (!bookId || !content || rating <= 0) return r({ ok: false, error: "INVALID_INPUT" }, 400);

    try {
      await ReviewService.createBookReview(transactionType, bookId, rating, content);
      return r({ ok: true });
    } catch (e) {
      console.error(e);
      return r({ ok: false, error: "SERVER_ERROR" }, 500);
    }
  }

  return r({ ok: false, error: "UNKNOWN_INTENT" }, 400);
}

