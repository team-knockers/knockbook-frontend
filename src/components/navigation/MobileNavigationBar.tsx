import { NavLink } from "react-router-dom";
import styles from './styles/MobileNavigationBar.module.css';
import { PATHS } from "../../routes/paths";

export default function MobileNavigationBar() {
  return (
    <nav className={styles['app-navigation']}>
      <NavLink 
        className={styles['app-menu']}
        to={PATHS.home}>
          {({ isActive }) => (
            <>
              <div className={`${styles['menu-icon']}
                               ${styles['home-icon']}
                               ${isActive ? styles['active'] : ''}`} />
              <div className={`${styles['menu-name']}                               
                               ${styles['home-name']}
                               ${isActive ? styles['active'] : ''}`}>
                <span>홈</span>
              </div>
            </>
          )}
      </NavLink>
      <NavLink 
        className={styles['app-menu']}
        to={PATHS.booksHome}>
          {({ isActive }) => (
            <>
              <div className={`${styles['menu-icon']} 
                               ${styles['books-icon']} 
                               ${isActive ? styles['active'] : ''}`} />
              <div className={`${styles['menu-name']} 
                               ${styles['books-name']}
                               ${isActive ? styles['active'] : ''}`}>
                <span>도서</span>
              </div>
            </>
          )}
      </NavLink>
      <NavLink 
        className={styles['app-menu']}
        to={PATHS.productsHome}>
          {({ isActive }) => (
            <>
              <div className={`${styles['menu-icon']} 
                               ${styles['products-icon']} 
                               ${isActive ? styles['active'] : ''}`} />
              <div className={`${styles['menu-name']} 
                               ${styles['products-name']}
                               ${isActive ? styles['active'] : ''}`}>
                <span>상품</span>
              </div>
            </>
          )}
      </NavLink>
      <NavLink 
        className={styles['app-menu']}
        to={PATHS.loungeHome}>
          {({ isActive }) => (
            <>
              <div className={`${styles['menu-icon']} 
                               ${styles['lounge-icon']} 
                               ${isActive ? styles['active'] : ''}`} />
              <div className={`${styles['menu-name']} 
                               ${styles['lounge-name']}
                               ${isActive ? styles['active'] : ''}`}>
                <span>라운지</span>
              </div>
            </>
          )}
      </NavLink>
      <NavLink
        className={styles['app-menu']}
        to={PATHS.feedHome}>
          {({ isActive }) => (
            <>
              <div className={`${styles['menu-icon']} 
                               ${styles['feed-icon']} 
                               ${isActive ? styles['active'] : ''}`} />
              <div className={`${styles['menu-name']} 
                               ${styles['feed-name']}
                               ${isActive ? styles['active'] : ''}`}>
                <span>피드</span>
              </div>
            </>
          )}
      </NavLink>
    </nav>
  );
}
