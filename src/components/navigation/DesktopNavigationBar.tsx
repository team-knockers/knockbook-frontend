import { NavLink } from "react-router-dom";
import styles from './styles/DestopNavigationBar.module.css'
import { PATHS } from "../../routes/paths";

export default function DesktopNavigationBar() {
  
  return (
    <nav className={styles['app-navigation']}>

      {/* menus for user */}
      <NavLink 
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.home}
        end={false}>
        홈
      </NavLink>
      <NavLink
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.booksHome}
        end={false}>
        도서
      </NavLink>
      <NavLink
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.productsHome}
        end={false}>
        상품
      </NavLink>
      <NavLink
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.loungeHome}
        end={false}>
        라운지
      </NavLink>
      <NavLink 
        className={({ isActive }) => 
          `${styles['app-menu']} ${isActive ? styles['active'] : ''}`}
        to={PATHS.feed}
        end={false}>
        피드
      </NavLink>

      {/* menu for moderators (and administrators) */}
       <NavLink
          className={({ isActive }) => 
            `${styles["app-menu"]} ${isActive ? styles["active"] : ""}`}
          to={PATHS.admin}>
          관리
        </NavLink>

    </nav>
  );
}
