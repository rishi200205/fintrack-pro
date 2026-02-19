import './Loader.css';

/**
 * Loader / Spinner component
 *
 * @param {'sm'|'md'|'lg'|'xl'} size
 * @param {string}              color  - CSS color string (defaults to primary)
 * @param {boolean}             overlay - renders a full-page overlay with centered spinner
 * @param {string}              label  - accessible label (also shown below in overlay mode)
 */
export default function Loader({
  size = 'md',
  color,
  overlay = false,
  label = 'Loading…',
  className = '',
}) {
  const spinner = (
    <div
      className={`loader loader--${size} ${className}`}
      style={color ? { '--loader-color': color } : undefined}
      role="status"
      aria-label={label}
    >
      <div className="loader__ring" />
      <span className="sr-only">{label}</span>
    </div>
  );

  if (overlay) {
    return (
      <div className="loader-overlay">
        {spinner}
        {label && <p className="loader-overlay__label">{label}</p>}
      </div>
    );
  }

  return spinner;
}
