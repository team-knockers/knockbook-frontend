import { apiAuthPath, apiAuthPathAndQuery, apiAuthPathWithJson } from "../../../shared/api";
import { ensureUserId } from "../../../shared/authReady";
import type { 
  ApplyCouponRequest, ApplyPointsRequest, CreateOrderDirectRequest,
  CreateOrderFromCartRequest, Order } from "../type";

export const OrderService = {

  async createDraftFromCart(cartItemIds: string[]) {
    const userId = await ensureUserId();
    const req = { cartItemIds } as CreateOrderFromCartRequest;
    return await apiAuthPathWithJson<Order, CreateOrderFromCartRequest>(
      "/orders/{userId}/draft-from-cart",
      { userId },
      { method: "POST", json: req }
    );
  },

  async createOrderDirect(refType: string, refId: string, quantity: number) {
    const userId = await ensureUserId();
    const req = { refType, refId, quantity } as CreateOrderDirectRequest;
    return apiAuthPathWithJson<Order, CreateOrderDirectRequest>(
      "/orders/{userId}/draft",
      { userId },
      { method: "POST", json: req }
    );
  },

  async getOrder(orderId: string) {
    const userId = await ensureUserId();
    return await apiAuthPath<Order>(
      "/orders/{userId}/{orderId}",
      { userId, orderId },
      { method: "GET" }
    );
  },

  async getPaidOrders() {
    const userId = await ensureUserId();
    return await apiAuthPathAndQuery<Order[]>(
      "/orders/{userId}",
      { userId },
      { paymentStatus: "PAID" },
      { method: "GET" }
    );
  },

  async getOrders() {
    return await apiAuthPath<Order[]>(
      "/orders",
      { method: "GET" }
    );
  },

  async applyCoupon(orderId: string, couponIssuanceId: string) {
    const userId = await ensureUserId();
    const body = { couponIssuanceId } as ApplyCouponRequest;
    const res = await apiAuthPathWithJson<Order, ApplyCouponRequest>(
      "/orders/{userId}/{orderId}/coupon",
      { userId, orderId },
      { method: "POST", json: body }
    );
    console.log(res);
    return res;
  },

  async removeCoupon(orderId: string) {
    const userId = await ensureUserId();
    return await apiAuthPath<Order>(
      "/orders/{userId}/{orderId}/coupon",
      { userId, orderId },
      { method: "DELETE" }
    );
  },

  async applyPoints(orderId: string, points: number) {
    const userId = await ensureUserId();
    const body = { points } as ApplyPointsRequest;
    const res = await apiAuthPathWithJson<Order, ApplyPointsRequest>(
      "/orders/{userId}/{orderId}/points",
      { userId, orderId },
      { method: "POST", json: body }
    );
    console.log(res);
    return res;
  },

  async removePoints(orderId: string) {
    const userId = await ensureUserId();
    return await apiAuthPath<Order>(
      "/orders/{userId}/{orderId}/points",
      { userId, orderId },
      { method: "DELETE" }
    );
  },

  async setAddress(orderId: string, addressId: string) {
    const userId = await ensureUserId();
    const body = { addressId } as { addressId: string };
    return await apiAuthPathWithJson<Order, { addressId: string }>(
      "/orders/{userId}/{orderId}/address",
      { userId, orderId },
      { method: "POST", json: body }
    );
  },

  async updateStatus(
    userId: string,
    orderId: string,
    status: string,
    rentalStatus: string) {
    return await apiAuthPathAndQuery<Order>(
      "/orders/{userId}/{orderId}/status",
      { userId, orderId },
      { status, rentalStatus },
      { method: "PATCH" }
    );
  },
}

