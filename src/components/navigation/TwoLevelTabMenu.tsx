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
        to={rightTabPath}
        onClick={handleTabClick}>
        <span className={s['tab-title']}>
          {rightTabTitle}
        </span>
      </NavLink>
    </div>
  );
}
