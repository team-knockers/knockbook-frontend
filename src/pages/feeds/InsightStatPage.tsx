import s from './InsightStatPage.module.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';

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
      {/* TODO */}
    </div>
    <div className={s['insight-stat-reading']}>
      <p>독서 현황</p>
      {/* TODO */}
    </div>
  </div>
  );
}
