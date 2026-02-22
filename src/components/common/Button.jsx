import './Button.css';

/**
 * Reusable Button component
 *
 * @param {'primary'|'secondary'|'danger'|'ghost'|'success'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} loading  - shows spinner and disables interaction
 * @param {React.ReactNode} icon - optional icon element (rendered before label)
 * @param {React.ReactNode} iconRight - optional icon element (rendered after label)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  iconRight = null,
  className = '',
  type = 'button',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth  ? 'btn--full'    : '',
    loading    ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true" />
      )}
      {!loading && icon && (
        <span className="btn__icon btn__icon--left">{icon}</span>
      )}
      {children && <span className="btn__label">{children}</span>}
      {!loading && iconRight && (
        <span className="btn__icon btn__icon--right">{iconRight}</span>
      )}
    </button>
  );
}
