import { NavLink } from "react-router-dom";
import s from './styles/TwoLevelTabMenu.module.css';

type TwoLevelTabMenuProps = {
  leftTabTitle: string;
  rightTabTitle: string;
  leftTabPath: string;
  rightTabPath: string;
}

export default function TwoLevelTabMenu({
  leftTabTitle,
  rightTabTitle,
  leftTabPath,
  rightTabPath,
}: TwoLevelTabMenuProps) {
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
        to={rightTabPath}>
        <span className={s['tab-title']}>
          {rightTabTitle}
        </span>
      </NavLink>
    </div>
  );
}