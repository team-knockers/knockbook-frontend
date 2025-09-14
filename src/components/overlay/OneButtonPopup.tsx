import styles from './OneButtonPopups.module.css';

type OneButtonPopupProps = {
  title: string; // Popup Title
  description?: string; // Popup Description
  confirmText?: string; // Confirm Button Text
  onConfirm: () => void; // Function to execute when the Confirm button is clicked
};

export default function OneButtonPopups({
  title,
  description,
  confirmText,
  onConfirm,
}: OneButtonPopupProps) {
  return (
    <div className={styles['popup-container']}>
      <div className={styles['popup-content']}>
        <h2 className={styles['popup-title']}>{title}</h2>
        {description && (
          <p className={styles['popup-description']}>{description}</p>
        )}
      </div>

      <div className={styles['popup-buttons']}>
        <button
          className={`${styles['popup-button']} ${styles['confirm-button']}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
