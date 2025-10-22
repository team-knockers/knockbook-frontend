import { apiAuthPath, apiAuthPathAndQuery, apiAuthPathWithJson } from "../../../shared/api";
import { useSession } from "../../../hooks/useSession";
import type { ChangePasswordRequest, VerifyPasswordRequest, UserProfile, Address, InsertAddressRequest, UpdateAddressRequest } from "../types";
import type { CouponIssuance, GetPointBalanceResponse, PointTransaction } from "../../purchase/type";

export const UserService = {
  
  async getMyProfile() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<UserProfile>(
      "/users/{userId}",
      { userId : userId },
      { method: "GET" }
    )
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

  async getPointTransactions() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") }    
    return await apiAuthPath<PointTransaction[]>(
      "/users/{userId}/points/transactions",
      { userId },
      { method: "GET" }
    );
  },

  async changeDisplayName(name: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathAndQuery<void>(
      "/users/{userId}",
      { userId },
      { displayName: name },
      { method: "PUT"}
    );
  },

  async changeMbti(mbti: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathAndQuery<void>(
      "/users/{userId}",
      { userId },
      { mbti },
      { method: "PUT"}
    );
  },

  async changeBio(bio: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathAndQuery<void>(
      "/users/{userId}",
      { userId },
      { bio },
      { method: "PUT"}
    );
  },

  async changeFavoriteBookCategories(categories: string[]) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathAndQuery<void>(
      "/users/{userId}",
      { userId },
      { categories },
      { method: "PUT"}
    );
  },

  async changePassword(password: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    const req = { password : password } as ChangePasswordRequest;
    return await apiAuthPathWithJson<void, ChangePasswordRequest>(
      "/users/{userId}/password",
      { userId : userId },
      { method: "PUT", json: req });
  },

  async verifyPassword(password : string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    const req = { password : password } as VerifyPasswordRequest;
    return await apiAuthPathWithJson<void, VerifyPasswordRequest>(
      "/users/{userId}/password/verify",
      { userId : userId },
      { method: "POST", json: req });
  },

  async getAddresses() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<Address[]>(
      "/users/{userId}/addresses",
      { userId : userId },
      { method: "GET" });
  },

  async getAddress(addressId : string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<Address>(
      "/users/{userId}/addresses/{addressId}",
      { userId, addressId },
      { method: "GET" });
  },

   async setDefaultAddressAs(addressId: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath(
      "/users/{userId}/addresses/{addressId}/make-default",
      { userId, addressId },
      { method: "POST" });
  },

  async deleteAddress(addressId: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath(
      "/users/{userId}/addresses/{addressId}",
      { userId, addressId },
      { method: "DELETE" });
  },

  async insertAddress(req: InsertAddressRequest) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathWithJson<void, InsertAddressRequest>(
      "/users/{userId}/addresses",
      { userId : userId },
      { method: "POST", json: req });
  },

  async updateAddress(
    addressId: string,
    req: UpdateAddressRequest) {
    console.log(req);
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathWithJson<void, UpdateAddressRequest>(
      "/users/{userId}/addresses/{addressId}",
      { userId, addressId },
      { method: "PATCH", json: req });
  },
}
