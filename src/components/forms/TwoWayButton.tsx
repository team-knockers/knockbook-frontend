import { useState } from 'react';
import styles from './TwoWayButton.module.css'

type Side = 'left' | 'right';
type TwoWayButtonProps = {
    leftContent: string;   // Left button text
    rightContent: string;  // Right button text
    defaultActive?: Side; // Default active button
    onToggle?: (active: Side) => void; // Toggle event
}

export default function TwoWayButton({ 
    leftContent,
    rightContent,
    defaultActive = 'left',
    onToggle,
} : TwoWayButtonProps) {

    const [active, setActive] = useState<Side>(defaultActive);

    const handleClick = (side: Side) => {
        setActive(side);
        onToggle?.(side); // Lift state up to the parent when needed
    };
    return (
        <div className={styles['button-layout']}>
            <button
                name='toggle'
                className={`${styles['button-unit']} ${active === 'left' ? styles.active : styles.inactive}`}
                onClick={() => handleClick('left')}
            >
                {leftContent}
            </button>
            <button
                className={`${styles['button-unit']} ${active === 'right' ? styles.active : styles.inactive}`}
                onClick={() => handleClick('right')}
            >
                {rightContent}
            </button>
        </div>
  );
}
