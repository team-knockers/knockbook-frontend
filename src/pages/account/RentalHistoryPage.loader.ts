import type { LoaderFunctionArgs } from "react-router-dom";
import { OrderService } from "../../features/purchase/services/OrderService";
import type { Order } from "../../features/purchase/type";

export type RentalHistoryLoaderData = {
  rentals: Order[];
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
    ? groupParam.split(",")
    .map(s => s.trim())
    .filter((g): g is GroupKey => g in GROUPS)
    : [];

  const allOrders = (await OrderService.getPaidOrders()) as OrderWithRental[];
  const rentalsOnly = allOrders
    .filter(o => o.items.some(i => i.refType === "BOOK_RENTAL"))
    .map(o => ({
      ...o,
      items: o.items.filter(i => i.refType === "BOOK_RENTAL"),
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
    ? rentalsOnly.filter(o => o.rentalStatus && statusesToFilter.has(o.rentalStatus))
    : rentalsOnly;

  return {
    rentals: filtered,
    countByStatus: countByStatus(rentalsOnly),
    formatStatus,
  } satisfies RentalHistoryLoaderData;
}
