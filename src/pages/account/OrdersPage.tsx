import s from "./OrdersPage.module.css";
import { useState } from "react";
import OneWayButton from '../../components/forms/OneWayButton';

import bookImg from '../../assets/feed_slider_img1.png';
import productImg from '../../assets/feed_slider_img2.png';

type OrderItem = {
  id: number;
  imageUrl: string;
  title: string;
  quantity: number;
  price: number;
  status: "배송 중" | "배송 완료" | "취소/반품";
  isReviewed?: boolean;
};

type OrderGroup = {
  date: string;
  orderId: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderGroup[]>([
    {
      date: "2025.07.30",
      orderId: "06739172",
      items: [
        { id: 1, imageUrl: bookImg , title: "은방울꽃", quantity: 1, price: 16000, status: "배송 중", isReviewed: false },
        { id: 2, imageUrl: bookImg, title: "닭갈비 장인되기", quantity: 1, price: 15000, status: "배송 중" },
        { id: 2, imageUrl: productImg, title: "북스탠드", quantity: 1, price: 15000, status: "배송 중" },
      ],
    },
    {
      date: "2025.07.28",
      orderId: "06739102",
      items: [
        { id: 3, imageUrl: bookImg, title: "부자되기 프로젝트", quantity: 1, price: 23000, status: "배송 완료", isReviewed: false },
        { id: 3, imageUrl: bookImg, title: "부자되기 프로젝트", quantity: 1, price: 23000, status: "배송 완료", isReviewed: true },
      ],
    },
    {
      date: "2025.06.20",
      orderId: "06739102",
      items: [
        { id: 4, imageUrl: bookImg, title: "돈되는 주식, 돈 안되는 주식", quantity: 1, price: 23000, status: "배송 완료", isReviewed: true },
        { id: 5, imageUrl: productImg, title: "북스탠드", quantity: 1, price: 23000, status: "취소/반품" },
      ],
    },
  ]);

  const handleReviewClick = (id: number) => {
    setOrders(prev =>
      prev.map(group => ({
        ...group,
        items: group.items.map(item =>
          item.id === id ? { ...item, isReviewed: true } : item
        ),
      }))
    );
  };

  // Number of book or products by status
  const getStatusCount = (status: "배송 중" | "배송 완료" | "취소/반품") => {
    return orders.reduce((acc, group) => {
      return acc + group.items.filter(item => item.status === status).length;
    }, 0);
  };

  return (
    <main className={s["page-layout"]}>
      <div className={s["status-summary"]}>
        <div>
          배송 중 <span>{getStatusCount("배송 중")}</span>
        </div>
        <div>
          배송 완료 <span>{getStatusCount("배송 완료")}</span>
        </div>
        <div>
          취소/반품 <span>{getStatusCount("취소/반품")}</span>
        </div>
      </div>

      <div className={s["order-list-section"]}>
        {orders
          .sort((a, b) => (a.date < b.date ? 1 : -1)) // descending order
          .map(group => (
            <div key={group.date} className={s["date-group"]}>
              <div className={s["date-title"]}>
                <span><strong>{group.date}</strong>({group.orderId})</span> 
                <button className={s["view-details-btn"]}>상세보기 &gt;</button>
              </div>
              <div className={s["order-list"]}>
                {group.items.map(item => (
                  <div key={item.id} className={s["order-item"]}>
                    <div className={s["order-image"]}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                        />
                      </div>
                    <div className={s["order-info"]}>
                      <div className={s["status-layor"]}>
                        <div className={s["status"]}>{item.status}</div>
                      </div>                 
                      <div className={s["title"]}>{item.title}</div>
                      <div className={s["quantity"]}>수량: {item.quantity}</div>
                      <div className={s["price"]}>{item.price.toLocaleString()}원</div>
                    </div>
                    {item.status === "배송 완료" && (
                      <div className={s["review-btn"]}>
                        {!item.isReviewed ? (
                          <OneWayButton
                            content="리뷰작성"
                            responsiveType="fluid"
                            widthSizeType="sm"
                            heightSizeType="sm"
                            colorType="dark"
                            onClick={() => handleReviewClick(item.id)}
                          />
                        ) : (
                          <OneWayButton
                            content="리뷰작성 완료"
                            responsiveType="fluid"
                            widthSizeType="sm"
                            heightSizeType="sm"
                            colorType="outline"
                            onClick={() => console.log(`${item.title} 리뷰 작성 완료`)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
