import { PATHS } from "../../routes/paths";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";

import TwoWayButton from "../../components/forms/TwoWayButton";
import FourLevelTabMenu from "../../components/navigation/FourLevelTabMenu";

import "react-toastify/dist/ReactToastify.css";
import s from "./QnAPage.module.css";

export default function QnAPage() {

  const nav = useNavigate();
  const location = useLocation();
  const { pathname, search, hash, state } = location;
  console.log(pathname);

  const isList =
    !!matchPath({ path: PATHS.listQnA, end: false }, pathname) ||
    !!matchPath({ path: `${PATHS.qna}/list`, end: true }, pathname) ||
    (pathname === PATHS.qna &&
      (new URLSearchParams(search).get("tab") === "list" ||
       hash === "#list" ||
       state?.tab === "list"));
  
  const active: "left" | "right" = isList ? "right" : "left";

  return (
     <main className={s["page-layout"]}>
      <div className={s["max-width-container"]}>
        <div className={s["page-title"]}>
          <span>고객센터</span>
        </div>

        <FourLevelTabMenu
          firstTabTitle="FAQ"
          firstTabPath={PATHS.faq}
          secondTabTitle="1:1 문의"
          secondTabPath={PATHS.qna}
          thirdTabTitle="공지사항"
          thirdTabPath={PATHS.notification}
          fourthTabTitle="이용약관"
          fourthTabPath={PATHS.policy}/>

        <div className={s["content-layout"]}>
          <TwoWayButton
            leftButtonContent="문의하기"
            rightButtonContent="문의 내역"
            active={active}
            onChange={side =>
              nav(side === "left" ? PATHS.registerQnA : PATHS.listQnA)}/>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
