import { useEffect, useRef } from "react";
import s from "./CenterSnackbar.module.css";

type Variant = "info" | "success" | "warn" | "error";

export default function CenterSnackbar({
  open,
  message,
  variant = "info",
  duration = 2200,
  onClose,
}: {
  open: boolean;
  message?: string;
  variant?: Variant;
  duration?: number;
  onClose?: () => void;
}) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => onClose?.(), duration);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [open, duration, onClose, message, variant]);

  return (
    <div className={s.portal} aria-live="assertive" aria-atomic="true">
      <div
        className={[
          s.snackbar,
          s[variant],
          open ? s.show : s.hide,
        ].join(" ")}
        role="status"
      >
        {message}
      </div>
    </div>
  );
}

