import { useLoaderData, useSearchParams } from 'react-router-dom';
import type { QnaList } from '../../features/customer/types';
import s from './QnAListPage.module.css';
import ListAccordionItem from '../../components/display/ListAccordionItem';
import SimplePagination from '../../components/navigation/SimplePagination';

export default function QnAListPage() {

  const { content, size, totalItems } = useLoaderData() as QnaList;
  console.log(totalItems);
  const [, setSerchParam] = useSearchParams();

  const toDate = (value: string) => new Date(value).toLocaleString();

  return (
    <div className={s['subpage-layout']}>
      <div className={s['qna-list-wrapper']}>
        <div className={s['qna-list-items']}>
            {content.length === 0 ? (
              <div className={s['no-content']}>
                <span>등록된 문의가 존재하지 않습니다.</span>
              </div>
            ) : (
            content.map(qna => (
              <div className={s['qna-list-item']}>
                 <ListAccordionItem
                  state={qna.answeredAt ? "답변완료" : "답변대기중"}
                  title={qna.title}
                  date={toDate(qna.createdAt)}>
                    <div className={s['qna-dropdown-panel']}>
                      <div className={s['qna-question']}>
                        <span>{qna.content}</span>
                        <div className={s['qna-image-layout']}>
                          {qna.files.length > 0 &&                     
                            qna.files.map(f => (
                              <div className={s['qna-image-max']}>
                                <img
                                  className={s['qna-image']}
                                  src={f.fileUrl}/>
                              </div>                           
                          ))}
                        </div>
                      </div>
                      {qna.answeredAt && ( 
                       <div className={s['qna-answer']}>
                          <div className={s['qna-answer-content']}>
                            <span>{qna.answer}</span>
                          </div>
                          <div className={s['qna-answered-at']}>
                            <span>{toDate(qna.answeredAt)}</span>
                          </div>
                      </div>)}
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
    </div>
  );
}
