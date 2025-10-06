import styles from './styles/ProductQnaCard.module.css';
import type { QnaItem } from '../types';

type Props =  {
  item: QnaItem; // Single QnA item data
  isOpen: boolean;  // Expanded state (from parent)
  onToggle: (qnaId: string) => void;  // Toggle handler
};

export default function ProductQnaCard({ item, isOpen, onToggle }: Props) {
  const statusLabel = item.status === 'ANSWERED' ? '답변완료' : '답변대기';

  return (
    <>
      {/* Header row (click to toggle) */}
      <button 
        type="button"
        className={styles['qna-card']}
        onClick={() => { onToggle(item.qnaId); }}
      >
        <div className={styles['qna-meta']}>
          <div className={styles['qna-meta-left']}>
            <div>{statusLabel}</div>
          </div>
          <div className={styles['qna-meta-right']}>
            <span>{item.userName}</span>
            <span>|</span>
            <span>{item.createdAt}</span>
          </div>
        </div>
        <div className={styles['qna-content']}>{item.summary}</div>
      </button>

      {/* Render details only when open AND answered */}
      {isOpen && item.status === 'ANSWERED' && (
        <div className={styles['qna-detail']}>
          <div className={styles['qna-detail-inner']}>
            <div className={styles['qna-detail-question']}>
              <span className={styles['qna-detail-label']}>Q</span>
              <span className={styles['qna-detail-text']}>{item.questionBody}</span>
            </div>
            <div className={styles['qna-detail-answer']}>
              <div className={styles['qna-detail-date']}>
                <span>{item.answeredAt}</span>
              </div>
              <div className={styles['qna-detail-answer-body']}>
                <span className={styles['qna-detail-label']}>A</span>
                <span className={styles['qna-detail-text']}>{item.answerBody}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
