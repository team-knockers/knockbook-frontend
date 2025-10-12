import SimplePopup from "./SimplePopup";
import styles from "./DuoConfirmPopup.module.css";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  cancelText: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  fullScreenOnMobile?: boolean;
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => { setMatches(m.matches); };
    onChange();
    m.addEventListener("change", onChange);
    return () => { m.removeEventListener("change", onChange); };
  }, [query]);
  return matches;
}

export default function DuoConfirmPopup({
  open,
  title,
  description,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  fullScreenOnMobile = true,
}: Props) {

  const isMobile = useMediaQuery("(max-width: 1023.98px)");

  return (
    <SimplePopup
      open={open}
      onClose={onCancel}
      noBodyPadding
      fullScreen={fullScreenOnMobile && isMobile}
      showCloseButton={false}
      dialogClassName={styles.smDialog}
    >
      <div className={styles.container}>
        <div className={styles.message}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.desc}>{description}</p>}
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={() => { onCancel(); }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={styles.btnConfirm}
            onClick={() => { onConfirm(); }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </SimplePopup>
  );
}
