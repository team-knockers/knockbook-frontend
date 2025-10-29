import { useFetcher, useLoaderData, useRevalidator } from 'react-router-dom';
import s from './RentalHistoryPage.module.css';
import type { RentalHistoryLoaderData } from './RentalHistoryPage.loader';
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

export default function RentalHistoryPage() {
  const initial = useLoaderData() as RentalHistoryLoaderData;

  const fetcher = useFetcher<RentalHistoryLoaderData>();
  const reviewFetcher = useFetcher<{ ok: boolean }>();
  const revalidator = useRevalidator();

  const rentals = fetcher.data?.rentals ?? initial.rentals;
  const countByStatus = fetcher.data?.countByStatus ?? initial.countByStatus;
  const formatStatus = fetcher.data?.formatStatus ?? initial.formatStatus;

  const reviewable = new Set(['DELIVERED','RETURN_REQUESTED','RETURNING','RETURNED']);
  const isMobile = useMediaQuery('(max-width: 1023.98px)');

  const [reviewTarget, setReviewTarget] = useState<ReviewTarget>(null);

  const openReview = (objectType: string, objectId: string, objectName: string, objectImgUrl: string) =>
    setReviewTarget({ objectType, objectId, objectName, objectImgUrl });
  const closeReview = () => setReviewTarget(null);

  const submitGroup = (group?: string) => {
    const params = new URLSearchParams();
    if (group) params.set('group', group);
    fetcher.submit(params, { method: 'get' });
  };

  async function handleSubmitReview(content: string, rating: number) {
    if (!reviewTarget) return;
    reviewFetcher.submit(
      {
        _intent: 'createBookReview',
        bookId: reviewTarget.objectId,
        transactionType: 'RENTAL',
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

        {/* filter buttons */}
        <div className={s['history-summary']}>
          <div className={s['history-summary-title']}>
            <button className={s['filter-button']} onClick={() => submitGroup(undefined)}>
              대여내역
            </button>
          </div>
          <div className={s['history-summary-items']}>
            <button className={s['filter-button']} onClick={() => submitGroup('PREPARING')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}><span>{countByStatus['PREPARING'] ?? 0}</span></div>
                <div className={s['history-summary-item-name']}><span>준비중</span></div>
              </div>
            </button>
            <button className={s['filter-button']} onClick={() => submitGroup('DELIVERED')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}><span>{countByStatus['DELIVERED'] ?? 0}</span></div>
                <div className={s['history-summary-item-name']}><span>대여중</span></div>
              </div>
            </button>
            <button className={s['filter-button']} onClick={() => submitGroup('RETURNED')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}><span>{countByStatus['RETURNED'] ?? 0}</span></div>
                <div className={s['history-summary-item-name']}><span>대여완료</span></div>
              </div>
            </button>
            <button className={s['filter-button']} onClick={() => submitGroup('CANCELLED')}>
              <div className={s['history-summary-item']}>
                <div className={s['history-summary-item-count']}><span>{countByStatus['CANCELLED'] ?? 0}</span></div>
                <div className={s['history-summary-item-name']}><span>취소</span></div>
              </div>
            </button>
          </div>
        </div>

        {rentals.length === 0 ? (
          <div className={s['empty-message']}>해당 내역이 없습니다.</div>
        ) : (
          rentals.map(o => (
            <div key={o.orderNo} className={s['order-wrapper']}>
              <div className={s['order-header']}>
                <div className={s['order-header-left']}>
                  <div className={s['order-date']}><span>{formatYmdDots(o.paidAt)}</span></div>
                  <div className={s['order-no']}><span>({o.orderNo})</span></div>
                </div>
                <div className={s['order-detail']}><span>상세보기 {'>'}</span></div>
              </div>

              <div className={s['order-list']}>
                {o.items.map(i => {
                  const done = (i as any).reviewedByMe === true;
                  const canWrite = reviewable.has(o.rentalStatus as any) && !done;

                  return (
                    <div className={s['order-item']} key={`${o.orderNo}:${i.refType}:${i.refId}`}>
                      <div className={s['order-item-left']}>
                        <img className={s['order-item-img']} src={i.thumbnailUrl} alt={i.titleSnapshot} />
                        <div className={s['order-item-desc']}>
                          <div className={s['order-item-status']}>{formatStatus(o.rentalStatus || '')}</div>
                          <div className={s['order-item-name']}>{i.titleSnapshot}</div>
                          <div className={s['order-item-qty']}>수량: {i.quantity}</div>
                          <div className={s['order-item-price']}>{formatWon(i.rentalPriceSnapshot)}</div>
                        </div>
                      </div>

                      {reviewable.has(o.rentalStatus as any) && (
                        <button
                          className={s['order-item-review-btn']}
                          disabled={!canWrite}
                          aria-disabled={!canWrite}
                          onClick={() => openReview(i.refType, i.refId, i.titleSnapshot, i.thumbnailUrl)}
                          style={done ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: 'lightgray' } : undefined}
                        >
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
      </div>
    </main>
  );
}
