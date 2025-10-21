import { useFetcher, useLoaderData } from 'react-router-dom';
import s from './CouponPage.module.css';
import type { CouponPageLoaderData } from './CouponPage.loader';
import { formatWon } from '../../features/purchase/utils/formatter';
import { formatYmdTimeDots, remainDate } from '../../utils/dateValidator';

export default function CouponPage() {

  const initial = useLoaderData() as CouponPageLoaderData;
  const fetcher = useFetcher<CouponPageLoaderData>();
  const coupons = fetcher.data?.coupons ?? initial.coupons;
  
  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
         <div className={s['page-header']}>
          <div className={s['total-count']}>
            <span>전체 쿠폰 ({coupons.length})</span>
          </div>
        </div>

        {coupons.length === 0 ? (
          <div className={s['empty-list-layout']}>
            <span>사용할 수 있는 쿠폰이 없습니다.</span>
          </div>
        ) : 
        (<div className={s['coupon-list-layout']}>
          {coupons.map((coupon, idx) => (
            <div 
              className={s["coupon-layout"]}
              key={`coupon-${idx}`}>
              <div className={s["coupon-content"]}>
                <div className={s["coupon-tag"]}>
                  <span>{coupon.scope}</span>
                </div>              
                {coupon.discountRateBp &&
                <div className={s["coupon-discount-rate"]}>
                  <span>{coupon.discountRateBp}%</span>
                </div>}
                {coupon.discountAmount && 
                <div className={s["coupon-discount-amount"]}>
                  <span>{formatWon(coupon.discountAmount)}</span>
                </div>}
                <div className={s["coupon-name"]}>
                  <span>{coupon.name}</span>
                </div>
              </div>
              <div className={s["coupon-expire-date"]}>
                <span className={s['coupon-remain-date']}>
                  {remainDate(coupon.expiresAt)}일 남음
                </span>
                <span>{formatYmdTimeDots(coupon.expiresAt)}까지</span>
              </div>
            </div>
          ))}
        </div>)}
        <div className={s['use-guide-layout']}>
          <div className={s['use-guide-title']}>
            <span>쿠폰 사용 안내</span>
          </div>
          <ul className={s['use-guide-row']}>
            <li>쿠폰은 유효기간 내에만 사용 가능합니다.</li>
            <li>다른 할인 혜택과 중복 사용이 불가합니다.</li>
            <li>일부 품목은 쿠폰 적용이 제외될 수 있습니다.</li>
            <li>주문 취소 시 쿠폰은 재발급되지 않습니다.</li>
          </ul>
        </div>
      
      </div>
    </main>
  );
}
