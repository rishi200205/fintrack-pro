import './InsightCard.css';

/**
 * InsightCard — A single KPI / insight tile.
 *
 * @param {string}  title
 * @param {string}  value        — formatted value string
 * @param {string}  [sub]        — optional sub-label or context line
 * @param {string}  [icon]       — emoji icon
 * @param {string}  [accent]     — CSS color for the left accent bar & icon bg
 * @param {string}  [trend]      — 'up' | 'down' | 'neutral'
 * @param {boolean} [loading]
 */
export default function InsightCard({
  title,
  value,
  sub,
  icon,
  accent = 'var(--color-primary-500)',
  trend,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="insight-card insight-card--loading">
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
        <div className="insight-card__body">
          <div className="skeleton" style={{ height: 11, width: '55%', borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 22, width: '70%', borderRadius: 4 }} />
        </div>
      </div>
    );
  }

  const trendClass =
    trend === 'up'      ? 'insight-card--trend-up'   :
    trend === 'down'    ? 'insight-card--trend-down'  :
    trend === 'neutral' ? 'insight-card--trend-neutral' : '';

  return (
    <div className={`insight-card ${trendClass} fade-in`} style={{ '--insight-accent': accent }}>
      {icon && (
        <span className="insight-card__icon" style={{ background: `${accent}22` }}>
          {icon}
        </span>
      )}
      <div className="insight-card__body">
        <span className="insight-card__title">{title}</span>
        <span className="insight-card__value">{value}</span>
        {sub && <span className="insight-card__sub">{sub}</span>}
      </div>
      <div className="insight-card__accent-bar" />
    </div>
  );
}
