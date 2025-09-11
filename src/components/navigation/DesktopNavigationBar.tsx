import { NavLink } from "react-router-dom";
import styles from './styles/DestopNavigationBar.module.css'

export default function DesktopNavigationBar() {
  return (
    <nav className={styles['app-navigation']}>
      <NavLink 
        className={({ isActive }) =>
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`
        }
        to="/home">
        홈
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`
        }
        to="/books">
        도서
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`
        }
        to="/products">
        상품
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`
        }
        to="/lounge">
        라운지
      </NavLink>
      <NavLink 
        className={({ isActive }) =>
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`
        }
        to="/feed">
        피드
      </NavLink>
    </nav>
  );
}
