import styles from '../styles/BookCardForBookSlider.module.css';

type BookCardForBookSliderProps = {
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  onImageOrTitleClicked: () => void; 
};

export default function BookCardForBookSlider({
  imageUrl,
  title,
  author,
  publisher,
  onImageOrTitleClicked
}: BookCardForBookSliderProps) {

  return (
    <div className={styles['book-card']}>
      <img
        className={styles['book-image']}
        src={imageUrl}
        alt={`${title} 표지`}
        onClick={onImageOrTitleClicked}
      />
      <div className={styles['book-info']}>
        <button 
          className={styles['book-title']}
          onClick={onImageOrTitleClicked}
        >
          {title}
        </button>
        <div className={styles['book-meta']}>{author} · {publisher}</div>
      </div>
    </div>
  );
}
