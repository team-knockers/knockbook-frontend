import { UserService } from "../../features/account/services/UserService";
import type { CouponIssuance } from "../../features/purchase/type";

export type CouponPageLoaderData = {
  coupons: CouponIssuance[]
};

export async function CouponPageLoader() {
  const coupons = await UserService.getCoupons();
  return { coupons } satisfies CouponPageLoaderData;
}
