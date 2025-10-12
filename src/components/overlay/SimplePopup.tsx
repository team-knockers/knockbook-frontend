import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./SimplePopup.module.css";

export type SimplePopupProps = {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;  // close when clicking the backdrop
  closeOnEsc?: boolean;        // close on ESC key
  bodyClassName?: string;      // extra class for the body container
  noBodyPadding?: boolean;     // remove default padding from body
  fullScreen?: boolean;        // fill the viewport (useful for embedding full pages)
  showCloseButton?: boolean;   // control visibility of the close button (default true)
  dialogClassName?: string;
};

export default function SimplePopup({
  open,
  title,
  children,
  onClose,
  footer,
  closeOnBackdrop = true,
  closeOnEsc = true,
  bodyClassName,
  noBodyPadding,
  fullScreen,
  showCloseButton = true,
  dialogClassName
}: SimplePopupProps) {
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle ESC close, focus trap and body scroll lock while open
  useEffect(() => {
    if (!open) {
      return;
    }

    // remember previously focused element
    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    // lock background scroll
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      // close on ESC
      if (closeOnEsc && e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      // simple focus trap within the dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) {
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // focus the first interactive element when opened
    const timer = setTimeout(() => {
      const focusTarget =
        dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
        dialogRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
      if (focusTarget) {
        focusTarget.focus();
      }
    }, 0);

    // cleanup on close/unmount
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (lastFocusedRef.current?.focus) {
        lastFocusedRef.current.focus();
      }
    };
  }, [open, onClose, closeOnEsc]);

  if (!open) {
    return null;
  }

  const showHeader = Boolean(title) || Boolean(showCloseButton);

  const content = (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => {
        // close only if clicking the backdrop itself (not inner content)
        if (!closeOnBackdrop) {
          return;
        }
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`${styles.dialog} ${fullScreen ? styles.fullScreen : ""} ${dialogClassName ?? ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "simple-popup-title" : undefined}
        ref={dialogRef}
        onMouseDown={(e) => {
          // prevent backdrop close when clicking inside
          e.stopPropagation();
        }}
      >
        {showHeader && (
          <div className={styles.header}>
            {title && (
              <h2 id="simple-popup-title" className={styles.title}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close"
                data-autofocus
              >
                ×
              </button>
            )}
          </div>
        )}

        <div
          className={[
            styles.body,
            noBodyPadding ? styles.noPad : "",
            bodyClassName ?? "",
          ].join(" ")}
        >
          {children}
        </div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );

  // render into document.body via portal
  return createPortal(content, document.body);
}
