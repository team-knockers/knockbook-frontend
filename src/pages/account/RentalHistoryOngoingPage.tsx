import s from "./RentalHistoryOngoingPage.module.css";
import bookImg from "../../assets/feed_slider_img1.png";
import OneWayButton from "../../components/forms/OneWayButton";

export default function RentalHistoryOngoingPage() {
  const rawRentalList = [
    {
      date: "2025.07.20",
      orderId: "R2200082",
      items: [
        {
          id: 1,
          title: "체크메이트 101",
          author: "체스킴",
          publisher: "안녕출판",
          imageUrl: bookImg,
        },
        {
          id: 2,
          title: "오늘부터 산수왕",
          author: "김범지",
          publisher: "파이출판",
          imageUrl: bookImg,
        },
        {
          id: 3,
          title: "집으로",
          author: "김감이",
          publisher: "시골출판",
          imageUrl: bookImg,
        },
      ],
      returnDue: "7/27(수)",
      remainingDays: 4,
    },
    {
      date: "2025.07.20",
      orderId: "R2200082",
      items: [
        {
          id: 1,
          title: "체크메이트 101",
          author: "체스킴",
          publisher: "안녕출판",
          imageUrl: bookImg,
        },
        {
          id: 2,
          title: "오늘부터 산수왕",
          author: "김범지",
          publisher: "파이출판",
          imageUrl: bookImg,
        },
      ],
      returnDue: "7/27(수)",
      remainingDays: 4,
    },
  ];

  // date descending
  const rentalList = [...rawRentalList].sort(
    (a, b) =>
      new Date(b.date.replace(/\./g, "-")).getTime() -
      new Date(a.date.replace(/\./g, "-")).getTime()
  );

  return (
    <main className={s["page-layout"]}>
      {rentalList.map((group) => (
        <div key={group.date} className={s["rental-group"]}>
          <div className={s["rental-header"]}>
            <div className={s["rental-date"]}>
              <strong>{group.date}</strong> ({group.orderId})
            </div>
            <button className={s["details-button"]}>상세보기 &gt;</button>
          </div>

          <div className={s["book-list"]}>
            {group.items.map((item) => (
              <div key={item.id} className={s["book-item"]}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={s["book-image"]}
                />
                <div className={s["book-info"]}>
                  <div className={s["book-title"]}>{item.title}</div>
                  <div className={s["book-meta"]}>
                    {item.author} · {item.publisher}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={s["return-info"]}>
            <div className={s["return-row"]}>
              <span>반납 예정일</span>
              <div className={s["return-date"]}>
                <span className={s["return-dday"]}>D-{group.remainingDays}</span>
                <span className={s["return-day"]}>{group.returnDue}</span>
              </div>
            </div>
            <div className={s["return-button"]}>
              <OneWayButton
                content="반납 신청하기"
                responsiveType="fluid"
                widthSizeType="sm"
                heightSizeType="lg"
                colorType="dark"
                onClick={() =>console.log("반납 신청 완료")}
              /></div>
          </div>
        </div>
      ))}
    </main>
  );
}
