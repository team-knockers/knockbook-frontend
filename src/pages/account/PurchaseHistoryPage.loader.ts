import type { LoaderFunctionArgs } from "react-router-dom";
import { OrderService } from "../../features/purchase/services/OrderService";
import type { Order } from "../../features/purchase/type";

export type PurchaseHistoryLoaderData = {
  purchases: Order[];
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

  const statuses = ['PENDING','FULFILLING','COMPLETED','CANCELLED'] as const;
   const formatStatus = (status: string) => {
    switch (status) {
      case "PENDING": return "준비중";
      case "FULFILLING": return "배송중";
      case "COMPLETED": return "배송완료";
      case "CANCELLED": return "취소";
      default: return "확인 필요";
    }
  };

  const countByStatus = (xs: Order[]) =>
    statuses.reduce((m, s) => (m[s] = xs.filter(o => o.status === s).length, m),
    {} as Record<string, number>);

  const filtered = status ? purchaseOnly.filter(o => o.status === status) : purchaseOnly;

  return {
    purchases: filtered,
    countByStatus: countByStatus(purchaseOnly),
    formatStatus,
  } satisfies PurchaseHistoryLoaderData;
}

