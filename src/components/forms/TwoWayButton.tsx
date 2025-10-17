import s from './TwoWayButton.module.css';

type TwoWayButtonSide = 'left' | 'right';

type TwoWayButtonProps = {
  leftButtonContent: string;
  rightButtonContent: string;
  active: TwoWayButtonSide;
  onChange(which: 'left' | 'right') : void;
}

export default function TwoWayButton({
  leftButtonContent,
  rightButtonContent,
  active,
  onChange,
} : TwoWayButtonProps) {

  return (
    <div className={s['comp-layout']}>
      <button
        className={s[`btn-layout`]}
        aria-pressed={active === 'left'}
        onClick={() => onChange('left')}>
          {leftButtonContent}
      </button>
      <button
        className={s[`btn-layout`]}
        aria-pressed={active === 'right'}
        onClick={() => onChange('right')}>
          {rightButtonContent}
      </button>
    </div>
  );
}