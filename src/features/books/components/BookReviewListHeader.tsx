import { IoIosArrowDropdown } from 'react-icons/io';
import styles from './styles/BookReviewListHeader.module.css';
import { reviewsSortOptions, transactionOptions } from '../types';
import { useState } from 'react';
import { IoCheckbox, IoSquareOutline } from 'react-icons/io5';

type BookReviewListHeaderProps = {
  totalCount: number;
  selectedTransaction: string;
  selectedSort: string;
  isMyMbtiOnly: boolean;   
  onTransactionChange: (transactionValue: string) => void;
  onSortChange: (sortValue: string) => void;
  onMbtiFilterChange: (isMyMbtiOnly: boolean) => void;
};

export default function BookReviewListHeader({
  totalCount,
  selectedTransaction,
  selectedSort,
  isMyMbtiOnly,
  onTransactionChange,
  onSortChange,
  onMbtiFilterChange
}: BookReviewListHeaderProps) {

  const [isMyMbtiOnlyChecked, setIsMyMbtiOnlyChecked] = useState(isMyMbtiOnly);

  const handleMyMbtiToggle = () => {
    setIsMyMbtiOnlyChecked(prev => {
      const next = !prev;
      onMbtiFilterChange?.(next); // notify parent if provided
      return next;
    });
  }

  const handleTransactionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTransactionChange(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <div className={styles['review-list-header-container']}>

      <button
        className={styles['my-mbti-filter']}
        onClick={handleMyMbtiToggle}
        aria-pressed={isMyMbtiOnlyChecked}
        aria-label={isMyMbtiOnlyChecked ? '내 MBTI만 보기, 활성화됨' : '내 MBTI만 보기, 비활성화됨'}
      >
        {isMyMbtiOnlyChecked ? (
          <IoCheckbox className={styles['mbti-icon-checked']}/>
        ) : (
          <IoSquareOutline className={styles['mbti-icon-unchecked']}/>
        )}
        <span className={styles['filter-text']}>내 MBTI만 보기</span>
      </button>

      <div className={styles['review-list-header']}>
        <div className={styles['transaction-section']}>
          <div className={styles['transaction-wrapper']}>
            <select
              className={styles['transaction-select']}
              value={selectedTransaction}
              onChange={handleTransactionChange}
            >
              {transactionOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <IoIosArrowDropdown className={styles['tansaction-icon']} />
          </div>
          <span className={styles['total-count']}>
            {totalCount.toLocaleString()}건
          </span>
        </div>
        <div className={styles['sort-section']}>
          <select
            className={styles['sort-select']}
            value={selectedSort}
            onChange={handleSortChange}
          >
            {reviewsSortOptions.map(({value, label}) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
