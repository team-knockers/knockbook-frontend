import { useState } from "react";
import { PATHS } from "../../routes/paths";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import type { FaqList } from '../../features/customer/types';

import OneWayButton from "../../components/forms/OneWayButton";
import FourLevelTabMenu from "../../components/navigation/FourLevelTabMenu";
import AccordionItem from "../../components/display/AccordionItem";
import s from "./FAQPage.module.css";
import SimplePagination from "../../components/navigation/SimplePagination";

export default function FAQPage() {

  const nav = useNavigate();
  const { content, size, totalItems } = useLoaderData() as FaqList;
  const [latestNoticeTitle, ] = useState("최근 공지가 없습니다.");
  const [latestNoticeUrl, ] = useState(PATHS.faq);
  const [, setSerchParam] = useSearchParams();

  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
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
        <div className={s['banner']}>
          <div className={s['banner-title']}>
            <span>무엇을 도와드릴까요?</span>
          </div>
          <div className={s['banner-description']}>
            <span>최대한 신속하고 친절하게<br/> 답변 드리겠습니다.</span>
          </div>
        </div>
        <div className={s['latest-notice']}>
          <div className={s['latest-notice-icon']}/>
          <button 
            className={s['latest-notice-title']}
            onClick={() => nav(latestNoticeUrl)}>
              {latestNoticeTitle}
          </button>
        </div>
        <div className={s['faq-list-wrapper']}>
          <div className={s['faq-list-title']}>
            <span>자주 묻는 질문</span>
          </div>
          <div className={s['faq-list-items']}>
            {content.length === 0 ? (
              <div className={s['no-content']}>
                <span>등록된 FAQ가 존재하지 않습니다.</span>
              </div>
            ) : (
              content.map(faq => (
                <AccordionItem
                  id={faq.id}
                  title={faq.question}>
                    <div className={s['faq-answer']}>
                      <span>{faq.answer}</span>
                    </div>
                </AccordionItem>  
              ))
            )}
          </div>
          <SimplePagination
            totalItems={totalItems}
            size={size}
            onCurrentPageChange={page => setSerchParam({ 
              page: String(page)
            })}
          />
        </div>
        <div className={s['qna-guide-wrapper']}>
            <div className={s['qna-guide-description']}>
              <span>
                찾으시는 내용이 없으신가요? <br />
                1:1 문의하기 또는 채팅 상담하기를 이용해주세요.
              </span>
            </div>
            <div className={s['qna-guide-button-wrapper']}>
              <OneWayButton
                content="1:1 문의하기"
                responsiveType="fixed"
                widthSizeType="md"
                heightSizeType="md"
                colorType="outline"
                onClick={() => {/* TODO */}} />
              <OneWayButton
                content="채팅 상담하기"
                responsiveType="fixed"
                widthSizeType="md"
                heightSizeType="md"
                colorType="outline"
                onClick={() => {/* TODO */}} />
            </div>            
        </div>
        <div className={s['customer-center-info']}>
          <span>
            고객센터 031-0000-0000 <br/>
            평일 09:00 ~ 18:00 <br/>
            점심시간 13:00 ~ 14:00 <br/>
            주말 / 공휴일 Day off
          </span>
        </div>
      </div>
    </main>
  );
}
