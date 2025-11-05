import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiShoppingCart, FiUser } from "react-icons/fi";
import styles from './styles/DesktopHeader.module.css'
import { PATHS } from "../../routes/paths";
import logoUrl from '../../assets/header_logo.png';

export default function DesktopHeader({ children }: PropsWithChildren) {
  const nav = useNavigate();

  return (
    <header className={styles['app-header']}>
      <div className={styles['max-width-container']}>
        <div className={styles['app-header-left-section']}>
          <button className={styles['app-header-title']}>
            <img 
              className={styles['app-header-img']}
              src={logoUrl}
              onClick={() => nav(PATHS.home)}/>
          </button>
          <div className={styles['app-header-menubar']}>
            {children}
          </div>
        </div>
        <div className={styles['app-header-right-section']}>
          <button onClick={() => nav(PATHS.notification)}>
            <FiBell className={styles['app-header-icon']}/>
          </button>
          <button onClick={() => nav(PATHS.cart)}>
            <FiShoppingCart className={styles['app-header-icon']}/>
          </button>
          <button onClick={() => nav(PATHS.accountHome)}>
            <FiUser className={styles['app-header-icon']}/>
          </button>
        </div>
        </div>
    </header>
  );
}
