import { useEffect, useState } from 'react';
import s from './Counter.module.css';

type CounterProps = {
  min?: number;
  max?: number;
  initial?: number;
  onChange: (value: number) => void;
};

export default function Counter({
  min = 1,
  max = 99,
  initial = 1,
  onChange,
} : CounterProps) {

  const [value, setValue] = useState(initial);

  useEffect(() => { if (onChange) { onChange(value); }
  }, [value, onchange]);

  const decrement = () => {
    if (value > min) { setValue(value - 1); }
  }

  const increment = () => {
    if (value < max) { setValue(value + 1); }
  }

  return (
    <div className={s['counter']}>
      <button 
        className={s['counter-button']}
        onClick={decrement}>
          -
      </button>
      <span className={s['counter-value']}>
        {value}
      </span>
      <button 
        className={s['counter-button']}
        onClick={increment}>
        +
      </button>
    </div>
  );
}