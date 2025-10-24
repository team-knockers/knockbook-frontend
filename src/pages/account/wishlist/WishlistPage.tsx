import { Outlet } from "react-router-dom";
import s from './WishlistPage.module.css'
import TwoLevelTabMenu from "../../../components/navigation/TwoLevelTabMenu";
import { PATHS } from "../../../routes/paths";

export default function WishlistPage() {
  return (
    <main className={s["page-layout"]}>
      <div className={s["max-width-container"]}>
        <TwoLevelTabMenu
          leftTabTitle="도서"
          leftTabPath={PATHS.bookWishlist}
          rightTabTitle="상품"
          rightTabPath={PATHS.productWishlist}/>
        <Outlet />
      </div>
    </main>
  );
}