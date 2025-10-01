import { useState } from 'react';
import s from './TwoWayButton.module.css';

type TwoWayButtonSide = 'left' | 'right';

type TwoWayButtonProps = {
  leftButtonContent: string;
  rightButtonContent: string;
  defaultActive?: TwoWayButtonSide;
  onChange(which: 'left' | 'right') : void;
}

export default function TwoWayButton({
  leftButtonContent,
  rightButtonContent,
  defaultActive = 'left',
  onChange,
} : TwoWayButtonProps) {

  const [active, setActive] = useState<TwoWayButtonSide>(defaultActive);
  
  function handleLeftButtonClick() {
    setActive('left');
    onChange('left');
  }

  function handleRightButtonClick() {
    setActive('right');
    onChange('right');
  }

  return (
    <div className={s['comp-layout']}>
      <button
        className={s[`btn-layout`]}
        aria-pressed={active === 'left'}
        onClick={handleLeftButtonClick}>
          {leftButtonContent}
      </button>
      <button
        className={s[`btn-layout`]}
        aria-pressed={active === 'right'}
        onClick={handleRightButtonClick}>
          {rightButtonContent}
      </button>
    </div>
  );
}