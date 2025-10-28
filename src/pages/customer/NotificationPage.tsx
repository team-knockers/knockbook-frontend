import { PATHS } from "../../routes/paths";
import type { NotificationList } from "../../features/customer/types";
import { useLoaderData, useSearchParams } from "react-router-dom";

import FourLevelTabMenu from "../../components/navigation/FourLevelTabMenu";
import s from "./NotificationPage.module.css";
import ListAccordionItem from "../../components/display/ListAccordionItem";
import SimplePagination from "../../components/navigation/SimplePagination";

export default function NotificationPage() {

  const { content, size, totalItems } = useLoaderData() as NotificationList;
  const [searchParam, setSerchParam] = useSearchParams();
  const toDate = (value: string) => new Date(value).toLocaleString();

  const currentPage = searchParam.get("page") ?? "1";

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
      <div className={s['list-wrapper']}>
        <div className={s['list-items']} key={currentPage}>
            {content.length === 0 ? (
              <div className={s['no-content']}>
                <span>등록된 문의가 존재하지 않습니다.</span>
              </div>
            ) : (
            content.map(noti => (
              <div className={s['list-item']}>
                <ListAccordionItem
                state={"공지"}
                title={noti.title}
                date={toDate(noti.createdAt)}>
                  <div className={s['dropdown-panel']}>
                    <div className={s['noti-content']}>
                      <span>{noti.content}</span>
                    </div>
                  </div>
                </ListAccordionItem>
              </div>
            ))
          )}
        </div>
        <SimplePagination
          totalItems={totalItems}
          size={size}
          onCurrentPageChange={page => setSerchParam({ 
            page: String(page)
        })}/>
      </div>
    </main>
  );
}
