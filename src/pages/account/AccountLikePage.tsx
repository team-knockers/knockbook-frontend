import TwoLevelTabMenu from "../../components/navigation/TwoLevelTabMenu";
import { PATHS } from '../../routes/paths';
import { Outlet } from "react-router-dom";
import s from './AccountLikePage.module.css'

export default function AccountLikePage() {
  return (
    <main className={s["page-layout"]}>
      <TwoLevelTabMenu
        leftTabTitle="도서"
        leftTabPath={PATHS.accountLikeBook}
        rightTabTitle="상품"
        rightTabPath={PATHS.accountLikeProduct}/>
      <Outlet />
    </main>
  );
}