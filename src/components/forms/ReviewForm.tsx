import { useState, useId, type KeyboardEvent } from 'react';
import OneWayButton from './OneWayButton';
import s from './ReviewForm.module.css';
import { FiRefreshCw } from 'react-icons/fi';

type ReviewFormProps = {
  objectName: string;
  objectImgUrl: string;
  onSubmit: ( content: string, rating: number) => void;
};

function StarRating({
  value,
  onChange,
  max = 5,
  label = '평점 선택',
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
  label?: string;
}) {
  const groupId = useId();

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(max, value + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(0, value - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(max);
    }
  };

  return (
    <div
      className={s['rating-root']}
      role="radiogroup"
      aria-label={label}
      aria-labelledby={groupId}
      tabIndex={0}
      onKeyDown={handleKey}>
      <span id={groupId} className="sr-only">{label}</span>
      {Array.from({ length: max }).map((_, i) => {
        const starIndex = i + 1;
        const checked = value >= starIndex;
        return (
          <button
            key={starIndex}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${starIndex}점`}
            className={checked ? s['star-on'] : s['star-off']}
            onClick={() => onChange(starIndex)}>
            {checked ? '★' : '☆'}
          </button>
        );
      })}
      <button
        type="button"
        className={s['star-clear']}
        onClick={() => onChange(0)}
        aria-label="평점 지우기"
        title="평점 지우기">
        <FiRefreshCw size={18} />
      </button>
      <span className={s['rating-value']}>
        {value > 0 ? `${value} / ${max}` : ''}
      </span>
    </div>
  );
}

export default function ReviewForm({
  objectName,
  objectImgUrl,
  onSubmit,
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const maxLen = 300;

  const remaining = maxLen - content.length;
  const canSubmit = rating > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(content.trim(), rating);
    // initialize
    setRating(0);
    setContent('');
  };

  return (
    <div className={s['form-layout']}>
      <div className={s['object-info-section']}>
        <div className={s['object-info-image']}>
          <img src={objectImgUrl} alt={objectName} />
        </div>
        <div className={s['object-info-content']}>
          <div className={s['object-name']}>
            <span>{objectName}</span>
          </div>
          <div className={s['object-rating']}>
            <StarRating value={rating} onChange={setRating}/>
          </div>
        </div>
      </div>

      <div className={s['review-input-section']}>
        <div className={s['review-section-title']}>
          <span>리뷰 작성</span>
        </div>
        <div className={s['review-content-input']}>
          <label 
            htmlFor="review-content"
            className="sr-only">
              리뷰 내용
          </label>
          <textarea
            id="review-content"
            className={s['textarea']}
            value={content}
            onChange={(e) => {
              const v = e.target.value;
              setContent(v.length <= maxLen ? v : v.slice(0, maxLen));
            }}
            maxLength={maxLen}
            placeholder="솔직한 후기를 남겨주세요. (최대 300자)"
            rows={6}
          />
          <div 
            className={s['char-counter']}
            aria-live="polite">
            {remaining}자 남음
          </div>
        </div>
      </div>

      <div className={s['action-section']}>
        <OneWayButton
          content="등록하기"
          responsiveType="fluid"
          widthSizeType="xl"
          heightSizeType="lg"
          colorType="dark"
          onClick={handleSubmit}/>
      </div>
    </div>
  );
}
