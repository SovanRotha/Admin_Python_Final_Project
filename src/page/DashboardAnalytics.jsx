import {
  Activity,
  BarChart3,
  FileText,
  Map,
  MapPin,
  PieChart as PieChartIcon,
  Plane,
  Sparkles,
  Users,
} from 'lucide-react'

const dashboardTheme = `
.adm-shell .adm-dashboard { display: flex; flex-direction: column; gap: 24px; }

/* Stat cards */
.adm-shell .adm-stats {
  display: grid; gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
}
.adm-shell .adm-stat {
  --tone: var(--forest-800, #14442f);
  --tone-soft: #dcebe3;
  position: relative; display: flex; flex-direction: column; gap: 14px;
  padding: 20px; overflow: hidden;
  background: #fff; border: 1px solid var(--stone-200, #dde1d0);
  border-radius: var(--radius, 14px); box-shadow: var(--shadow);
}
.adm-shell .adm-stat::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: var(--tone);
}
.adm-shell .adm-stat--forest { --tone: #14442f; --tone-soft: #dcebe3; }
.adm-shell .adm-stat--gold   { --tone: #d4912a; --tone-soft: #fbefd6; }
.adm-shell .adm-stat--leaf   { --tone: #2f9e6e; --tone-soft: #def3e8; }
.adm-shell .adm-stat--clay   { --tone: #a8643c; --tone-soft: #f6e6dc; }
.adm-shell .adm-stat__heading { display: flex; align-items: center; gap: 10px; }
.adm-shell .adm-stat__icon {
  display: grid; place-items: center; width: 34px; height: 34px;
  border-radius: 10px; background: var(--tone-soft); color: var(--tone);
}
.adm-shell .adm-stat__label {
  color: var(--ink-600, #566860); font-size: 12px; font-weight: 600;
  letter-spacing: 0.4px; text-transform: uppercase;
}
.adm-shell .adm-stat__value {
  color: var(--ink-900, #1b2a24); font-size: 30px; font-weight: 700;
  letter-spacing: -0.5px; line-height: 1.1;
}

/* Chart cards */
.adm-shell .adm-charts {
  display: grid; gap: 24px; grid-template-columns: minmax(0, 1fr);
}
@media (min-width: 1100px) {
  .adm-shell .adm-charts { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); align-items: start; }
}
.adm-shell .adm-chart-card .adm-card__header h3 {
  display: flex; align-items: center; gap: 8px;
}
.adm-shell .adm-chart-card .adm-card__header h3 svg { color: var(--accent, #d4912a); }
.adm-shell .adm-chart-card__body { padding: 20px 24px 24px; }

/* Bar chart */
.adm-shell .adm-bar-chart { display: flex; flex-direction: column; gap: 14px; }
.adm-shell .adm-bar-chart__row {
  display: grid; align-items: center; gap: 14px;
  grid-template-columns: minmax(120px, 190px) minmax(0, 1fr) auto;
}
.adm-shell .adm-bar-chart__label {
  display: flex; align-items: center; gap: 8px; min-width: 0;
  color: var(--ink-600, #566860); font-size: 13px; font-weight: 500;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.adm-shell .adm-bar-chart__label svg { flex-shrink: 0; color: var(--forest-800, #14442f); }
.adm-shell .adm-bar-chart__track {
  display: block; height: 12px; overflow: hidden;
  border-radius: 999px; background: var(--stone-100, #eef0e6);
}
.adm-shell .adm-bar-chart__bar {
  display: block; height: 100%; min-width: 4px; border-radius: 999px;
  background: linear-gradient(90deg, var(--forest-800, #14442f), var(--accent, #d4912a));
  transition: width 0.4s ease;
}
.adm-shell .adm-bar-chart__value {
  min-width: 36px; color: var(--ink-900, #1b2a24); font-size: 14px; text-align: right;
}

/* Pie chart */
.adm-shell .adm-pie-chart__groups { display: flex; flex-direction: column; gap: 24px; }
.adm-shell .adm-pie-chart__group h4 {
  margin: 0 0 14px; color: var(--ink-600, #566860); font-size: 12px; font-weight: 700;
  letter-spacing: 0.6px; text-transform: uppercase;
}
.adm-shell .adm-pie-chart { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.adm-shell .adm-pie-chart__ring {
  position: relative; display: flex; flex-direction: column; align-items: center;
  justify-content: center; width: 148px; height: 148px; flex-shrink: 0; border-radius: 50%;
}
.adm-shell .adm-pie-chart__ring::before {
  content: ''; position: absolute; inset: 20px; border-radius: 50%; background: #fff;
}
.adm-shell .adm-pie-chart__total,
.adm-shell .adm-pie-chart__caption { position: relative; z-index: 1; }
.adm-shell .adm-pie-chart__total {
  color: var(--ink-900, #1b2a24); font-size: 24px; font-weight: 700; line-height: 1;
}
.adm-shell .adm-pie-chart__caption {
  margin-top: 4px; color: var(--ink-400, #8a998f); font-size: 11px;
  letter-spacing: 0.6px; text-transform: uppercase;
}
.adm-shell .adm-pie-chart__legend {
  display: flex; flex-direction: column; gap: 10px; flex: 1; min-width: 160px;
  margin: 0; padding: 0; list-style: none;
}
.adm-shell .adm-pie-chart__legend li {
  display: grid; align-items: center; gap: 10px;
  grid-template-columns: 12px minmax(0, 1fr) auto 40px; font-size: 13px;
}
.adm-shell .adm-pie-chart__swatch { width: 12px; height: 12px; border-radius: 4px; }
.adm-shell .adm-pie-chart__name { color: var(--ink-600, #566860); }
.adm-shell .adm-pie-chart__legend small { color: var(--ink-400, #8a998f); text-align: right; }
`

