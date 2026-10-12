"use client";

import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ICONS = {
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
  printer: <><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>,
  save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  more: <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  check: <polyline points="20 6 9 17 4 12" />,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>,
  mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
  message: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  refresh: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>,
  x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
  eraser: <><path d="M20 20H9l-5-5a2 2 0 0 1 0-2.8l9-9a2 2 0 0 1 2.8 0l5 5a2 2 0 0 1 0 2.8L12 20" /><line x1="7" y1="12" x2="14" y2="19" /></>,
  search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
};

export function Icon({ name, size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}

// A labelled form control. The single child gets aria-invalid wired up.
export function Field({ label, error, hint, className = "", children }) {
  const id = useId();
  const child = isValidElement(children)
    ? cloneElement(children, {
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": error ? `${id}-err` : undefined,
      })
    : children;
  return (
    <label className={`field ${error ? "has-error" : ""} ${className}`}>
      <span className="field__label">{label}</span>
      {child}
      {hint && !error && <span className="tool-hint">{hint}</span>}
      <span className="field__error" id={`${id}-err`} role={error ? "alert" : undefined}>{error}</span>
    </label>
  );
}

export function Section({ title, children, defaultOpen = false, hasError = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    if (hasError) setOpen(true);
  }, [hasError]);
  return (
    <details className={`inv-section ${hasError ? "has-error" : ""}`} open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <span>{title}</span>
        {badge ? <span className="inv-section__badge">{badge}</span> : null}
      </summary>
      <div className="inv-section__body">{children}</div>
    </details>
  );
}

function usePortalTarget() {
  const [target, setTarget] = useState(null);
  useEffect(() => setTarget(document.body), []);
  return target;
}

export function Modal({ title, onClose, children, wide = false, footer }) {
  const target = usePortalTarget();
  const ref = useRef(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab" && ref.current) {
        const focusable = ref.current.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector("[data-autofocus]")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, []);

  if (!target) return null;
  return createPortal(
    <div className="inv-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`inv-modal ${wide ? "inv-modal--wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref}>
        <div className="inv-modal__head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="inv-iconbtn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </div>
        <div className="inv-modal__body">{children}</div>
        {footer ? <div className="inv-modal__foot">{footer}</div> : null}
      </div>
    </div>,
    target
  );
}

export function ConfirmDialog({ title, message, confirmLabel = "Confirm", danger = false, onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="inv-btn" onClick={onCancel} data-autofocus>Cancel</button>
          <button type="button" className={`inv-btn ${danger ? "inv-btn--danger" : "inv-btn--primary"}`} onClick={onConfirm}>{confirmLabel}</button>
        </>
      }
    >
      <p className="inv-confirm__text">{message}</p>
    </Modal>
  );
}

export function Toast({ toast, onDone }) {
  const target = usePortalTarget();
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [toast, onDone]);
  if (!target || !toast) return null;
  return createPortal(
    <div className={`inv-toast inv-toast--${toast.type}`} role="status" aria-live="polite">
      <Icon name={toast.type === "error" ? "x" : "check"} size={15} />
      <span>{toast.message}</span>
    </div>,
    target
  );
}

export function MoreMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div className="inv-menu" ref={ref}>
      <button type="button" className="inv-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="more" /> More
      </button>
      {open && (
        <div className="inv-menu__list" role="menu">
          {items.map((item, i) =>
            item.divider ? (
              <div className="inv-menu__divider" key={`d${i}`} role="separator" />
            ) : (
              <button
                type="button"
                role="menuitem"
                key={item.label}
                className={`inv-menu__item ${item.danger ? "is-danger" : ""}`}
                onClick={() => { setOpen(false); item.onClick(); }}
              >
                <Icon name={item.icon} size={15} /> {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  return <span className={`inv-status inv-status--${String(status).toLowerCase()}`}>{status}</span>;
}
