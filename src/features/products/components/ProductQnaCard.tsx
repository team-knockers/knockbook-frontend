import styles from './styles/ProductQnaCard.module.css';
import type { ProductInquiry } from '../types';
import { formatKstDate } from '../util';

type Props =  {
  inquiry: ProductInquiry // Single QnA item data
  isOpen: boolean;  // Expanded state (from parent)
  onToggle: (qnaId: string) => void;  // Toggle handler
};

export default function ProductQnaCard({ inquiry, isOpen, onToggle }: Props) {
  const statusLabel = inquiry.status === 'ANSWERED' ? '답변완료' : '답변대기';

  return (
    <>
      {/* Header row (click to toggle) */}
      <button 
        type="button"
        className={styles['qna-card']}
        onClick={() => { onToggle(inquiry.inquiryId); }}
      >
        <div className={styles['qna-meta']}>
          <div className={styles['qna-meta-left']}>
            <div>{statusLabel}</div>
          </div>
          <div className={styles['qna-meta-right']}>
            <span>{inquiry.displayName}</span>
            <span>|</span>
            <span>{formatKstDate(inquiry.createdAt)}</span>
          </div>
        </div>
        <div className={styles['qna-content']}>{inquiry.title}</div>
      </button>

      {/* Render details only when open AND answered */}
      {isOpen && (
        <div className={styles['qna-detail']}>
          <div className={styles['qna-detail-inner']}>
            <div className={styles['qna-detail-question']}>
              <span className={styles['qna-detail-label']}>Q</span>
              <span className={styles['qna-detail-text']}>{inquiry.questionBody}</span>
            </div>
            {inquiry.status === 'ANSWERED' && (
            <div className={styles['qna-detail-answer']}>
              <div className={styles['qna-detail-date']}>
                <span>{formatKstDate(inquiry.answeredAt)}</span>
              </div>
              <div className={styles['qna-detail-answer-body']}>
                <span className={styles['qna-detail-label']}>A</span>
                <span className={styles['qna-detail-text']}>{inquiry.answerBody}</span>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
