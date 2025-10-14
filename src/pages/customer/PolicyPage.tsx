import { PATHS } from "../../routes/paths";
import FourLevelTabMenu from "../../components/navigation/FourLevelTabMenu";
import s from "./PolicyPage.module.css";
import { useLoaderData } from "react-router-dom";
import type { PolicyDoc } from "../../features/customer/types";

export default function PolicyPage() {

  const { tos, privacy } = useLoaderData() as {
    tos: PolicyDoc;
    privacy: PolicyDoc;
  };

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
        fourthTabPath={PATHS.policy}/>
      <div className={s['page-content']}>
        <div className={s['tos-wrapper']}>
          <div className={s['tos-title']}>
            <span>{tos.serviceName} 이용약관</span>
          </div>
          {tos.clauses.map(c => (
            <section key={c.id}>
              <div className={s['clause-title']}>
                <span>{c.id}. {c.title}</span>
              </div>
              {c.body.map((p, i) => (
                <div
                  className={s['clause-content']}
                  key={i}>
                    <span>{p}</span>
                </div>
              ))}
            </section>
          ))}
        </div>
        <div className={s['privacy-wrapper']}>
          <div className={s['privacy-title']}>
            <span>{tos.serviceName} 개인정보처리방침</span>
          </div>
          {privacy.clauses.map(c => (
            <section key={c.id}>
              <div className={s['clause-title']}>
                <span>{c.id}. {c.title}</span>
              </div>
              {c.body.map((p, i) => (
                <div
                  className={s['clause-content']} 
                  key={i}>
                    <span>{p}</span>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
