import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import type { Order } from "../../../features/purchase/type";
import { OrderService } from "../../../features/purchase/services/OrderService";
import { ReviewService } from "../../../features/account/services/ReviewService";

export type RentalHistoryLoaderData = {
  rentals: Array<Order & {
    items: Array<Order["items"][number] & { reviewedByMe: boolean }>
  }>;
  countByStatus: Record<string, number>;
  formatStatus: (status: string) => string;
};

type RentalStatus =
  | "PREPARING" | "SHIPPING"
  | "DELIVERED" | "RETURN_REQUESTED"
  | "RETURNING" | "RETURNED"
  | "CANCELLED";

type OrderWithRental = Order & { rentalStatus?: RentalStatus };

const GROUPS = {
  PREPARING: ["PREPARING", "SHIPPING"],
  DELIVERED: ["DELIVERED", "RETURN_REQUESTED"],
  RETURNED:  ["RETURNING", "RETURNED"],
  CANCELLED: ["CANCELLED"],
} as const;

type GroupKey = keyof typeof GROUPS;

export async function RentalHistoryPageLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const groupParam = url.searchParams.get("group");
  const groups: GroupKey[] = groupParam
    ? groupParam.split(",").map(s => s.trim()).filter((g): g is GroupKey => g in GROUPS)
    : [];

  const allOrders = (await OrderService.getPaidOrders()) as OrderWithRental[];

  // 대여만 추출
  const rentalsOnly = allOrders
    .filter(o => o.items.some(i => i.refType === "BOOK_RENTAL"))
    .map(o => ({ ...o, items: o.items.filter(i => i.refType === "BOOK_RENTAL") }));

  // 내가 리뷰한 항목 키셋 (BOOK/PRODUCT 혼합 응답)
  const reviewedItems = await ReviewService.getMyBookReviewedKeys();
  const toKey = (type: string, id: string | number) => `${String(type).toUpperCase()}:${String(id)}`;
  const reviewedSet = new Set<string>(reviewedItems.map(({ itemType, id }) => toKey(itemType, id)));

  // 각 아이템에 reviewedByMe 주입
  const withReviewed = rentalsOnly.map(o => ({
    ...o,
    items: o.items.map(i => ({
      ...i,
      reviewedByMe: reviewedSet.has(toKey("BOOK", i.refId)),
    })),
  }));

  const formatStatus = (s: string) => {
    switch (s) {
      case "PREPARING": return "준비중";
      case "SHIPPING": return "배송중";
      case "DELIVERED": return "대여중";
      case "RETURN_REQUESTED": return "회수신청완료";
      case "RETURNING": return "회수중";
      case "RETURNED": return "대여완료";
      case "CANCELLED": return "취소";
      default: return "확인 필요";
    }
  };

  const countByStatus = (orders: OrderWithRental[]) =>
    (Object.keys(GROUPS) as GroupKey[]).reduce((acc, key) => {
      const set = new Set<RentalStatus>(GROUPS[key]);
      acc[key] = orders.filter(o => o.rentalStatus && set.has(o.rentalStatus)).length;
      return acc;
    }, {} as Record<GroupKey, number>);

  const statusesToFilter = groups.length > 0
    ? new Set<RentalStatus>(groups.flatMap(g => GROUPS[g]))
    : null;

  const filtered = statusesToFilter
    ? withReviewed.filter(o => o.rentalStatus && statusesToFilter.has(o.rentalStatus))
    : withReviewed;

  return {
    rentals: filtered,
    countByStatus: countByStatus(withReviewed as unknown as OrderWithRental[]),
    formatStatus,
  } satisfies RentalHistoryLoaderData;
}

// (선택) 리뷰 액션: 렌탈에서 작성하는 리뷰도 동일 엔드포인트 사용
export async function RentalHistoryPageAction({ request }: ActionFunctionArgs) {
  const r = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

  const form = await request.formData();
  const intent = form.get("_intent");

  if (intent === "createBookReview") {
    const bookId = String(form.get("bookId") || "");
    const transactionType = "RENTAL";
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
