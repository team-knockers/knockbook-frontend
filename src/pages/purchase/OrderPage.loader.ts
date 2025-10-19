import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { UserService } from "../../features/account/services/UserService";
import type { Address, UpdateAddressRequest } from "../../features/account/types";
import { OrderService } from "../../features/purchase/services/OrderService";
import type { CouponIssuance, OrderAggregation, OrderItem } from "../../features/purchase/type";

export type OrderPageLoaderData = {
  orderId: string;
  address: Address | null;
  numPurchaseItems: number;
  purchaseList: OrderItem[];
  numRentalItems: number;
  rentalList: OrderItem[];
  coupons: CouponIssuance[];
  points: number;
  aggregation: OrderAggregation;
}

export async function OrderPageLoader({ params }: LoaderFunctionArgs) {
  const orderId = params.orderId;
  if (!orderId) {
    throw new Response("Missing orderId", { status: 400 });
  } 
  
  const coupons = await OrderService.getCoupons();
  const points = (await OrderService.getPoints()).balance;
  const order = await OrderService.getOrder(String(orderId));
  const address = await UserService.getAddress(order.shippingAddressId);
  
  const purchaseList = order.items.filter(i => i.refType !== "BOOK_RENTAL");
  const rentalList = order.items.filter(i => i.refType === "BOOK_RENTAL");
  const numPurchaseItems = purchaseList.length;
  const numRentalItems = rentalList.length;
  
  const subtotalAmount = order.subtotalAmount;
  const discountAmount = order.discountAmount;
  const couponDiscountAmount = order.couponDiscountAmount;
  const shippingAmount = order.shippingAmount;
  const rentalAmount = order.rentalAmount;
  const totalAmount = order.totalAmount;
  const pointsSpent = order.pointsSpent;
  const pointsEarned = order.pointsEarned;

  const aggregation = {
    subtotalAmount, discountAmount, couponDiscountAmount,
    shippingAmount, rentalAmount, totalAmount,
    pointsSpent, pointsEarned
  } as OrderAggregation;

  return { 
    orderId,
    address, // could be null
    numPurchaseItems, purchaseList, 
    numRentalItems, rentalList,
    coupons, points,
    aggregation
  } as OrderPageLoaderData;
}

export async function OrderAction({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "update-address") {
    const addressId = form.get("addressId");
    if (!addressId) {
      return new Response("Missing addressId", { status: 400 });
    }
    const req : UpdateAddressRequest = {
      recipientName: String(form.get("recipientName")),
      phone: String(form.get("phone")),
      postalCode: String(form.get("postalCode")),
      address1: String(form.get("address1")),
      address2: String(form.get("address2")),
      label: String(form.get("label")),
      isDefault: String(form.get("isDefault")).trim().toLowerCase() === "true",
    }
    
    await UserService.updateAddress(String(addressId), req);
    return new Response(null, { status: 204 });
  }

  if (intent === "update-address-entry-info") {
    const addressId = form.get("addressId");
    if (!addressId) {
      return new Response("Missing addressId", { status: 400 });
    }
    const req : UpdateAddressRequest = {
      entryInfo: String(form.get("entryInfo"))
    }
    console.log(req);
    await UserService.updateAddress(String(addressId), req);
    return new Response(null, { status: 204 });
  }

  if (intent === "apply-coupon") {
    const couponIssuanceId = form.get("couponIssuanceId")?.toString();
    if (!couponIssuanceId) {
      return new Response("Missing couponIssuanceId", { status: 400 });
    }

    const orderId = form.get("orderId")?.toString();
    if (!orderId) {
      return new Response("Missing orderId", { status: 400 });
    }

    await OrderService.applyCoupon(orderId, couponIssuanceId);
    return new Response(null, { status: 204 });
  }

  if (intent === "remove-coupon") {
    const orderId = form.get("orderId")?.toString();
    if (!orderId) {
      return new Response("Missing orderId", { status: 400 });
    }

    const res = await OrderService.removeCoupon(orderId);
    console.log(res);
    return new Response(null, { status: 204 });
  }

  if (intent === "apply-points") {
    const orderId = form.get("orderId")?.toString();
    const points = Number(form.get("points") ?? 0);
    if (!orderId) return new Response("Missing orderId", { status: 400 });
    await OrderService.applyPoints(orderId, points);
    return new Response(null, { status: 204 });
  }

  if (intent === "remove-points") {
    const orderId = form.get("orderId")?.toString();
    if (!orderId) return new Response("Missing orderId", { status: 400 });
    await OrderService.removePoints(orderId);
    return new Response(null, { status: 204 });
  }

  if (intent === "apply-address") {
    const orderId = form.get("orderId")?.toString();
    const addressId = form.get("addressId")?.toString();
    if (!orderId) {
      return new Response("Missing orderId", { status: 400 });
    }
    if (!addressId) {
      return new Response("Missing addressId", { status: 400 });
    }
    await OrderService.setAddress(orderId, addressId);
    return new Response(null, { status: 204 });
  }
}
