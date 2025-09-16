import { NavLink } from "react-router-dom";
import styles from './styles/DestopNavigationBar.module.css'
import { PATHS } from "../../routes/paths";

export default function DesktopNavigationBar() {
  return (
    <nav className={styles['app-navigation']}>
      <NavLink 
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.home}>
        홈
      </NavLink>
      <NavLink
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.booksHome}>
        도서
      </NavLink>
      <NavLink
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.productsHome}>
        상품
      </NavLink>
      <NavLink
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.loungeHome}>
        라운지
      </NavLink>
      <NavLink 
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.feedHome}>
        피드
      </NavLink>
    </nav>
  );
}
