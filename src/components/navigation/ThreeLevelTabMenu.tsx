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
  return (
    <div className={s['tab-menu']}>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={leftTabPath}>
        <span className={s['tab-title']}>
          {leftTabTitle}
        </span>
      </NavLink>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={centerTabPath}>
        <span className={s['tab-title']}>
          {centerTabTitle}
        </span>
      </NavLink>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={rightTabPath}>
        <span className={s['tab-title']}>
          {rightTabTitle}
        </span>
      </NavLink>
    </div>
  );
}