const formatLabel = (value) =>
  String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

const getMetricIcon = (label) => {
  const normalizedLabel = label.toLowerCase()
  if (normalizedLabel.includes('user')) return Users
  if (normalizedLabel.includes('destination')) return Map
  if (normalizedLabel.includes('place')) return MapPin
  if (normalizedLabel.includes('trip')) return Plane
  if (normalizedLabel.includes('report')) return FileText
  if (normalizedLabel.includes('ai') || normalizedLabel.includes('usage')) return Sparkles
  return Activity
}

const getDashboardMetrics = (dashboard, userCount) => {
  const metrics = []

  const collect = (value, prefix = '') => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return
    }

    Object.entries(value).forEach(([key, item]) => {
      const label = prefix
        ? `${prefix} ${formatLabel(key)}`
        : key === 'users'
          ? 'Total users'
          : formatLabel(key)
      if (item === null || ['string', 'number', 'boolean'].includes(typeof item)) {
        const numericValue =
          typeof item === 'number' && Number.isFinite(item)
            ? item
            : typeof item === 'string' && item.trim() !== '' && /^-?\d+(\.\d+)?$/.test(item.trim())
              ? Number(item)
              : null
        metrics.push({ label, value: formatValue(item), numericValue })
      } else if (item && typeof item === 'object' && !Array.isArray(item)) {
        collect(item, label)
      }
    })
  }

  const statistics = dashboard?.statistics
  collect(
    statistics && typeof statistics === 'object' && !Array.isArray(statistics)
      ? statistics
      : dashboard,
  )

  if (
    userCount !== undefined &&
    !metrics.some(({ label }) => /user.*(count|total)|total.*users/i.test(label))
  ) {
    metrics.unshift({ label: 'Total users', value: formatValue(userCount) })
  }

  return metrics
}

const statusNames = new Set([
  'active',
  'inactive',
  'pending',
  'open',
  'resolved',
  'approved',
  'rejected',
  'suspended',
  'disabled',
  'in_review',
  'under_review',
  'reviewed',
])

const getDashboardStatusBreakdowns = (dashboard) => {
  const reportsByStatus = dashboard?.reports_by_status
  if (reportsByStatus && typeof reportsByStatus === 'object' && !Array.isArray(reportsByStatus)) {
    const segments = Object.entries(reportsByStatus)
      .filter(([, count]) => typeof count === 'number' && Number.isFinite(count) && count > 0)
      .map(([status, count]) => ({ label: formatLabel(status), value: count }))

    return segments.length > 0 ? [{ label: 'Reports by status', segments }] : []
  }

  const breakdowns = []

  const collect = (value, prefix = '') => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return
    }

    const segments = Object.entries(value)
      .filter(([key, item]) => statusNames.has(key.toLowerCase()) && typeof item === 'number' && item > 0)
      .map(([key, count]) => ({ label: formatLabel(key), value: count }))

    if (segments.length > 0) {
      breakdowns.push({
        label: prefix ? `${prefix} by status` : 'Status breakdown',
        segments,
      })
    }

    Object.entries(value).forEach(([key, item]) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        collect(item, prefix ? `${prefix} ${formatLabel(key)}` : formatLabel(key))
      }
    })
  }

  collect(dashboard)
  return breakdowns
}

function EmptyState({ title, text }) {
  return (
    <div className="adm-empty">
      <strong>{title}</strong>
      {text ? <span>{text}</span> : null}
    </div>
  )
}

