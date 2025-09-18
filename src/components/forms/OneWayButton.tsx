import styles from './OneWayButton.module.css';

type OneWayButtonProps = {
  content: string;
  onClick: () => void;
  responsiveType: 'fluid' | 'fixed';
  widthSizeType: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs';
  heightSizeType: 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs' | 'xxxs';
  colorType: 'dark' | 'light' | 'natural' | 'outline' | 'light-dark';
  disabled?: boolean;
};

export default function OneWayButton({
  content,
  onClick,
  responsiveType,
  widthSizeType,
  heightSizeType,
  colorType,
  disabled = false,
}: OneWayButtonProps) {
  const className = [
    styles.btn,
    styles[responsiveType],
    styles[`width-${widthSizeType}`],
    styles[`height-${heightSizeType}`],
    styles[`color-${colorType}`],
  ].filter(Boolean).join(' ');

  return (
    <button 
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
