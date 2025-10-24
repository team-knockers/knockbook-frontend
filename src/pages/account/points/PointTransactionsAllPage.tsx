import { useMemo } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import s from "./PointTransactionsAllPage.module.css";
import type { PointTransactionsAllPageLoaderData } from "./PointTransactionsAllPage.loader";
import type { PointTransaction } from "../../../features/purchase/type";

const fmtAmt = (n: number) =>
  n > 0 ? `+${n.toLocaleString("ko-KR")}` : n.toLocaleString("ko-KR");

export default function PointTransactioinsAllPage() {
  const initial = useLoaderData() as PointTransactionsAllPageLoaderData;
  const fetcher = useFetcher<PointTransactionsAllPageLoaderData>();
  const txs = fetcher.data?.pointTransactions ?? initial.pointTransactions;

  const grouped = useMemo(() => {
    const byMonth = txs.reduce<Record<string, PointTransaction[]>>((acc, tx) => {
      const d = new Date(tx.createdAt);
      const key = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
      (acc[key] ??= []).push(tx);
      return acc;
    }, {});
    for (const m of Object.keys(byMonth)) {
      byMonth[m].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    const months = Object.keys(byMonth).sort(
      (a, b) => new Date(b + ".01").getTime() - new Date(a + ".01").getTime()
    );
    return { byMonth, months };
  }, [txs]);

  const kindLabel = (k: PointTransaction["kind"]) =>
    k === "EARN" ? "주문 적립" : k === "SPEND" ? "주문 사용" : k;

   return (
    <div className={s["list-layout"]}>
      <div className={s["max-width-container"]}>
        {txs.length === 0 ? (
          <div className={s["empty-message"]}>
            <span>포인트 내역이 없습니다.</span>
          </div>
        ) : (
          grouped.months.map((month) => (
            <div key={month} className={s["month-group"]}>
              <div className={s["group-title"]}>{month}</div>

              <div className={s["group-items"]}>
                {grouped.byMonth[month].map((tx) => {
                  const d = new Date(tx.createdAt);
                  const date = `${String(d.getMonth() + 1).padStart(2, "0")}.${String(
                    d.getDate()
                  ).padStart(2, "0")}`;
                  const amount = Number(tx.amountSigned);

                  return (
                    <div key={tx.id} className={s["group-item"]}>
                      <div className={s["group-item-left"]}>
                        <div className={s["point-updated-at"]}>{date}</div>
                        <div className={s["point-details"]}>
                          <div className={s["point-type"]}>{kindLabel(tx.kind)}</div>
                          <div className={s["point-order"]}>{tx.orderNo}</div>
                        </div>
                      </div>
                      <div className={s["point-amount"]}>{fmtAmt(amount)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
