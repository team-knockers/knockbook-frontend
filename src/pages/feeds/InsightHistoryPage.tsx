import s from './InsightHistoryPage.module.css'
import { useMemo, useState } from "react";
import OneWayButton from '../../components/forms/OneWayButton';

import type { InsightLoaderData } from './InsightPage.loader';
import { useRouteLoaderData } from 'react-router-dom';
import { formatYmdDots } from '../../utils/dateValidator';

export default function InsightHistoryPage() {

  const data = useRouteLoaderData("insight") as InsightLoaderData;
  const purchaseHistory = data?.history?.purchases ?? [];
  const rentalHistory = data?.history?.rentals ?? [];
  const reviews = data?.history?.reviews ?? [];

  const reviewByBookId = useMemo(() => {
    const m = new Map<string, typeof reviews[number]>();
    for (const r of reviews) m.set(r.bookId, r);
    return m;
  }, [reviews]);

  const totalCount = purchaseHistory.length + rentalHistory.length;

  const [filter, setFilter] = useState("all");
  const filterOptions = [
    { value: "all", label: "전체보기" },
    { value: "purchase", label: "구매한 책" },
    { value: "rental", label: "대여한 책" }
  ];
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  /* UI for fail to load data */
  if (!data) {
    function revalidate(): void {
      throw new Error('Function not implemented.');
    }

    return (
      <div className={s['page-layout']}>
        <div className={s['empty-state']}>
          <p>데이터를 불러오지 못했어요.</p>
          <OneWayButton
            content="다시 시도"
            responsiveType="fixed"
            widthSizeType="sm"
            heightSizeType="sm"
            colorType="dark"
            onClick={() => revalidate()}
          />
        </div>
      </div>
    );
  }

  /* UI for no history data */
  if (totalCount === 0) {
    return (
      <div className={s['page-layout']}>
        <div className={s['empty-state']}>
          <p>아직 기록이 없어요. 첫 책을 만나 보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s['page-layout']}>
      <div className={s['user-history-wrapper']}>
        <p>문 앞의 책방과 함께해주신 책이에요</p>

        <div className={s['history-header']}>
          <div className={s['history-header-left']}>
            <span className={s['total-count']}>총 {totalCount}권</span>
          </div>
          <div className={s['history-header-right']}>
            <div className={s['filter-wrapper']}>
              <select
                className={s['filter-select']}
                value={filter}
                onChange={handleFilterChange}
              >
                {filterOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={s['user-history-list']}>
          {(filter === "all" || filter === "purchase") && purchaseHistory.map(h => {
            const review = reviewByBookId.get(h.bookId);
            return (
              <div 
                key={h.bookId}
                className={s['book-history-item']}>
                <div className={s['book-history-item-content']}>
                  <img 
                    className={s['book-image']}
                    src={h.bookImageUrl}
                    alt={`${h.bookTitle} cover`} />
                  <div className={s['book-info-wrapper']}>
                    <div className={s['book-title']}>{h.bookTitle}</div>
                    <div className={s['book-author']}>{h.bookAuthor}</div>
                    <div className={s['book-dates']}>
                      <span><strong>첫 구매일</strong></span>
                      <span>{h.firstPurchasedAt}</span>
                      <span><strong>마지막 구매일</strong></span>
                      <span>{h.lastPurchasedAt}</span>
                    </div>
                  </div>
                </div>

                <div className={s['book-history-item-review']}>
                  {!review ? (
                    <div className={s['book-review-button']}>
                      <OneWayButton
                        content="리뷰작성"
                        responsiveType="fixed"
                        widthSizeType="sm"
                        heightSizeType="sm"
                        colorType="dark"
                        onClick={() => {/* TODO: open review modal */}}
                      />
                    </div>
                  ) : (
                    <div className={s['book-review-wrapper']}>
                      <div className={s['book-review-header']}>
                        <div className={s['book-review-rating']}>
                          <strong>평점</strong> {review.rating} / 5</div>
                        <div className={s['book-review-tag']}>
                          <span>리뷰 작성 완료 | {formatYmdDots(review.createdAt ?? "")}</span>
                        </div>
                      </div>
                      <div className={s['book-review-content']}>{review.content}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {(filter === "all" || filter === "rental") && rentalHistory.map(h => {
            const review = reviewByBookId.get(h.bookId);
            return (
              <div 
                key={h.bookId}
                className={s['book-history-item']}>
                <div className={s['book-history-item-content']}>
                  <img 
                    className={s['book-image']}
                    src={h.bookImageUrl}
                    alt={`${h.bookTitle} cover`} />
                  <div className={s['book-info-wrapper']}>
                    <div className={s['book-title']}>
                      {h.bookTitle}
                    </div>
                    <div className={s['book-author']}>
                      {h.bookAuthor}
                    </div>
                    <div className={s['book-dates']}>
                      <span><strong>대여 시작일</strong></span>
                      <span>{h.lastRentalStartAt}</span>
                      <span><strong>대여 완료일</strong></span>
                      <span>{h.lastRentalEndAt}</span>
                    </div>
                  </div>
                </div>

                <div className={s['book-history-item-review']}>
                  {!review ? (
                    <div className={s['book-review-button']}>
                      <OneWayButton
                        content="리뷰작성"
                        responsiveType="fixed"
                        widthSizeType="sm"
                        heightSizeType="sm"
                        colorType="dark"
                        onClick={() => {/* TODO: open review modal */}}
                      />
                    </div>
                  ) : (
                    <div className={s['book-review-wrapper']}>
                      <div className={s['book-review-header']}>
                        <div className={s['book-review-rating']}>
                          <strong>평점</strong> {review.rating} / 5</div>
                        <div className={s['book-review-tag']}>
                          <span>리뷰 작성 완료 | {formatYmdDots(review.createdAt ?? "")}</span>
                        </div>
                      </div>
                      <div className={s['book-review-content']}>
                        <span>{review.content}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
