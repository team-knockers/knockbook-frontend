import s from "./AccountCouponComponent.module.css";

type CouponType = "book" | "product";

export type CouponProps = {
  type: CouponType; // 도서 쿠폰 / 상품 쿠폰
  discountRate: number; // 할인율
  title: string; // 쿠폰 이름
  expireDate: string; // 만료일
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
