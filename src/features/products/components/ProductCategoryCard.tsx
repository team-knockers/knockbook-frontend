import styles from './styles/ProductCategoryCard.module.css';

type Props = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export default function ProductCategoryCard({ label, icon, onClick }: Props) {
  return (
    <button
      type="button"
      className={styles['card']}
      onClick={onClick}
      aria-label={label}
    >
      <div className={styles['inner']}>
        <div className={styles['iconWrap']} aria-hidden>
          {icon}
        </div>
        <div className={styles['label']}>{label}</div>
      </div>
    </button>
  );
}
