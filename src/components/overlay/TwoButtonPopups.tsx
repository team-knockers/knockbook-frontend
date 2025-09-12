import styles from './TwoButtonPopups.module.css'

type TwoButtonPopupsProps = {
  title: string; // Popup Title
  description?: string; // Popup Description
  cancelText?: string; // Cancel Button Text
  confirmText?: string; // Confirm Button Text
  onCancel: () => void; // Function to execute when the Cancel button is clicked
  onConfirm: () => void; // Function to execute when the Confirm button is clicked
};

export default function TwoButtonPopups({
  title,
  description,
  cancelText = '취소',
  confirmText = '진행',
  onCancel,
  onConfirm,
}: TwoButtonPopupsProps) {
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
          className={`${styles['popup-button']} ${styles['cancel-button']}`}
          onClick={onCancel}
        >
          {cancelText}
        </button>
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