import { FiBell, FiShoppingCart, FiUser, FiChevronLeft, FiX } from "react-icons/fi";
import type { MobileHeaderProps } from "../../types/header";
import styles from './styles/MobileHeader.module.css';
import logoUrl from '../../assets/header_logo.png';
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";

export default function MobileHeader(props: MobileHeaderProps) {
  const nav = useNavigate();
  
  return (
    <header className={styles['app-header']}>
      <div className={styles['app-header-left-section']}>
        {props.kind === 'main' && (
          <button className={styles['app-header-title']}>
            <img 
              className={styles['app-header-img']}
              src={logoUrl}
              onClick={() => nav(PATHS.home)}/>
          </button>
        )}
        {props.kind === 'backTitleClose' && (
          <button onClick={props.onBack}>
            <FiChevronLeft className={styles['app-header-icon']} />
          </button>
        )}
      </div>
      <div className={styles['app-header-middle-section']}>
        {props.kind === 'backTitleClose' && (
          <span className={styles["app-header-title"]}>
            {props.title}
          </span>
        )}
      </div>
      <div className={styles['app-header-right-section']}>
        {props.kind === 'main' && (
          <>
            <button onClick={props.onBell}>
              <FiBell className={styles['app-header-icon']} />
            </button>
            <button onClick={props.onCart}>
              <FiShoppingCart className={styles['app-header-icon']} />
            </button>
            {props.onProfile && (
              <button onClick={props.onProfile}>
                <FiUser className={styles['app-header-icon']} />
              </button>
            )}
          </>
        )}
        {props.kind === 'backTitleClose' && (
          <button onClick={props.onClose}>
            <FiX className={styles["app-header-icon"]} />
          </button>
        )}
      </div>
    </header>
  );
}
