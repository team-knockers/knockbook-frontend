import FourLevelTabMenu from "../../components/navigation/FourLevelTabMenu";
import { PATHS } from "../../routes/paths";
import { Outlet } from "react-router-dom";
import s from './PointPage.module.css';

export default function PointPage() {
  
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
        firstTabPath={PATHS.pointAll}
        secondTabTitle="적립"
        secondTabPath={PATHS.pointEarned}
        thirdTabTitle="사용"
        thirdTabPath={PATHS.pointUsed}
        fourthTabTitle="소멸"
        fourthTabPath={PATHS.pointExpired}/>
      <Outlet />
    </main>
  );
}