import { PATHS } from "../../routes/paths";
import { Outlet, useNavigate } from "react-router-dom";

import TwoWayButton from "../../components/forms/TwoWayButton";
import FourLevelTabMenu from "../../components/navigation/FourLevelTabMenu";

import "react-toastify/dist/ReactToastify.css";
import s from "./QnAPage.module.css";

export default function QnARegisterPage() {

  const nav = useNavigate();

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
            onChange={side => nav(side === "left" ? 
            PATHS.registerQnA : PATHS.listQnA)}/>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
