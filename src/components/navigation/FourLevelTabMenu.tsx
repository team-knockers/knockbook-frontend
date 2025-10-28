import { NavLink } from "react-router-dom";
import s from './styles/FourLevelTabMenu.module.css';

type FourLevelTabMenuProps = {
  firstTabTitle: string;
  secondTabTitle: string;
  thirdTabTitle: string;
  fourthTabTitle: string;
  firstTabPath: string;
  secondTabPath: string;
  thirdTabPath: string;
  fourthTabPath: string;
}

export default function FourLevelTabMenu({
  firstTabTitle,
  secondTabTitle,
  thirdTabTitle,
  fourthTabTitle,
  firstTabPath,
  secondTabPath,
  thirdTabPath,
  fourthTabPath,
}: FourLevelTabMenuProps) {
  
  const handleTabClick = () => {
    sessionStorage.setItem('skipScroll', 'true');
  };

  return (
    <div className={s['tab-menu']}>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={firstTabPath}
        onClick={handleTabClick}>
        <span className={s['tab-title']}>
          {firstTabTitle}
        </span>
      </NavLink>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={secondTabPath}
        onClick={handleTabClick}>
        <span className={s['tab-title']}>
          {secondTabTitle}
        </span>
      </NavLink>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={thirdTabPath}
        onClick={handleTabClick}>
        <span className={s['tab-title']}>
          {thirdTabTitle}
        </span>
      </NavLink>
      <NavLink 
        className={({ isActive }) =>
          `${s['tab-link']} ${isActive ? s['active'] : ''}`}
        to={fourthTabPath}
        onClick={handleTabClick}>
        <span className={s['tab-title']}>
          {fourthTabTitle}
        </span>
      </NavLink>
    </div>
  );
}
