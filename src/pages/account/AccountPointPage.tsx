import FourLevelTabMenu from "../../components/navigation/FourLevelTabMenu";
import { PATHS } from "../../routes/paths";
import { Outlet } from "react-router-dom";
import s from './AccountPointPage.module.css';

export default function AccountPointPage() {
  
  // dummy date
  const totalPoint = 3992;
  
  return (
    <main className={s["page-layout"]}>
      <div className={s["point-summary"]}>
        <h2 className={s["title"]}>적립 포인트</h2>
        <p className={s["amount"]}>{totalPoint.toLocaleString()}p</p>
      </div>
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