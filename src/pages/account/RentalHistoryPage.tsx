import { useFetcher, useLoaderData } from 'react-router-dom';
import s from './RentalHistoryPage.module.css';
import { formatYmdDots } from '../../utils/dateValidator';
import { formatWon } from '../../features/purchase/utils/formatter';
import type { RentalHistoryLoaderData } from './RentalHistoryPage.loader';

export default function RentalHistoryPage() {

  const initial = useLoaderData() as RentalHistoryLoaderData;
  const fetcher = useFetcher<RentalHistoryLoaderData>();
  const rentals = fetcher.data?.rentals ?? initial.rentals;
  const countByStatus = fetcher.data?.countByStatus ?? initial.countByStatus;
  const formatStatus = fetcher.data?.formatStatus ?? initial.formatStatus;
  const reviewable = new Set(['DELIVERED','RETURN_REQUESTED','RETURNING','RETURNED']);

  const submitGroup = (group?: string) => {
    const params = new URLSearchParams();
    if (group) { params.set('group', group); }
    fetcher.submit(params, { method: 'get' });
  };

  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>

        {/* filter buttons */}
        <div className={s['history-summary']}>
          {/* list all */}
          
          <div className={s['history-summary-title']}>
            <button
              className={s['filter-button']}
              onClick={() => submitGroup(undefined)}>
                대여내역
            </button>
          </div>
          <div className={s['history-summary-items']}>
            {/* list preparing items */}
            <button
              className={s['filter-button']}
              onClick={() => submitGroup('PREPARING')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}>
                  <span>{countByStatus['PREPARING'] ?? 0}</span>
                </div>
                <div className={s['history-summary-item-name']}>
                  <span>준비중</span>
                </div>
              </div>
            </button>
            {/* list ongoing items */}
            <button
              className={s['filter-button']}
              onClick={() => submitGroup('DELIVERED')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}>
                  <span>{countByStatus['DELIVERED'] ?? 0}</span>
                </div>
                <div className={s['history-summary-item-name']}>
                  <span>대여중</span>
                </div>
              </div>
            </button>
            {/* list completed items */}
            <button
              className={s['filter-button']}
              onClick={() => submitGroup('RETURNED')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}>
                  <span>{countByStatus['RETURNED'] ?? 0}</span>
                </div>
                <div className={s['history-summary-item-name']}>
                  <span>대여완료</span>
                </div>
              </div>
            </button>
            {/* list canceled items */}
            <button
              className={s['filter-button']} 
              onClick={() => submitGroup('CANCELLED')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}>
                  <span>{countByStatus['CANCELLED'] ?? 0}</span>
                </div>
                <div className={s['history-summary-item-name']}>
                  <span>취소</span>
                </div>
              </div>
            </button>
          </div>
        </div>
        {rentals.length === 0 ? (
          <div className={s['empty-message']}>
            해당 내역이 없습니다.
          </div>
        ) : (
        rentals.map(o => (
          <div className={s['order-wrapper']}>
            <div className={s['order-header']}>
              <div className={s['order-header-left']}>
                <div className={s['order-date']}>
                  <span>{formatYmdDots(o.paidAt)}</span>
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
                <div 
                  className={s['order-item']}
                  key={`${o.orderNo}:${i.refType}:${i.refId}`}>
                  <div className={s['order-item-left']}>
                    <img
                      className={s['order-item-img']}
                      src={i.thumbnailUrl} />
                    <div className={s['order-item-desc']}>
                      <div className={s['order-item-status']}>
                        {formatStatus(o.rentalStatus)}
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
                  {reviewable.has(o.rentalStatus) && (
                    <button
                      className={s['order-item-review-btn']}
                      onClick={() => {/* TODO */}}>
                      리뷰 작성
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          ))
        )}
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
