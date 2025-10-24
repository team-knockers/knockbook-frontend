import s from './InsightStatPage.module.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import PreferenceChart from '../../features/feeds/components/PreferenceChart';
import ReadingBarChart from '../../features/feeds/components/ReadingBarChart';
import { useRouteLoaderData } from 'react-router-dom';
import type { InsightLoaderData } from './InsightPage.loader';
import { useMemo, useState } from 'react';

type EventInput = {
  title: string;
  start: string;
  end?: string;
  type?: 'rental' | 'purchase';
  bookId?: string;
  bookAuthor?: string;
  bookImageUrl?: string;
};

const toYmd = (s?: string | null) =>
  s ? new Date(s).toISOString().slice(0, 10) : undefined;

function useHistoryEvents(
  purchases: Array<{ bookId: string; bookTitle: string; bookAuthor?: string; bookImageUrl?: string; firstPurchasedAt?: string; lastPurchasedAt?: string }>,
  rentals: Array<{ bookId: string; bookTitle: string; bookAuthor?: string; bookImageUrl?: string; lastRentalStartAt?: string; lastRentalEndAt?: string }>
) {
  return useMemo<EventInput[]>(() => {
    const purchaseEvents =
      (purchases ?? []).flatMap((p) => {
        const start = toYmd(p.lastPurchasedAt || p.firstPurchasedAt);
        return start
          ? [{
              title: p.bookTitle,
              start,
              type: 'purchase',
              bookId: p.bookId,
              bookAuthor: p.bookAuthor,
              bookImageUrl: p.bookImageUrl,
            } satisfies EventInput]
          : [];
      });

    const rentalEvents =
      (rentals ?? []).flatMap((r) => {
        const start = toYmd(r.lastRentalStartAt);
        const end   = toYmd(r.lastRentalEndAt);
        return start
          ? [{
              title: r.bookTitle,
              start, end,
              type: 'rental',
              bookId: r.bookId,
              bookAuthor: r.bookAuthor,
              bookImageUrl: r.bookImageUrl,
            } satisfies EventInput]
          : [];
      });

    return [...purchaseEvents, ...rentalEvents];
  }, [purchases, rentals]);
}

export default function InsightStatPage() {

  const data = useRouteLoaderData("insight") as InsightLoaderData | undefined;

  const categoryRatioStat = data?.stat?.categoryRatioStat ?? [];
  const readCountStat = data?.stat?.readCountStat ?? [];
  const purchaseHistory = data?.history?.purchases ?? [];
  const rentalHistory = data?.history?.rentals ?? [];

  const hasCategory = categoryRatioStat.some(i => i.categoryReadRatio > 0);
  const hasReading  = readCountStat.some(d =>
    (d.readCountByMe ?? 0) > 0 || (d.avgReadCountByMember ?? 0) > 0
  );

  const events = useHistoryEvents(purchaseHistory, rentalHistory);

  const [selected, setSelected] = useState<EventInput | null>(null);
  const onEventClick = (info: any) => {
    const e = info.event;
    const ep = e.extendedProps ?? {};
    setSelected({
      title: e.title,
      start: e.startStr,
      end: e.endStr ?? undefined,
      type: ep.type,
      bookId: ep.bookId,
      bookAuthor: ep.bookAuthor,
      bookImageUrl: ep.bookImageUrl,
    });
  };

  return (
    <div className={s['page-layout']}>

      {/* fullcalendar event modal */}
      {selected && (
        <div 
          className={s['modal-backdrop']} 
          onClick={() => setSelected(null)}>
          <div 
            className={s['modal']}
            onClick={(e) => e.stopPropagation()}>
            <div className={s['modal-header']}>
              <h3>{selected.title}</h3>
              <button 
                className={s['modal-close']} 
                onClick={() => setSelected(null)}>×</button>
            </div>
            <div className={s['modal-body']}>
              <div className={s['book-modal']}>
                {selected.bookImageUrl && (
                  <img 
                    className={s['book-modal-image']}
                    src={selected.bookImageUrl}
                    alt={`${selected.title} cover`} />
                )}
                <div className={s['book-modal-info']}>
                  {selected.bookAuthor && 
                  <div className={s['book-author']}>
                    {selected.bookAuthor}
                  </div>}
                  <div className={s['book-dates']}>
                    <span><strong>시작</strong> {selected.start}</span>
                    {selected.end && <span><strong>완료</strong> {selected.end}</span>}
                  </div>
                  <div className={s['book-type']}>
                    {selected.type === 'rental' ? '대여한 책이예요' : '구매한 책이예요'}
                  </div>
                </div>
              </div>
            </div>
            <div className={s['modal-footer']}>
              {/* <Button onClick={() => navigate(`/books/${selected.bookId}`)}>상세 보기</Button> */}
            </div>
          </div>
        </div>
      )}

      <div className={s['full-calendar']}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          initialView="dayGridMonth"
          locale={koLocale}
          events={events ?? []}
          eventClick={onEventClick}
          eventClassNames={(arg) => {
            return arg.event.extendedProps.type === 'rental'
              ? ['rental-event']
              : ['purchase-event'];
          }}
          dayCellContent={(arg) => {
            return { html: arg.date.getDate().toString() };
          }}
          height="auto"
        />
        {(!events || events.length === 0) && (
          <p className={s['empty-message']}>
            이번 달 표기할 내역이 없어요.
          </p>
        )}
      </div>

      <div className={s['insight-stat-book']}>
        <p>도서 선호도</p>
          <div className={s['insight-stat-book-chart']}>
          {hasCategory ? (
            <PreferenceChart
              categoryRatioStat={categoryRatioStat}
              outerRadius={70}
              innerRadius={35}
            />
          ) : (
            <p className={s['empty-message']}>
              구매/대여한 도서가 아직 없어 통계를 보여드릴 수 없어요.
            </p>
          )}
        </div>
      </div>
      <div className={s['insight-stat-reading']}>
        <p>독서 현황</p>
        <div className={s['insight-stat-reading-chart']}>
          {hasReading ? (
            <ReadingBarChart readCountStat={readCountStat} />
          ) : (
            <p className={s['empty-message']}>
              구매/대여한 도서가 아직 없어 통계를 보여드릴 수 없어요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
