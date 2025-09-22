import type { ReactNode } from 'react';
import styles from './styles/ProductSummaryList.module.css';

export default function ProductSummaryListBody({ children }: { children: ReactNode }) {
  return <div className={styles['product-list-body']}>{children}</div>;
}
