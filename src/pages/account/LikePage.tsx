import TwoLevelTabMenu from "../../components/navigation/TwoLevelTabMenu";
import { PATHS } from '../../routes/paths';
import { Outlet } from "react-router-dom";
import s from './LikePage.module.css'

export default function LikePage() {
  return (
    <main className={s["page-layout"]}>
      <TwoLevelTabMenu
        leftTabTitle="도서"
        leftTabPath={PATHS.likeBook}
        rightTabTitle="상품"
        rightTabPath={PATHS.likeProduct}/>
      <Outlet />
    </main>
  );
}