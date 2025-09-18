import styles from '../styles/BookCardForBookSlider.module.css';

type BookCardProps = {
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  showMeta?: boolean;
};

export default function BookCardForBookSlider({
  imageUrl,
  title,
  author,
  publisher,
  showMeta = true
}: BookCardProps) {

  return (
    <div className={styles['book-card']}>
      <img
        className={styles['book-image']}
        src={imageUrl}
        alt={`${title} 표지`}
      />
      <div className={styles['book-info']}>
        <div className={styles['book-title']}>{title}</div>
        {showMeta && (
          <div className={styles['book-meta']}>{author} · {publisher}</div>
        )}
      </div>
    </div>
  );
}
