import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { OrderService } from "../../../features/purchase/services/OrderService";
import type { Order } from "../../../features/purchase/type";
import { ReviewService } from "../../../features/account/services/ReviewService";

export type PurchaseHistoryLoaderData = {
  purchases: Array<Order & {
    items: Array<Order["items"][number] & { reviewedByMe: boolean }>
  }>;
  countByStatus: Record<string, number>;
  formatStatus: (status: string) => string;
};

export async function PurchaseHistoryPageLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const all = await OrderService.getPaidOrders();

  const purchaseOnly = all
    .filter(o => o.items.some(i => i.refType !== "BOOK_RENTAL"))
    .map(o => ({ ...o, items: o.items.filter(i => i.refType !== "BOOK_RENTAL") }));

  const reviewedItems = await ReviewService.getMyBookReviewedKeys();

  const toKey = (type: string, id: string | number) =>
    `${String(type).toUpperCase()}:${String(id)}`;

  const reviewedSet = new Set<string>(
    reviewedItems.map(({ itemType, id }) => toKey(itemType, id))
  );

  const withReviewed = purchaseOnly.map(o => ({
    ...o,
    items: o.items.map(i => ({
      ...i,
      reviewedByMe: reviewedSet.has(toKey("BOOK", i.refId)),
    })),
  }));

  const statuses = ['PENDING','FULFILLING','COMPLETED','CANCELLED'] as const;
  const formatStatus = (s: string) =>
    s === "PENDING" ? "준비중" :
    s === "FULFILLING" ? "배송중" :
    s === "COMPLETED" ? "배송완료" :
    s === "CANCELLED" ? "취소" : "확인 필요";

  const countByStatus = (xs: typeof withReviewed) =>
    statuses.reduce((m, s) => (m[s] = xs.filter(o => o.status === s).length, m), {} as Record<string, number>);

  const filtered = status ? withReviewed.filter(o => o.status === status) : withReviewed;

  return {
    purchases: filtered,
    countByStatus: countByStatus(withReviewed),
    formatStatus,
  } satisfies PurchaseHistoryLoaderData;
}

export async function PurchaseHistoryPageAction({ request }: ActionFunctionArgs) {
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
