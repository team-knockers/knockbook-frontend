import { Outlet, useFetcher, useLoaderData } from "react-router-dom";
import s from './PointTransactionsPage.module.css';
import type { PointTransactionsPageLoaderData } from "./PointTransactionsPage.loader";
import { formatPoint } from "../../../features/purchase/utils/formatter";
import ThreeLevelTabMenu from "../../../components/navigation/ThreeLevelTabMenu";
import { PATHS } from "../../../routes/paths";

export default function PointPage() {
  
  const initial = useLoaderData() as PointTransactionsPageLoaderData;
  const fetcher = useFetcher<PointTransactionsPageLoaderData>();
  const pointBalance = fetcher.data?.pointBalance ?? initial.pointBalance;
  
  return (
    <main className={s["page-layout"]}>
      <div className={s["point-summary"]}>
        <h2 className={s["title"]}>적립 포인트</h2>
        <p className={s["amount"]}>{formatPoint(pointBalance)}</p>
      </div>
      <ThreeLevelTabMenu
        leftTabTitle="전체"
        leftTabPath={PATHS.pointTransactionsAll}
        centerTabTitle="적립"
        centerTabPath={PATHS.pointTransactionsEarned}
        rightTabTitle="사용"
        rightTabPath={PATHS.pointTransactionsUsed}/>
      <Outlet />
    </main>
  );
}