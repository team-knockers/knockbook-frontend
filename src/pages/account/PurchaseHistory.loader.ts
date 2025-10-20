import type { LoaderFunctionArgs } from "react-router-dom";
import { OrderService } from "../../features/purchase/services/OrderService";
import type { Order } from "../../features/purchase/type";

export type PurchaseHistoryLoaderData = {
  purchaseOrders: Order[];
};

export async function PurchaseHistoryPageLoader({
  params
}: LoaderFunctionArgs) {

  const purchaseOrders = await OrderService.getPaidOrders();
  return { purchaseOrders } as PurchaseHistoryLoaderData;
}
