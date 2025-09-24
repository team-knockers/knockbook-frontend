import { PATHS } from "../../routes/paths";
import FourLevelTabMenu from "../../components/navigation/FourLevelTabMenu";
import s from "./PolicyPage.module.css";

export default function PolicyPage() {
  return (
     <main className={s['page-layout']}>
      <div className={s['page-title']}>
        <span>고객센터</span>
      </div>
      <FourLevelTabMenu
        firstTabTitle='FAQ'
        firstTabPath={PATHS.faq}
        secondTabTitle='1:1 문의'
        secondTabPath={PATHS.qna}
        thirdTabTitle='공지사항'
        thirdTabPath={PATHS.notification}
        fourthTabTitle='이용약관'
        fourthTabPath={PATHS.poicy}/>
    </main>
  );
}
