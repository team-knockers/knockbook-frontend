import AccountCouponComponent from '../../features/account/components/AccountCouponComponent';
import s from './AccountCouponPage.module.css';

export default function AccountCouponPage() {
  return (
    <main className={s['page-layout']}>
      <div className={s['coupon-layout']}>
        <AccountCouponComponent
          type="book"
          discountRate={20}
          title="이달의 도서 20% 쿠폰"
          expireDate="2025.11.01 00:00까지"
        />
        <AccountCouponComponent
          type="product"
          discountRate={10}
          title="이달의 상품 10% 쿠폰"
          expireDate="2025.11.01 00:00까지"
        />
        <AccountCouponComponent
          type="book"
          discountRate={10}
          title="이달의 도서 10% 쿠폰"
          expireDate="2025.11.01 00:00까지"
        />
        <AccountCouponComponent
          type="product"
          discountRate={20}
          title="이달의 상품 20% 쿠폰"
          expireDate="2025.11.01 00:00까지"
        />
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