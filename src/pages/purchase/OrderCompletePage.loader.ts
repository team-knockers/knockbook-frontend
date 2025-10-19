// src/pages/purchase/OrderCompletePage.loader.ts
import type { LoaderFunctionArgs } from "react-router-dom";
import { OrderService } from "../../features/purchase/services/OrderService";
import type { OrderAggregation, OrderItem } from "../../features/purchase/type";
import type { Address } from "../../features/account/types";
import { UserService } from "../../features/account/services/UserService";

export type OrderCompletePageLoaderData = {
  orderId: string;
  orderNo: string;
  address: Address;
  paidAt: string;
  purchaseList: OrderItem[];
  rentalList: OrderItem[];
  aggregation: OrderAggregation;
};

export async function OrderCompletePageLoader({ params }: LoaderFunctionArgs) {
  const orderId = params.orderId;
  if (!orderId) {
    throw new Response("Missing orderId", { status: 400 });
  }

  const order = await OrderService.getOrder(String(orderId));
  const address = await UserService.getAddress(order.shippingAddressId);

  const purchaseList = order.items.filter((i: OrderItem) => i.refType !== "BOOK_RENTAL");
  const rentalList   = order.items.filter((i: OrderItem) => i.refType === "BOOK_RENTAL");

  const aggregation: OrderAggregation = {
    subtotalAmount: order.subtotalAmount,
    discountAmount: order.discountAmount,
    couponDiscountAmount: order.couponDiscountAmount,
    shippingAmount: order.shippingAmount,
    rentalAmount: order.rentalAmount,
    totalAmount: order.totalAmount,
    pointsSpent: order.pointsSpent,
    pointsEarned: order.pointsEarned,
  };

  return {
    orderId,
    orderNo: order.orderNo,
    address,
    paidAt: order.paidAt,
    purchaseList,
    rentalList,
    aggregation,
  } as OrderCompletePageLoaderData;
}
