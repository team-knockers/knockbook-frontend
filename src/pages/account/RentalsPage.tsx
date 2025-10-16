import { Outlet } from "react-router-dom";
import ThreeLevelTabMenu from "../../components/navigation/ThreeLevelTabMenu";
import { PATHS } from "../../routes/paths";

export default function RentalsPage() {
  return (
    <main>
      대여 내역
      <ThreeLevelTabMenu
        leftTabTitle="배송 중"
        leftTabPath={PATHS.rentalsReady}
        centerTabTitle="배송 완료"
        centerTabPath={PATHS.rentalsRented}
        rightTabTitle="취소/반품"
        rightTabPath={PATHS.rentalsReturned}/>
      <Outlet />
    </main>
  );
}
