import { Outlet } from "react-router-dom";
import TwoLevelTabMenu from "../components/navigation/TwoLevelTabMenu";
import { PATHS } from "../routes/paths";

import s from './HomePage.module.css';

export default function HomePage() {
  return (
    /* !caution! this is a temporary code for guide */
    <main className={s['home-layout']}>
      <TwoLevelTabMenu
          leftTabTitle="상세보기"
          rightTabTitle="리뷰보기"
          leftTabPath={PATHS.homeSub1Page}
          rightTabPath={PATHS.homeSub2Page}
      />
      <Outlet />
    </main>
  );
}
