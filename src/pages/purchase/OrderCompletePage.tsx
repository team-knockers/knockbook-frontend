import { useLoaderData } from 'react-router-dom';
import type { OrderCompletePageLoaderData } from './OrderCompletePage.loader';
import s from './OrderCompletePage.module.css';
import { formatWon } from '../../features/purchase/utils/formatter';

export default function OrderCompletePage() {

  const { 
    orderNo,
    address,
    paidAt,
    purchaseList, rentalList,
    aggregation } = useLoaderData() as OrderCompletePageLoaderData;

  return (
    <main>
      <section className={s['order-summary']}>
        <div className={s['section-head']}>
          <div className={s['section-head-title']}>
            <span>주문 정보</span>
          </div>
        </div>
        <div className={s['section-content']}>
          <div className={s['section-content-row']}>
            <span>주문 번호</span>
            <span>{orderNo}</span>
          </div>
          <div className={s['section-content-row']}>
            <span>주문 일자</span>
            <span>{paidAt}</span>
          </div>
        </div>
      </section>
      <section className={s['order-items']}>
        <div className={s['section-head']}>
          <div className={s['section-head-title']}>
            <span>결제 완료</span>
          </div>
        </div>
        <div className={s['section-content']}>
          <div className={s['order-items']}>
            {purchaseList.map(p => (
              <div 
                className={s['order-item']}
                key={p.id}>
                <div className={s['order-item-img']}>
                  <img src={p.thumbnailUrl} />
                </div>
                <div className={s['order-item-desc']}>
                  <div className={s['order-item-name']}>
                    <span>{p.titleSnapshot}</span>
                  </div>
                  <div className={s['order-item-qty']}>
                    <span> 수량: {p.quantity}</span>
                  </div>
                  <div className={s['order-item-amount']}>
                    <span>{formatWon(p.listPriceSnapshot)}</span>
                  </div>
                </div>
              </div>
            ))}
            {rentalList.map(r => (
              <div 
                className={s['order-item']}
                key={r.id}>
                <div className={s['order-item-img']}>
                  <img src={r.thumbnailUrl} />
                </div>
                <div className={s['order-item-desc']}>
                  <div className={s['order-item-name']}>
                    <span>{r.titleSnapshot}</span>
                  </div>
                  <div className={s['order-item-qty']}>
                    <span> 수량: {r.quantity}</span>
                  </div>
                  <div className={s['order-item-amount']}>
                    <span>{formatWon(r.listPriceSnapshot)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={s['shipping-address']}>
        <div className={s['section-head']}>
          <div className={s['section-head-title']}>
            <span>배송 정보</span>
          </div>
          <div className={s['section-content']}>
          <div className={s['section-content-row']}>
            <span>{address.recipientName} / {address.phone}</span>
            <span>{address.address1} {address.address2}</span>
          </div>
          <div className={s['section-content-row']}>
            <span>주문 일자</span>
            <span>{paidAt}</span>
          </div>
        </div>
        </div>
      </section>
      <section className={s['payment-details']}>
        <div className={s['section-content']}>
          <div className={s['section-content-row']}>
            <span>주문금액</span>
            <span>{formatWon(aggregation.subtotalAmount)}</span>
          </div>
          <div className={s['section-content-row']}>
            <span>상품 할인 금액</span>
            <span>{'-'}{formatWon(aggregation.discountAmount)}</span>
          </div>
          <div className={s['section-content-row']}>
            <span>쿠폰 할인 금액</span>
            <span>{'-'}{formatWon(aggregation.couponDiscountAmount)}</span>
          </div>
          <div className={s['section-content-row']}>
            <span>포인트 할인 금액</span>
            <span>{'-'}{formatWon(aggregation.pointsSpent)}</span>
          </div>
          <div className={s['section-content-row']}>
            <span>배송비</span>
            <span>{formatWon(aggregation.pointsSpent)}</span>
          </div>
          <div className={s['section-content-row']}>
            <span>결제 금액</span>
            <span>{formatWon(aggregation.totalAmount)}</span>
          </div>
          <div className={s['section-content-row']}>
            <span>적립 정보</span>
            <span>{formatWon(aggregation.pointsEarned)}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
