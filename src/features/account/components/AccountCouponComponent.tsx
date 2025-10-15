import s from "./AccountCouponComponent.module.css";

type CouponType = "book" | "product";

export type CouponProps = {
  type: CouponType; // Book coupon / Product coupon
  discountRate: number; // Discount rate
  title: string; // Coupon title
  expireDate: string; // Expiration date
};

export default function AccountCouponComponent({
  type,
  discountRate,
  title,
  expireDate,
}: CouponProps) {
  return (
    <div className={s["coupon-card"]}>
      <div className={s["coupon-header"]}>
        <span
          className={`${s["coupon-type"]} ${
            type === "book" ? s["book"] : s["product"]
          }`}
        >
          {type === "book" ? "도서 쿠폰" : "상품 쿠폰"}
        </span>
      </div>
      <div className={s["coupon-body"]}>
        <p className={s["discount"]}>{discountRate}%</p>
        <p className={s["title"]}>{title}</p>
        <p className={s["expire-date"]}>{expireDate}</p>
      </div>
    </div>
  );
}
