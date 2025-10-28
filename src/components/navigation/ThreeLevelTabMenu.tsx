import { NavLink } from "react-router-dom";
import s from './styles/TwoLevelTabMenu.module.css';

type ThreeLevelTabMenuProps = {
  leftTabTitle: string;
  centerTabTitle: string;
  rightTabTitle: string;
  leftTabPath: string;
  centerTabPath: string;
  rightTabPath: string;
}

export default function ThreeLevelTabMenu({
  leftTabTitle,
  centerTabTitle,
  rightTabTitle,
  leftTabPath,
  centerTabPath,
  rightTabPath,
}: ThreeLevelTabMenuProps) {
  
    const handleTabClick = () => {
    sessionStorage.setItem('skipScroll', 'true');
  };

  return (
    <div className={s['tab-menu']}>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={leftTabPath}
        onClick={handleTabClick}>
        <span className={s['tab-title']}>
          {leftTabTitle}
        </span>
      </NavLink>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={centerTabPath}
        onClick={handleTabClick}>
        <span className={s['tab-title']}>
          {centerTabTitle}
        </span>
      </NavLink>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={rightTabPath}
        onClick={handleTabClick}>
        <span className={s['tab-title']}>
          {rightTabTitle}
        </span>
      </NavLink>
    </div>
  );
}
