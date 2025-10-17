import s from "./RentalHistoryCompletedPage.module.css";

import bookImg from '../../assets/feed_slider_img1.png';

export default function RentalHistoryCompletedPage() {
  
  // dummy date
  const rawRentalList = [
    {
      date: "2025.07.10",
      orderId: "R2200082",
      status: "수거중",
      items: [
        {
          id: 1,
          title: "닭갈비 장인되기",
          author: "닭",
          publisher: "문학동네",
          imageUrl: bookImg,
        },
        {
          id: 2,
          title: "책, 이게 뭐라고",
          author: "장강명",
          publisher: "arte",
          imageUrl: bookImg,
        },
        {
          id: 3,
          title: "거북목 탈출하기",
          author: "김자라",
          publisher: "최고출판",
          imageUrl: bookImg,
        },
      ],
      returnApplyDate: "07/20 (월)",
      pickupDate: "07/21 (화)",
    },
    {
      date: "2025.06.23",
      orderId: "R2200082",
      status: "검수중",
      items: [
        {
          id: 4,
          title: "냠냠",
          author: "쪼양",
          publisher: "맛나출판",
          imageUrl: bookImg,
        },
        {
          id: 5,
          title: "1달 후 원어민",
          author: "김제니",
          publisher: "뉴욕출판",
          imageUrl: bookImg,
        },
        {
          id: 6,
          title: "거북목 탈출하기",
          author: "김자라",
          publisher: "최고출판",
          imageUrl: bookImg,
        },
      ],
      returnApplyDate: "06/30 (수)",
      pickupDate: "07/01 (목)",
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
          <div className={s["rental-date-layer"]}>
            <div className={s["rental-header"]}>
              <div className={s["rental-date"]}>
                <span><strong>{group.date}</strong>({group.orderId})</span>
              </div>
                <button className={s["details-button"]}>상세보기 &gt;</button>
            </div>
            <div className={s["rental-status"]}>{group.status}</div>
          </div>

          <div className={s["book-list"]}>
            {group.items.map((item) => (
              <div key={item.id} className={s["book-item"]}>
                <img src={item.imageUrl} alt={item.title} className={s["book-image"]} />
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
              <span>반납 신청일</span>
              <span className={s["return-day"]}>{group.returnApplyDate}</span>
            </div>
            <div className={s["return-row"]}>
              <span>수거 예정일</span>
              <span className={s["return-day"]}>{group.pickupDate}</span>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
