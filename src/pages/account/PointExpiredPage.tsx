import s from "./PointExpiredPage.module.css";

type PointItem = {
  id: number;
  date: string;
  year: number;
  type: string;
  title: string;
  orderId: string;
  expireDate?: string;
  amount: number;
};

export default function PointExpiredPage() {
  const pointList: PointItem[] = [
    {
      id: 1,
      date: "05.14",
      year: 2025,
      type: "주문 적립",
      title: "날씨가 좋으면 찾아가겠어요",
      orderId: "ORD20250511-0365156",
      expireDate: "2030.05.13 소멸예정",
      amount: 1281,
    },
    {
      id: 2,
      date: "05.13",
      year: 2025,
      type: "주문 적립",
      title: "북메이트 북커버백-화이트 M(일반도서)",
      orderId: "ORD20250504-6912245",
      expireDate: "2030.05.13 소멸예정",
      amount: 2164,
    },
    {
      id: 3,
      date: "05.04",
      year: 2025,
      type: "리뷰 적립",
      title: "북메이트 북커버백-실버 M(일반도서)",
      orderId: "ORD20250504-6912245",
      expireDate: "2030.05.13 소멸예정",
      amount: 4407,
    },
    {
      id: 4,
      date: "06.29",
      year: 2024,
      type: "주문 적립",
      title: "양면의 조개껍데기",
      orderId: "ORD20240611-7547458",
      expireDate: "2029.06.28 소멸예정",
      amount: 503,
    },
    {
      id: 5,
      date: "06.12",
      year: 2024,
      type: "리뷰 적립",
      title: "희망찬 노란 튤립 문진",
      orderId: "ORD20240611-7547458",
      expireDate: "2030.05.13 소멸예정",
      amount: 1500,
    },
    {
      id: 6,
      date: "06.10",
      year: 2024,
      type: "리뷰 적립",
      title: "여름숲 유리 문진",
      orderId: "ORD20240611-7547458",
      expireDate: "2030.05.13 소멸예정",
      amount: 2500,
    },
    {
      id: 7,
      date: "06.08",
      year: 2023,
      type: "주문 적립",
      title: "비주류 프로젝트",
      orderId: "ORD20240611-7547458",
      expireDate: "2030.05.13 소멸예정",
      amount: 1500,
    },
    {
      id: 8,
      date: "06.02",
      year: 2023,
      type: "주문 적립",
      title: "살아남은 기획자",
      orderId: "ORD20240611-7547458",
      expireDate: "2030.05.13 소멸예정",
      amount: 1500,
    },
  ];

  // Automatic grouping by year
  const groupedByYear = pointList.reduce<Record<number, PointItem[]>>(
    (acc, item) => {
      if (!acc[item.year]) acc[item.year] = [];
      acc[item.year].push(item);
      return acc;
    },
    {}
  );

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  function Pointlist({
    date,
    type,
    title,
    orderId,
    expireDate,
    amount,
  }: Omit<PointItem, "id" | "year">) {
    const isPlus = amount > 0;

    return (
      <div className={s["list-item"]}>
        <div className={s["date"]}>{date}</div>
        <div className={s["content"]}>
          <div className={s["type"]}>{type}</div>
          <div className={s["title"]}>{title}</div>
          <div className={s["order-id"]}>{orderId}</div>
          {expireDate && <div className={s["expire"]}>{expireDate}</div>}
        </div>
        <div className={`${s["amount"]} ${isPlus ? s["plus"] : s["minus"]}`}>
          {isPlus ? `+${amount.toLocaleString()}` : amount.toLocaleString()}
        </div>
      </div>
    );
  }

  return (
    <main className={s["page-layout"]}>
      <div className={s["point-list-section"]}>
        {sortedYears.map((year) => (
          <div key={year} className={s["year-group"]}>
            <div className={s["year-title"]}>{year}</div>
            <div className={s["point-list"]}>
              {groupedByYear[year].map((p) => (
                <Pointlist key={p.id} {...p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
