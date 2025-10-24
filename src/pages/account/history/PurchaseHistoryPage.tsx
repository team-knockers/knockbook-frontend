import { useFetcher, useLoaderData, useRevalidator } from 'react-router-dom';
import s from './PurchaseHistoryPage.module.css';
import type { PurchaseHistoryLoaderData } from './PurchaseHistoryPage.loader';
import { formatYmdDots } from '../../../utils/dateValidator';
import { formatWon } from '../../../features/purchase/utils/formatter';
import SimplePopup from '../../../components/overlay/SimplePopup';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import ReviewForm from '../../../components/forms/ReviewForm';

type ReviewTarget = null | {
  objectType: string;
  objectId: string;
  objectName: string;
  objectImgUrl: string;
};

export default function PurchaseHistoryPage() {
  const initial = useLoaderData() as PurchaseHistoryLoaderData;

  const fetcher = useFetcher<PurchaseHistoryLoaderData>();
  const reviewFetcher = useFetcher<{ ok: boolean }>();
  const revalidator = useRevalidator();

  const purchases = fetcher.data?.purchases ?? initial.purchases;
  const countByStatus = fetcher.data?.countByStatus ?? initial.countByStatus;
  const formatStatus = fetcher.data?.formatStatus ?? initial.formatStatus;
  const reviewable = new Set(['COMPLETED','RETURNED']);

  const isMobile = useMediaQuery('(max-width: 1023.98px)');

  const [reviewTarget, setReviewTarget] = useState<ReviewTarget>(null);

  const openReview = (
    objectType: string,
    objectId: string,
    objectName: string,
    objectImgUrl: string
  ) => setReviewTarget({ objectType, objectId, objectName, objectImgUrl });
  const closeReview = () => setReviewTarget(null);

  const submitStatus = (status?: string) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    fetcher.submit(params, { method: 'get' });
  };

  async function handleSubmitReview(content: string, rating: number) {
    if (!reviewTarget) return;
    reviewFetcher.submit(
      {
        _intent: 'createBookReview',
        bookId: reviewTarget.objectId,
        transactionType: reviewTarget.objectType === 'BOOK_RENTAL' ? 'RENTAL' : 'PURCHASE',
        rating: String(rating),
        content,
      },
      { method: 'post' }
    );
    closeReview();
  }

  useEffect(() => {
    if (reviewFetcher.state === 'idle' && reviewFetcher.data?.ok) {
      revalidator.revalidate();
    }
  }, [reviewFetcher.state, reviewFetcher.data, revalidator]);

  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>

        <SimplePopup
          open={!!reviewTarget}
          onClose={closeReview}
          title="리뷰 작성"
          fullScreen={isMobile}
          noBodyPadding
          showCloseButton
        >
          {reviewTarget && (
            <ReviewForm
              objectName={reviewTarget.objectName}
              objectImgUrl={reviewTarget.objectImgUrl}
              onSubmit={handleSubmitReview}
            />
          )}
        </SimplePopup>

        <div className={s['history-summary']}>
          <div className={s['history-summary-title']}>
            <span>구매내역</span>
          </div>
          <div className={s['history-summary-items']}>
            <button className={s['filter-button']} onClick={() => submitStatus('PENDING')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}>
                  <span>{countByStatus['PENDING']}</span>
                </div>
                <div className={s['history-summary-item-name']}>
                  <span>{formatStatus('PENDING')}</span>
                </div>
              </div>
            </button>
            <button 
              className={s['filter-button']}
              onClick={() => submitStatus('FULFILLING')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}>
                  <span>{countByStatus['FULFILLING']}</span>
                </div>
                <div className={s['history-summary-item-name']}>
                  <span>{formatStatus('FULFILLING')}</span>
                </div>
              </div>
            </button>
            <button className={s['filter-button']} onClick={() => submitStatus('COMPLETED')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}>
                  <span>{countByStatus['COMPLETED']}</span>
                </div>
                <div className={s['history-summary-item-name']}>
                  <span>{formatStatus('COMPLETED')}</span>
                </div>
              </div>
            </button>
            <button 
              className={s['filter-button']}
              onClick={() => submitStatus('CANCELLED')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}>
                  <span>{countByStatus['CANCELLED']}</span>
                </div>
                <div className={s['history-summary-item-name']}>
                  <span>{formatStatus('CANCELLED')}</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {purchases.length === 0 ? (
          <div className={s['empty-message']}>
            <span>해당 내역이 없습니다.</span>
          </div>
        ) : (
          purchases.map(o => (
            <div key={o.orderNo} className={s['order-wrapper']}>
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
                {o.items.map(i => {
                  const done = (i as any).reviewedByMe === true;
                  const canWrite = reviewable.has(o.status) && !done;

                  return (
                    <div key={i.refId} className={s['order-item']}>
                      <div className={s['order-item-left']}>
                        <img 
                          className={s['order-item-img']} 
                          src={i.thumbnailUrl} alt={i.titleSnapshot} />
                        <div className={s['order-item-desc']}>
                          <div className={s['order-item-status']}>
                            <span>{formatStatus(o.status)}</span>
                          </div>
                          <div className={s['order-item-name']}>
                            <span>{i.titleSnapshot}</span>
                          </div>
                          <div className={s['order-item-qty']}>
                            <span>수량: {i.quantity}</span>
                          </div>
                          <div className={s['order-item-price']}>
                            <span>{formatWon(i.listPriceSnapshot)}</span>
                          </div>
                        </div>
                      </div>

                      {reviewable.has(o.status) && (
                        <button
                          className={s['order-item-review-btn']}
                          disabled={!canWrite}
                          aria-disabled={!canWrite}
                          onClick={() => openReview(i.refType, i.refId, i.titleSnapshot, i.thumbnailUrl)}
                          style={done ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: 'lightgray' } : undefined}>
                          {done ? '리뷰 작성 완료' : '리뷰 작성'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <div className={s['policy']}>
          <div className={s['policy-title']}><span>카드결제(간편결제,법인카드 포함) 취소 안내</span></div>
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
              부분취소 미지원 카드는 예치금 환불됩니다.
            </span>
            <span className={s['policy-content-row']}>
              오류/미처리 시 1:1 문의 바랍니다.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
