import { Outlet } from "react-router-dom";
import ThreeLevelTabMenu from "../../components/navigation/ThreeLevelTabMenu";
import { PATHS } from "../../routes/paths";
import s from "./RentalHistoryPage.module.css";

export default function RentalHistoryPage() {
  return (
     <main className={s["page-layout"]}>
      <ThreeLevelTabMenu
        leftTabTitle="배송 준비"
        leftTabPath={PATHS.rentalPending}
        centerTabTitle="대여 중"
        centerTabPath={PATHS.rentalOngoing}
        rightTabTitle="반납"
        rightTabPath={PATHS.rentalCompleted}/>
      <Outlet />
    </main>
  );
}
