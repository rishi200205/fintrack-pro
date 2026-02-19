import './Card.css';

/**
 * Card container component
 *
 * @param {boolean}          hoverable  - adds hover lift effect
 * @param {boolean}          bordered   - show explicit border
 * @param {boolean}          glass      - glass-morphism variant
 * @param {string}           padding    - 'sm'|'md'|'lg'|'none'
 * @param {React.ReactNode}  header     - optional card header content
 * @param {React.ReactNode}  footer     - optional card footer content
 * @param {string}           accent     - 'primary'|'success'|'danger'|'warning' — colored top border
 */
export default function Card({
  children,
  hoverable = false,
  bordered = false,
  glass = false,
  padding = 'md',
  header = null,
  footer = null,
  accent = null,
  className = '',
  ...props
}) {
  const classes = [
    'card',
    `card--p-${padding}`,
    hoverable ? 'card--hoverable' : '',
    bordered  ? 'card--bordered'  : '',
    glass     ? 'card--glass'     : '',
    accent    ? `card--accent-${accent}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {header && <div className="card__header">{header}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}
