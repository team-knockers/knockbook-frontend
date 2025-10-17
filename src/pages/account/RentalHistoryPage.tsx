import { Outlet } from "react-router-dom";
import ThreeLevelTabMenu from "../../components/navigation/ThreeLevelTabMenu";
import { PATHS } from "../../routes/paths";

export default function RentalsHistoryPage() {
  return (
    <main>
      대여 내역
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
