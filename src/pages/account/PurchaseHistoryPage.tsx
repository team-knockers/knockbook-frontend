import { useLoaderData } from 'react-router-dom';
import s from './PurchaseHistoryPage.module.css';
import type { PurchaseHistoryLoaderData } from './PurchaseHistory.loader';
import { formatYmdDots } from '../../utils/dateValidator';
import { formatPurchaseStatus, formatWon } from '../../features/purchase/utils/formatter';

export default function PurchaseHistoryPage() {

  const { purchaseOrders } = useLoaderData() as PurchaseHistoryLoaderData;

  const countOrders = (status: string) => {
    return purchaseOrders.filter(o => o.status == status).length;
  }

  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
        <div className={s['history-summary']}>
          <div className={s['history-summary-title']}>
            <span>구매내역</span>
          </div>
          <div className={s['history-summary-items']}>
            <div className={s['history-summary-item']}>
              <div className={s['history-summary-item-count']}>
                <span>{countOrders('PENDING')}</span>
              </div>
              <div className={s['history-summary-item-name']}>
                <span>{formatPurchaseStatus('PENDING')}</span>
              </div>
            </div>
            <div className={s['history-summary-item']}>
              <div className={s['history-summary-item-count']}>
                <span>{countOrders('FULFILLING')}</span>
              </div>
              <div className={s['history-summary-item-name']}>
                <span>{formatPurchaseStatus('FULFILLING')}</span>
              </div>
            </div>
            <div className={s['history-summary-item']}>
              <div className={s['history-summary-item-count']}>
                <span>{countOrders('COMPLETED')}</span>
              </div>
              <div className={s['history-summary-item-name']}>
                <span>{formatPurchaseStatus('COMPLETED')}</span>
              </div>
            </div>
            <div className={s['history-summary-item']}>
              <div className={s['history-summary-item-count']}>
                <span>{countOrders('CANCELLED')}</span>
              </div>
              <div className={s['history-summary-item-name']}>
                <span>{formatPurchaseStatus('CANCELLED')}</span>
              </div>
            </div>
          </div>
        </div>
        {purchaseOrders.map(o => (
          <div className={s['order-wrapper']}>
            <div className={s['order-header']}>
              <div className={s['order-header-left']}>
                <div className={s['order-date']}>
                  <span>{formatYmdDots(o.completedAt)}</span>
                </div>
                <div className={s['order-no']}>
                  <span>({o.orderNo})</span>
                </div>
              </div>
              <div className={s['order-detail']}>
                <span>상세보기 {'>'}</span>
              </div>
            </div>
            <div className={s['order-list']}>
              {o.items.map(i => (
                <div className={s['order-item']}>
                  <div className={s['order-item-left']}>
                    <img
                      className={s['order-item-img']}
                      src={i.thumbnailUrl} />
                    <div className={s['order-item-desc']}>
                      <div className={s['order-item-status']}>
                        {formatPurchaseStatus(o.status)}
                      </div>
                      <div className={s['order-item-name']}>
                        {i.titleSnapshot}
                      </div>
                      <div className={s['order-item-qty']}>
                        수량: {i.quantity}
                      </div>
                      <div className={s['order-item-price']}>
                        {formatWon(i.listPriceSnapshot)}
                      </div>
                    </div>
                  </div>
                  <button
                      className={s['order-item-review-btn']}
                      onClick={() => {/* TODO */}}>
                      리뷰 작성    
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className={s['policy']}>
          <div className={s['policy-title']}>
            <span>카드결제(간편결제,법인카드 포함) 취소 안내</span>
          </div>
          <div className={s['policy-content']}>
            <span className={s['policy-content-row']}>
              카드결제 취소 기간 안내
            </span>
            <span className={s['policy-content-row']}>
              전체취소 : 당일 취소/환불 처리
            </span>
            <span className={s['policy-content-row']}>
              부분취소 : 영업일 기준 3~5일 소요(당일 취소 포함)
            </span>
            <span className={s['policy-content-row']}>
              카드사 정책에 따라 주문당일 부분취소한 경우 당일 취소 및 환불 불가합니다.
            </span>
            <span className={s['policy-content-row']}>
              부분취소한 경우 카드사 승인 취소는 약 3~5일 소요됩니다.
            </span>
            <span className={s['policy-content-row']}>
              카드사에서 부분취소를 지원하지 않는 카드의 경우 승인취소가 아닌 예치금으로 환불됩니다.
            </span>
            <span className={s['policy-content-row']}>
              주문취소시 오류가 발생하거나 환불이 정상 처리되지 않을 경우 1:1로 문의 주시기 바랍니다.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}