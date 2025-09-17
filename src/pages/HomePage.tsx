import { Outlet } from "react-router-dom";
import { PATHS } from "../routes/paths";

import TwoLevelTabMenu from "../components/navigation/TwoLevelTabMenu";
import ThreeLevelTabMenu from "../components/navigation/ThreeLevelTabMenu";

import s from './HomePage.module.css';


export default function HomePage() {
  return (
    /* !caution! this is a temporary code for guide */
    <main className={s['home-layout']}>
      <TwoLevelTabMenu
        leftTabTitle="상세정보"
        rightTabTitle="리뷰"
        leftTabPath={PATHS.homeSub1Page}
        rightTabPath={PATHS.homeSub2Page}/>
      <ThreeLevelTabMenu
        leftTabTitle="상품설명"
        centerTabTitle="리뷰"
        rightTabTitle="Q&A"
        leftTabPath={PATHS.homeSub3Page}
        centerTabPath={PATHS.homeSub4Page}
        rightTabPath={PATHS.homeSub5Page}/>
      <Outlet />
    </main>
  );
}
