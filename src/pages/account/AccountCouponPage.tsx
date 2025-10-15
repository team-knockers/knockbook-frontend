import AccountCouponComponent from './AccountCouponComponent';
import s from './AccountCouponPage.module.css';

export default function AccountCouponPage() {
  return (
    <main className={s['page-layout']}>
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
    </main>
  );
}