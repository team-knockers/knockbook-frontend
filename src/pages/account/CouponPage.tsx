import { Outlet } from 'react-router-dom';
import s from './CouponPage.module.css';

type CouponType = "book" | "product";

type CouponProps = {
  type: CouponType; // Book coupon / Product coupon
  discountRate: number; // Discount rate
  title: string; // Coupon title
  expireDate: string; // Expiration date
};

function CouponCard({
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

export default function CouponPage() {
  
  const coupons: CouponProps[] = [
    {
      type: "book",
      discountRate: 20,
      title: "이달의 도서 20% 쿠폰",
      expireDate: "2025.11.01 00:00까지",
    },
    {
      type: "product",
      discountRate: 10,
      title: "이달의 상품 10% 쿠폰",
      expireDate: "2025.11.01 00:00까지",
    },
    {
      type: "book",
      discountRate: 10,
      title: "이달의 도서 10% 쿠폰",
      expireDate: "2025.11.01 00:00까지",
    },
    {
      type: "product",
      discountRate: 20,
      title: "이달의 상품 20% 쿠폰",
      expireDate: "2025.11.01 00:00까지",
    },
  ];

  return (
    <main className={s['page-layout']}>
      <div className={s['coupon-count']}>
        전체 쿠폰 <strong>{coupons.length}</strong>개
      </div>

      <div className={s['coupon-layout']}>
        {coupons.map((coupon, index) => (
          <CouponCard key={index} {...coupon} />
        ))}
        <Outlet />
      </div>
      <div className={s['coupon-information-layout']}>
        <p className={s['coupon-information-title']}>
          쿠폰 사용 안내
        </p>
        <ul className={s['coupon-information-list']}>
          <li>쿠폰은 유효기간 내에만 사용 가능합니다.</li>
          <li>다른 할인 혜택과 중복 사용이 불가합니다.</li>
          <li>일부 품목은 쿠폰 적용이 제외될 수 있습니다.</li>
          <li>주문 취소 시 쿠폰은 재발급되지 않습니다.</li>
        </ul>
      </div>
    </main>
  );
}
