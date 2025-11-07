import { 
  apiAuthMultipartPath, apiAuthPath, 
  apiAuthPathAndQuery, apiAuthPathWithJson 
} from "../../../shared/api";
import type { 
  ChangePasswordRequest, VerifyPasswordRequest, UserProfile, 
  Address, InsertAddressRequest, UpdateAddressRequest, 
  UpdateProfilePatch, UploadAvatarResponse 
} from "../types";
import type { 
  CouponIssuance, GetPointBalanceResponse, PointTransaction 
} from "../../purchase/type";
import { ensureUserId } from "../../../shared/authReady";

export const UserService = {
  
  async getProfile(userId: string) {
    return await apiAuthPath<UserProfile>(
      "/users/{userId}",
      { userId : userId },
      { method: "GET" },
    )
  },

  async updateMyProfile(patch: UpdateProfilePatch) {
    const userId = await ensureUserId();   
    return await apiAuthPathAndQuery<void>(
      "/users/{userId}",
      { userId },
      patch,
      { method: "PUT"}
    );
  },

  async uploadAvatar(avatar: File) {
    const userId = await ensureUserId();
    const form = new FormData();
    form.append("file", avatar);
    return apiAuthMultipartPath<UploadAvatarResponse>(
        "/users/{userId}/avatar",
        { userId },
        form,
        { method: "POST" }
      );
  },

  async getCoupons(status: string = "AVAILABLE" ) {
    const userId = await ensureUserId();
    return await apiAuthPathAndQuery<CouponIssuance[]>(
      "/users/{userId}/coupon-issuances",
      { userId },
      { status : status },
      { method: "GET" }
      );
  },

  async getPoints() {
    const userId = await ensureUserId();
    return await apiAuthPath<GetPointBalanceResponse>(
      "/users/{userId}/points/balance",
      { userId },
      { method: "GET" }
    );
  },

  async getPointTransactions() {
    const userId = await ensureUserId();
    return await apiAuthPath<PointTransaction[]>(
      "/users/{userId}/points/transactions",
      { userId },
      { method: "GET" }
    );
  },

  async changeDisplayName(name: string) {
    const userId = await ensureUserId();
    return await apiAuthPathAndQuery<void>(
      "/users/{userId}",
      { userId },
      { displayName: name },
      { method: "PUT"}
    );
  },

  async changeMbti(mbti: string) {
    const userId = await ensureUserId();
    return await apiAuthPathAndQuery<void>(
      "/users/{userId}",
      { userId },
      { mbti },
      { method: "PUT"}
    );
  },

  async changeBio(bio: string) {
    const userId = await ensureUserId();
    return await apiAuthPathAndQuery<void>(
      "/users/{userId}",
      { userId },
      { bio },
      { method: "PUT"}
    );
  },

  async changeFavoriteBookCategories(favoriteBookCategories: string[]) {
    const userId = await ensureUserId();
    return await apiAuthPathAndQuery<void>(
      "/users/{userId}",
      { userId },
      { favoriteBookCategories },
      { method: "PUT"}
    );
  },

  async changePassword(password: string) {
    const userId = await ensureUserId();
    const req = { password : password } as ChangePasswordRequest;
    return await apiAuthPathWithJson<void, ChangePasswordRequest>(
      "/users/{userId}/password",
      { userId : userId },
      { method: "PUT", json: req });
  },

  async verifyPassword(password : string) {
    const userId = await ensureUserId();
    const req = { password : password } as VerifyPasswordRequest;
    return await apiAuthPathWithJson<void, VerifyPasswordRequest>(
      "/users/{userId}/password/verify",
      { userId : userId },
      { method: "POST", json: req });
  },

  async getAddresses() {
    const userId = await ensureUserId();
    return await apiAuthPath<Address[]>(
      "/users/{userId}/addresses",
      { userId : userId },
      { method: "GET" });
  },

  async getAddress(addressId : string) {
    const userId = await ensureUserId();
    return await apiAuthPath<Address>(
      "/users/{userId}/addresses/{addressId}",
      { userId, addressId },
      { method: "GET" });
  },

   async setDefaultAddressAs(addressId: string) {
    const userId = await ensureUserId();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath(
      "/users/{userId}/addresses/{addressId}/make-default",
      { userId, addressId },
      { method: "POST" });
  },

  async deleteAddress(addressId: string) {
    const userId = await ensureUserId();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath(
      "/users/{userId}/addresses/{addressId}",
      { userId, addressId },
      { method: "DELETE" });
  },

  async insertAddress(req: InsertAddressRequest) {
    const userId = await ensureUserId();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathWithJson<void, InsertAddressRequest>(
      "/users/{userId}/addresses",
      { userId : userId },
      { method: "POST", json: req });
  },

  async updateAddress(
    addressId: string,
    req: UpdateAddressRequest) {
    const userId = await ensureUserId();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathWithJson<void, UpdateAddressRequest>(
      "/users/{userId}/addresses/{addressId}",
      { userId, addressId },
      { method: "PATCH", json: req });
  },
}
