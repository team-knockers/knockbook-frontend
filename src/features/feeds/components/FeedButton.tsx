import styles from "./styles/FeedButton.module.css";

export type FeedButtonProps = {
  content: string;
  onClick?: () => void;
};

export default function FeedButton({ content, onClick }: FeedButtonProps) {
  return (
    <button
      type="button"
      className={styles.feedButton}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
