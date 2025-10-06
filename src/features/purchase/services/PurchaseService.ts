import { useSession } from "../../../hooks/useSession";
import { apiAuthPath, apiAuthPathAndQuery, apiAuthPathWithJson } from "../../../shared/api";
import type { addCartPurchaseItemRequest, addCartRentalItemRequest, GetCartResponse, OrderType } from "../type";

export const PurchaseService = {

  async getCart() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    return apiAuthPath<GetCartResponse>(
      "/users/{userId}/cart",
      { userId },
      { method: "GET" }
    );
  },

  async removeCartItem(cartItemId: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    return apiAuthPathAndQuery<GetCartResponse>(
      "/users/{userId}/cart/items/{cartItemId}",
      { userId: userId, cartItemId: cartItemId },
      { all: true },
      { method: "DELETE" }
    );
  },

  async addCartPurchaseItem(
    refType : OrderType,
    refId : string
  ) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    const req : addCartPurchaseItemRequest = { 
      refType: refType, refId: refId, quantity: 1 
    };
    return apiAuthPathWithJson<GetCartResponse, addCartPurchaseItemRequest>(
      "/users/{userId}/cart/items",
      { userId },
      { method: "POST", json: req }
    );
  },

  async addCartRentalItem(
    refType : OrderType,
    refId : string,
    rentalDays: number
  ) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    const req : addCartRentalItemRequest = { 
      refType: refType, refId: refId, rentalDays: rentalDays, quantity: 1
    };
    return apiAuthPathWithJson<GetCartResponse, addCartRentalItemRequest>(
      "/users/{userId}/cart/items",
      { userId: userId },
      { method: "POST", json: req }
    );
  },
  
  async incrementCartItem(cartItemId : string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    return apiAuthPathAndQuery<GetCartResponse>(
      "/users/{userId}/cart/items/{cartItemId}",
      { userId, cartItemId },
      { qty: 1 },
      { method: "PUT" }
    );
  },

  async decrementCartItem(cartItemId : string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }
    return apiAuthPathAndQuery<GetCartResponse>(
      "/users/{userId}/cart/items/{cartItemId}",
      { userId, cartItemId },
      { qty: 1 },
      { method: "DELETE" }
    );
  },
}
