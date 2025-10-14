import s from './InsightStatPage.module.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import PreferenceChart from '../../features/feeds/components/PreferenceChart';
import ReadingBarChart from '../../features/feeds/components/ReadingBarChart';

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

  const preferenceData = [
    { bookCategory: "추리", percentage: 57.7 },
    { bookCategory: "에세이", percentage: 20.7 },
    { bookCategory: "스릴러", percentage: 14.0 },
    { bookCategory: "자기계발", percentage: 7.6 }
  ];

  const readingRateData = [
    { month: '4월', "나의 독서량": 4, "회원 평균": 20 },
    { month: '5월', "나의 독서량": 4, "회원 평균": 20 },
    { month: '6월', "나의 독서량": 12, "회원 평균": 30 },
    { month: '7월', "나의 독서량": 20, "회원 평균": 10 },
    { month: '8월', "나의 독서량": 2, "회원 평균": 36 }
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
      <div className={s['insight-stat-book-chart']}>
        <PreferenceChart
          preferenceData={preferenceData}
          outerRadius={70}
          innerRadius={35}/>
      </div>
    </div>
    <div className={s['insight-stat-reading']}>
      <p>독서 현황</p>
      <div className={s['insight-stat-reading-chart']}>
        <ReadingBarChart
          readingRateData={readingRateData}
        />
      </div>
    </div>
  </div>
  );
}
