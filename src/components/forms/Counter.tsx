import { useEffect, useState } from 'react';
import s from './Counter.module.css';
import { FiMinus, FiPlus } from 'react-icons/fi';

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
  }, [value, onChange]);

  
  const decrement = () => value > min && setValue(value - 1);
  const increment = () => value < max && setValue(value + 1);

  return (
    <div className={s['counter']}>
      <button 
        className={s['counter-button']}
        onClick={decrement}>
          <FiMinus />
      </button>
      <span className={s['counter-value']}>
        {value}
      </span>
      <button 
        className={s['counter-button']}
        onClick={increment}>
         <FiPlus />
      </button>
    </div>
  );
}