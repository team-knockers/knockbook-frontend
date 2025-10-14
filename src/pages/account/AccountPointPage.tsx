import FourLevelTabMenu from "../../components/navigation/FourLevelTabMenu";
import { PATHS } from "../../routes/paths";
import { Outlet } from "react-router-dom";

export default function AccountPointPage() {
  return (
    <main>
      <div>포인트</div>
      <FourLevelTabMenu
        firstTabTitle="전체"
        firstTabPath={PATHS.accountPointAll}
        secondTabTitle="적립"
        secondTabPath={PATHS.accountPointEarned}
        thirdTabTitle="사용"
        thirdTabPath={PATHS.accountPointUsed}
        fourthTabTitle="소멸"
        fourthTabPath={PATHS.accountPointExpired}/>
      <Outlet />
    </main>
  );
}