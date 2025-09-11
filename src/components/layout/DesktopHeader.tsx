import type { PropsWithChildren } from "react";
import { FiBell, FiShoppingCart, FiUser } from "react-icons/fi";
import styles from './styles/DesktopHeader.module.css'

export default function DesktopHeader({ children }: PropsWithChildren) {
  return (
    <header className={styles['app-header']}>
      <div className={styles['app-header-left-section']}>
        <button 
          className={styles['app-header-title']}>
          문앞의책방
        </button>
        <div className={styles['app-header-menubar']}>
          {children}
        </div>
      </div>
      <div className={styles['app-header-right-section']}>
        <button onClick={() => {/* TODO */}}>
          <FiBell className={styles['app-header-icon']}/>
        </button>
        <button onClick={() => {/* TODO */}}>
          <FiShoppingCart className={styles['app-header-icon']}/>
        </button>
        <button onClick={() => {/* TODO */}}>
          <FiUser className={styles['app-header-icon']}/>
        </button>
      </div>
    </header>
  );
}
