import s from "./RentalHistoryPendingPage.module.css";

import bookImg from '../../assets/feed_slider_img1.png';

export default function RentalHistoryCompletedPage() {
  const rawRentalList = [
    {
      date: "2025.07.30",
      orderId: "R2276382",
      status: "상품 준비중",
      items: [
        { 
          id: 1,
          title: "시선으로부터", 
          author: "정세랑", 
          publisher: "문학동네", 
          imageUrl: bookImg 
        },
        { id: 2, 
          title: "닭갈비 장인되기", 
          author: "닭", 
          publisher: "문학동네", 
          imageUrl: bookImg 
        },
        { id: 3, 
          title: "책, 이게 뭐라고", 
          author: "장강명", 
          publisher: "arte", 
          imageUrl: bookImg 
        },
      ],
      shippingDate: "08/04(월)",
      rentalPeriod: 15,
    },
    {
      date: "2025.07.28",
      orderId: "R2276382",
      status: "상품 준비중",
      items: [
        { 
          id: 1,
          title: "거북목 탈출하기", 
          author: "김자라", 
          publisher: "최고출판", 
          imageUrl: bookImg 
        },
        { id: 2, 
          title: "닭갈비 장인되기", 
          author: "닭", 
          publisher: "문학동네", 
          imageUrl: bookImg 
        },
      ],
      shippingDate: "08/04(월)",
      rentalPeriod: 15,
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

          <div className={s["rental-info"]}>
            <div className={s["rental-row"]}>
              <span>발송 예정일</span>
              <span className={s["rental-day"]}>{group.shippingDate}</span>
            </div>
            <div className={s["rental-row"]}>
              <span>대여 기간</span>
              <span className={s["rental-day"]}>{group.rentalPeriod}일</span>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
