import './OneWayButton.Module.css'

type OneWayButtonProps = {
    content: string; // Button text
    onClick: () => void; // Click event handler
    responsiveType: 'fluid' | 'fixed'; // Responsive button styling
    widthSizeType: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs'; // Button width styling
    heightSizeType: 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs' | 'xxxs'; // Button height styling
    colorType: 'dark' | 'light' | 'natural' | 'outline' | 'light-dark'; // Button color styling
    disabled?: boolean;
}

export default function OneWayButton({ 
    content,
    onClick,
    responsiveType,
    widthSizeType,
    heightSizeType,
    colorType,
    disabled = false
} : OneWayButtonProps) {
    return (
        <button 
            className={`${responsiveType}-${widthSizeType}-${heightSizeType}-${colorType}`}
            onClick={onClick}
            disabled={disabled}
        >
            {content}
        </button>
    );
}