function BarChart({ metrics }) {
  const chartMetrics = metrics.filter(({ numericValue }) => numericValue !== null && numericValue >= 0)
  const maxValue = Math.max(...chartMetrics.map(({ numericValue }) => numericValue), 0)

  if (chartMetrics.length === 0) {
    return (
      <EmptyState
        title="No numeric metrics to chart"
        text="The dashboard endpoint did not return numeric summary values."
      />
    )
  }

  return (
    <div className="adm-bar-chart" role="list" aria-label="Dashboard metrics bar chart">
      {chartMetrics.map(({ label, numericValue, value }) => (
        <div className="adm-bar-chart__row" role="listitem" key={label}>
          <span className="adm-bar-chart__label" title={label}>
            <BarChart3 size={15} aria-hidden="true" />
            {label}
          </span>
          <span
            className="adm-bar-chart__track"
            role="img"
            aria-label={`${label}: ${value}`}
          >
            <span
              className="adm-bar-chart__bar"
              style={{ width: `${maxValue === 0 ? 0 : (numericValue / maxValue) * 100}%` }}
            />
          </span>
          <strong className="adm-bar-chart__value">{value}</strong>
        </div>
      ))}
    </div>
  )
}

const pieColors = ['#14442f', '#d4912a', '#2f9e6e', '#d64545', '#2f80c4', '#7c5cc4']

function PieChart({ breakdown }) {
  const total = breakdown.segments.reduce((sum, segment) => sum + segment.value, 0)
  const gradient = breakdown.segments
    .reduce(
      (chart, segment, index) => {
        const end = chart.angle + (segment.value / total) * 360
        return {
          angle: end,
          stops: [...chart.stops, `${pieColors[index % pieColors.length]} ${chart.angle}deg ${end}deg`],
        }
      },
      { angle: 0, stops: [] },
    )
    .stops
    .join(', ')

  return (
    <div className="adm-pie-chart">
      <div
        className="adm-pie-chart__ring"
        role="img"
        aria-label={`${breakdown.label}: ${breakdown.segments.map(({ label, value }) => `${label} ${value}`).join(', ')}`}
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <span className="adm-pie-chart__total">{formatValue(total)}</span>
        <span className="adm-pie-chart__caption">total</span>
      </div>
      <ul className="adm-pie-chart__legend">
        {breakdown.segments.map((segment, index) => (
          <li key={segment.label}>
            <span
              className="adm-pie-chart__swatch"
              style={{ backgroundColor: pieColors[index % pieColors.length] }}
            />
            <span className="adm-pie-chart__name">{segment.label}</span>
            <strong>{segment.value}</strong>
            <small>{Math.round((segment.value / total) * 100)}%</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DashboardAnalytics({ dashboard, userCount }) {
  const allMetrics = getDashboardMetrics(dashboard, userCount)
  const metrics = allMetrics.slice(0, 8)
  const chartMetrics = allMetrics.filter(
    ({ numericValue }) => numericValue !== null && numericValue >= 0,
  )
  const statusBreakdowns = getDashboardStatusBreakdowns(dashboard)

  if (metrics.length === 0) {
    return (
      <div className="adm-card">
        <EmptyState
          title="No dashboard metrics yet"
          text="The dashboard endpoint returned no summary fields."
        />
      </div>
    )
  }

  return (
    <div className="adm-dashboard">
      <style>{dashboardTheme}</style>

      <section className="adm-stats">
        {metrics.map((metric, index) => {
          const MetricIcon = getMetricIcon(metric.label)

          return (
            <article
              className={`adm-stat adm-stat--${['forest', 'gold', 'leaf', 'clay'][index % 4]}`}
              key={metric.label}
            >
              <div className="adm-stat__heading">
                <span className="adm-stat__icon" aria-hidden="true">
                  <MetricIcon size={17} strokeWidth={2} />
                </span>
                <span className="adm-stat__label">{metric.label}</span>
              </div>
              <strong className="adm-stat__value">{metric.value}</strong>
            </article>
          )
        })}
      </section>

      <section className="adm-charts" aria-label="Dashboard analytics">
        <article className="adm-card adm-chart-card">
          <div className="adm-card__header">
            <div>
              <h3><BarChart3 size={18} aria-hidden="true" />Metrics overview</h3>
              <p>Compare counts reported by the dashboard API</p>
            </div>
          </div>
          <div className="adm-chart-card__body">
            <BarChart metrics={chartMetrics} />
          </div>
        </article>

        <article className="adm-card adm-chart-card">
          <div className="adm-card__header">
            <div>
              <h3><PieChartIcon size={18} aria-hidden="true" />Status breakdown</h3>
              <p>Distribution of statuses reported by the dashboard API</p>
            </div>
          </div>
          <div className="adm-chart-card__body">
            {statusBreakdowns.length > 0 ? (
              <div className="adm-pie-chart__groups">
                {statusBreakdowns.map((breakdown) => (
                  <section className="adm-pie-chart__group" key={breakdown.label}>
                    <h4>{breakdown.label}</h4>
                    <PieChart breakdown={breakdown} />
                  </section>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No status breakdown available"
                text="The dashboard endpoint did not return counts grouped by status."
              />
            )}
          </div>
        </article>
      </section>
    </div>
  )
}

export default DashboardAnalytics