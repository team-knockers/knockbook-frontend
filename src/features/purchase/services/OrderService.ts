import { useSession } from "../../../hooks/useSession";
import { apiAuthPath, apiAuthPathAndQuery, apiAuthPathWithJson } from "../../../shared/api";
import type { ApplyCouponRequest, ApplyPointsRequest, CouponIssuance, createOrderFromCartRequest, GetPointBalanceResponse, Order } from "../type";

export const OrderService = {

  async createDraftFromCart(cartItemIds: string[]) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    const req = { cartItemIds } as createOrderFromCartRequest;
    return await apiAuthPathWithJson<Order, createOrderFromCartRequest>(
      "/users/{userId}/orders/draft-from-cart",
      { userId },
      { method: "POST", json: req }
    );
  },

  async getOrder(orderId: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    return await apiAuthPath<Order>(
      "/users/{userId}/orders/{orderId}",
      { userId, orderId },
      { method: "GET" }
    );
  },

  async getCoupons(status: string = "AVAILABLE" ) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }    
    return await apiAuthPathAndQuery<CouponIssuance[]>(
      "/users/{userId}/coupon-issuances",
      { userId },
      { status : status },
      { method: "GET" }
    );
  },

  async getPoints() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }    
    return await apiAuthPath<GetPointBalanceResponse>(
      "/users/{userId}/points/balance",
      { userId },
      { method: "GET" }
    );
  },

  async applyCoupon(orderId: string, couponIssuanceId: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    const body = { couponIssuanceId } as ApplyCouponRequest;
    const res = await apiAuthPathWithJson<Order, ApplyCouponRequest>(
      "/users/{userId}/orders/{orderId}/coupon",
      { userId, orderId },
      { method: "POST", json: body }
    );
    console.log(res);
    return res;
  },

  async removeCoupon(orderId: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    return await apiAuthPath<Order>(
      "/users/{userId}/orders/{orderId}/coupon",
      { userId, orderId },
      { method: "DELETE" }
    );
  },

  async applyPoints(orderId: string, points: number) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    const body = { points } as ApplyPointsRequest;
    const res = await apiAuthPathWithJson<Order, ApplyPointsRequest>(
      "/users/{userId}/orders/{orderId}/points",
      { userId, orderId },
      { method: "POST", json: body }
    );
    console.log(res);
    return res;
  },

  async removePoints(orderId: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    return await apiAuthPath<Order>(
      "/users/{userId}/orders/{orderId}/points",
      { userId, orderId },
      { method: "DELETE" }
    );
  },

  async setAddress(orderId: string, addressId: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    const body = { addressId } as { addressId: string };
    const res = await apiAuthPathWithJson<Order, { addressId: string }>(
      "/users/{userId}/orders/{orderId}/address",
      { userId, orderId },
      { method: "POST", json: body }
    );
    console.log(res);
    return res;
  }
}

