import s from './InsightStatPage.module.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import PreferenceChart from '../../features/feeds/components/PreferenceChart';
import ReadingBarChart from '../../features/feeds/components/ReadingBarChart';
import { useRouteLoaderData } from 'react-router-dom';
import type { InsightLoaderData } from './InsightPage.loader';

type EventInput = {
  title: string;
  start: string;
  end?: string;
  type?: 'rental' | 'purchase';
};

export default function InsightStatPage() {

  // dummy data
  const events: EventInput[] = [
    { title: '가공범', start: '2025-10-06', end: '2025-10-11', type: 'rental' },
    { title: '가면산장 살인사건', start: '2025-10-10', type: 'purchase' },
    { title: '살인자의 기억법', start: '2025-10-12', type: 'purchase' },
    { title: '동물농장', start: '2025-10-15', end: '2025-10-22', type: 'rental' },
    { title: '가공범', start: '2025-10-18', type: 'purchase' },
  ];

  const data = useRouteLoaderData("insight") as InsightLoaderData;
  const categoryRatioStat = data?.categoryRatioStat ?? [];
  const readCountStat = data?.readCountStat ?? [];

  const hasCategory = categoryRatioStat.some(i => i.categoryReadRatio > 0);
  const hasReading  = readCountStat.some(d =>
    (d.readCountByMe ?? 0) > 0 || (d.avgReadCountByMember ?? 0) > 0
  );

  return (
    <div className={s['page-layout']}>
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
          events={events}
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
