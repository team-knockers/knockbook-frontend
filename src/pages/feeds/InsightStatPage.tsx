import s from './InsightStatPage.module.css';

import { useMemo, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import type { InsightLoaderData } from './InsightPage.loader';

import PreferenceChart from '../../features/feeds/components/PreferenceChart';
import ReadingBarChart from '../../features/feeds/components/ReadingBarChart';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { ko };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type KbEvent = {
  title: string;
  start: string;       // 'YYYY-MM-DD'
  end?: string;        // 'YYYY-MM-DD'
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
  return useMemo<KbEvent[]>(() => {
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
            } satisfies KbEvent]
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
            } satisfies KbEvent]
          : [];
      });

    return [...purchaseEvents, ...rentalEvents];
  }, [purchases, rentals]);
}

type RbcEvent = {
  title: string;
  start: Date;
  end: Date;
  resource: {
    type?: 'rental' | 'purchase';
    bookId?: string;
    bookAuthor?: string;
    bookImageUrl?: string;
  };
};

function useRbcEvents(kbEvents: KbEvent[]) {
  return useMemo<RbcEvent[]>(() => {
    const toDate = (s?: string) => (s ? new Date(s) : undefined);
    return kbEvents.map((e) => {
      const s = toDate(e.start)!;
      const ed = toDate(e.end) ?? s;
      return {
        title: e.title,
        start: s,
        end: ed,
        resource: {
          type: e.type,
          bookId: e.bookId,
          bookAuthor: e.bookAuthor,
          bookImageUrl: e.bookImageUrl,
        },
      };
    });
  }, [kbEvents]);
}

function Toolbar({ label, onNavigate }: any) {
  return (
    <div className={s.toolbar}>
      <button className={s.navBtn} onClick={() => onNavigate('PREV')}>‹</button>
      <h2 className={s.title}>{label}</h2>
      <button className={s.navBtn} onClick={() => onNavigate('NEXT')}>›</button>
      <button className={s.todayBtn} onClick={() => onNavigate('TODAY')}>오늘</button>
    </div>
  );
}

function EventChip({ event }: any) {
  const t = event?.resource?.type;
  return (
    <div className={`${s.eventChip} ${t === 'rental' ? s.rental : s.purchase}`}>
      <span className={s.dot} />
      <span className={s.eventText}>{event.title}</span>
    </div>
  );
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

  const kbEvents = useHistoryEvents(purchaseHistory, rentalHistory);
  const rbcEvents = useRbcEvents(kbEvents);

  const [selected, setSelected] = useState<KbEvent | null>(null);

  return (
    <div className={s['page-layout']}>

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
            <div className={s['modal-footer']}></div>
          </div>
        </div>
      )}

      <div className={s['full-calendar']}>
        <Calendar
            localizer={localizer}
            culture="ko"
            views={['month']}
            defaultView="month"
            popup
            events={rbcEvents}
            startAccessor="start"
            endAccessor="end"
            className={s.calendarCard}
            components={{
              toolbar: Toolbar,
              event: EventChip,
            }}
            onSelectEvent={(e: RbcEvent) => {
            const r = e.resource ?? {};
            setSelected({
              title: e.title,
              start: e.start.toISOString().slice(0,10),
              end: e.end?.toISOString().slice(0,10),
              type: r.type,
              bookId: r.bookId,
              bookAuthor: r.bookAuthor,
              bookImageUrl: r.bookImageUrl,
            });
          }}
          eventPropGetter={(e: RbcEvent) => ({
            className: e.resource?.type === 'rental' ? s.rentalCell : s.purchaseCell
          })}
          messages={{
            today: '오늘', previous: '이전', next: '다음', month: '월',
            showMore: (n) => `+${n} 더보기`,
          }}
        />
        {(rbcEvents.length === 0) && (
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
