import type { ReactNode } from 'react';
import styles from './styles/ProductSummaryList.module.css';

type Props = { children: ReactNode };

export default function ProductSummaryList({ children }: Props) {
  return <section className={styles['product-list']}>{children}</section>;
}
