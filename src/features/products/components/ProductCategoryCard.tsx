import styles from './styles/ProductCategoryCard.module.css';

type Props = {
  label: string;
  imageSrc: string;
  onClick: () => void;  
}

export default function ProductCategoryCard({
  label, imageSrc, onClick    
}: Props) {
  return (
    <button 
      className={styles['product-category-card']}        
      type="button"
      onClick={onClick}
    >
      <div className={styles['product-category-content']}>
        <img 
          className={styles['product-category-image']}
          src={imageSrc}
          alt={label}
          loading="lazy"
        />
        <div className={styles['product-category-label']}>{label}</div>
      </div>
    </button>
  )
}
