import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import './Modal.css';

/**
 * Reusable Modal overlay component
 *
 * @param {boolean}          isOpen    - controls visibility
 * @param {function}         onClose   - called when close is triggered
 * @param {string}           title     - modal heading
 * @param {'sm'|'md'|'lg'|'xl'} size  - modal width preset
 * @param {boolean}          hideClose - hides the X button
 * @param {React.ReactNode}  footer    - custom footer content
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideClose = false,
  footer = null,
  className = '',
}) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`modal modal--${size} ${className}`}>
        {/* Header */}
        {(title || !hideClose) && (
          <div className="modal__header">
            {title && <h2 className="modal__title">{title}</h2>}
            {!hideClose && (
              <button
                className="modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6"  x2="6"  y2="18" />
                  <line x1="6"  y1="6"  x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal__body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
