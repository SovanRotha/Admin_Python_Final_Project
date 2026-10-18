import { useMemo, useState } from 'react'
import {
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Cloud,
  FileCheck2,
  FileSearch,
  Map,
  MapPin,
  MoreHorizontal,
  Plane,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { getInitials, getValue } from './admin/adminUtils.js'

const REGION_COLORS = {
  southeast_asia: '#2563eb',
  east_asia: '#7c3aed',
  europe_uk: '#f59e0b',
  other: '#94a3b8',
}

const OCR_CATEGORY_COLORS = {
  flight: '#2563eb',
  hotel: '#7c3aed',
  transit: '#0f9f84',
  expense: '#f59e0b',
  other: '#94a3b8',
}

const kpiDefinitions = [
  {
    title: 'Total Registered Travelers',
    value: '—',
    subtitle: 'Registered platform accounts',
    icon: Users,
    tone: 'blue',
    keywords: ['user', 'traveler', 'account'],
  },
  {
    title: 'Active Trips Managed',
    value: '—',
    subtitle: 'Trips in planning, upcoming, or ongoing status',
    icon: Plane,
    tone: 'violet',
    keywords: ['trip', 'itinerary'],
  },
  {
    title: 'AI Screenshot Parse Jobs',
    value: '—',
    subtitle: 'Persisted screenshot extraction jobs',
    icon: FileSearch,
    tone: 'amber',
    keywords: ['ocr', 'parse', 'screenshot', 'ticket'],
  },
  {
    title: 'Destination Catalog',
    value: '—',
    subtitle: 'Destinations in the catalog',
    icon: Map,
    tone: 'green',
    keywords: ['destination catalog'],
  },
  {
    title: 'Place Catalog',
    value: '—',
    subtitle: 'Places saved in the catalog',
    icon: MapPin,
    tone: 'green',
    keywords: ['place catalog'],
  },
]

function getApiMetrics(dashboard, userCount) {
  const metrics = []
  const collect = (value, prefix = '') => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return
    Object.entries(value).forEach(([key, item]) => {
      const label = `${prefix} ${key}`.trim().replace(/[_-]+/g, ' ').toLowerCase()
      if (typeof item === 'number' && Number.isFinite(item)) {
        metrics.push({ label, value: item })
      } else if (item && typeof item === 'object' && !Array.isArray(item)) {
        collect(item, label)
      }
    })
  }

  collect(dashboard?.statistics ?? dashboard)
  if (typeof userCount === 'number' && Number.isFinite(userCount)) {
    metrics.unshift({ label: 'total users', value: userCount })
  }
  return metrics
}

function findMetric(metrics, keywords) {
  const found = metrics.find(({ label }) => keywords.some((keyword) => label.includes(keyword)))
  return found ? new Intl.NumberFormat().format(found.value) : undefined
}

function KpiCard({ metric }) {
  const Icon = metric.icon
  return (
    <article className={`mission-kpi mission-kpi--${metric.tone}`}>
      <div className="mission-kpi__top">
        <span className="mission-kpi__icon"><Icon size={18} aria-hidden="true" /></span>
        <span className="mission-kpi__label">{metric.title}</span>
        <button type="button" className="mission-icon-button" aria-label={`${metric.title} information`} title={metric.title}>
          <CircleHelp size={15} />
        </button>
      </div>
      <div className="mission-kpi__value-line">
        <strong>{metric.value}</strong>
      </div>
      <p>{metric.subtitle}</p>
    </article>
  )
}

function ChartSection({ analytics }) {
  const tripLifecycle = analytics?.trip_lifecycle
  const ocrStats = analytics?.ocr_model_stats
  const regions = tripLifecycle?.regions || []
  const months = tripLifecycle?.months || []
  const categories = ocrStats?.categories || []
  const topDestinations = tripLifecycle?.top_destinations || []
  const maxTrips = Math.max(
    0,
    ...months.map((month) =>
      regions.reduce((total, region) => total + (month.regions?.[region.key]?.trips || 0), 0),
    ),
  )
  const totalItineraryItems = months.reduce(
    (total, month) =>
      total + regions.reduce(
        (monthTotal, region) =>
          monthTotal + (month.regions?.[region.key]?.itinerary_items || 0),
        0,
      ),
    0,
  )
  const axisStep = Math.max(1, Math.ceil(maxTrips / 3))
  const axisMaximum = axisStep * 3
  const numberFormat = new Intl.NumberFormat()
  const compactFormat = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
  const totalDocuments = ocrStats?.total_documents || 0
  let gradientEnd = 0
  const gradientStops = categories.map((category) => {
    const start = gradientEnd
    gradientEnd += (category.percentage || 0) * 3.6
    return `${OCR_CATEGORY_COLORS[category.key] || OCR_CATEGORY_COLORS.other} ${start}deg ${gradientEnd}deg`
  })
  const gradient = totalDocuments
    ? `conic-gradient(${gradientStops.join(', ')})`
    : 'conic-gradient(#e2e8f0 0deg 360deg)'
  const humanReviewRate = ocrStats?.human_review_rate

  return (
    <section className="mission-chart-grid" aria-label="Trip and OCR analytics">
      <article className="mission-card mission-chart-card">
        <div className="mission-card__heading">
          <div>
            <div className="mission-heading-icon"><BarChart3 size={17} /></div>
            <h2>Trip Lifecycle Metrics</h2>
            <p>Trip Creations &amp; Itinerary Volume <span className="mission-muted">· {tripLifecycle?.period?.label || 'No data'}</span></p>
          </div>
          <button className="mission-icon-button" type="button" aria-label="More trip metric options"><MoreHorizontal size={18} /></button>
        </div>
        <div className="mission-chart-legend">
          {regions.map((region) => (
            <span key={region.key}>
              <i
                className="mission-legend-dot"
                style={{ backgroundColor: REGION_COLORS[region.key] || REGION_COLORS.other }}
              />
              {region.label}
            </span>
          ))}
        </div>
        <div className="mission-bar-chart">
          <div className="mission-chart-y-axis">
            {[3, 2, 1, 0].map((tick) => (
              <span key={tick}>{compactFormat.format(axisStep * tick)}</span>
            ))}
          </div>
          <div className="mission-bar-chart__plot">
            {[0, 1, 2, 3].map((line) => <span key={line} className="mission-chart-gridline" style={{ bottom: `${line * 33.333}%` }} />)}
            <div className="mission-bars">
              {months.map((month) => {
                const total = regions.reduce(
                  (sum, region) => sum + (month.regions?.[region.key]?.trips || 0),
                  0,
                )
                const itineraryItems = regions.reduce(
                  (sum, region) => sum + (month.regions?.[region.key]?.itinerary_items || 0),
                  0,
                )
                return (
                  <div
                    className="mission-bar-group"
                    key={month.month}
                    title={`${month.label}: ${numberFormat.format(total)} trips · ${numberFormat.format(itineraryItems)} itinerary items`}
                  >
                    <div className="mission-stack" style={{ height: `${(total / axisMaximum) * 100}%` }}>
                      {[...regions].reverse().map((region) => {
                        const regionTrips = month.regions?.[region.key]?.trips || 0
                        return (
                          <span
                            className="mission-stack__segment"
                            key={region.key}
                            style={{
                              backgroundColor: REGION_COLORS[region.key] || REGION_COLORS.other,
                              height: `${total ? (regionTrips / total) * 100 : 0}%`,
                            }}
                          />
                        )
                      })}
                    </div>
                    <span className="mission-bar-label">{month.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="mission-insight">
          <span className="mission-insight__icon"><Sparkles size={16} /></span>
          <p>
            {topDestinations.length
              ? <>Top destinations by trip creations: <strong>{topDestinations.map(({ name, trips }) => `${name} (${numberFormat.format(trips)})`).join(' · ')}</strong></>
              : 'No trips were created in this period.'}
          </p>
          <span className="mission-muted">
            {numberFormat.format(totalItineraryItems)} itinerary items; hover over a bar for its monthly total.
          </span>
        </div>
      </article>

      <article className="mission-card mission-chart-card">
        <div className="mission-card__heading">
          <div>
            <div className="mission-heading-icon mission-heading-icon--violet"><FileCheck2 size={17} /></div>
            <h2>OCR Model Stats</h2>
            <p>Parsed Document Split <span className="mission-muted">· {numberFormat.format(totalDocuments)} parsed documents</span></p>
          </div>
          <button className="mission-icon-button" type="button" aria-label="More OCR metric options"><MoreHorizontal size={18} /></button>
        </div>
        <div className="mission-donut-layout">
          <div
            className="mission-donut"
            role="img"
            aria-label={categories.length
              ? `Parsed document split: ${categories.map((category) => `${category.label} ${category.percentage}%`).join(', ')}`
              : 'No parsed documents'}
          >
            <div className="mission-donut__center"><strong>{compactFormat.format(totalDocuments)}</strong><span>documents</span></div>
            <div className="mission-donut__graphic" style={{ background: gradient }} />
          </div>
          <ul className="mission-donut-legend">
            {categories.map((category) => (
              <li key={category.key}>
                <span className="mission-legend-dot" style={{ backgroundColor: OCR_CATEGORY_COLORS[category.key] || OCR_CATEGORY_COLORS.other }} />
                <span>{category.label} <small>({numberFormat.format(category.count)})</small></span>
                <strong>{category.percentage}%</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="mission-review-note">
          <ShieldCheck size={15} />
          Fallback Human Reviews:
          <strong>{humanReviewRate === null || humanReviewRate === undefined ? '—' : `${humanReviewRate}%`}</strong>
          <span className="mission-muted">
            {numberFormat.format(ocrStats?.human_review_count || 0)} of {numberFormat.format(totalDocuments)} flagged
          </span>
        </div>
      </article>
    </section>
  )
}

function getIncident(record) {
  const id = getValue(record, ['id', 'report_id', 'event_id'])
  const reporter = getValue(record, ['reporter_email', 'user_email', 'email'], '—')
  const contentType = getValue(record, ['content_type', 'target_type', 'resource_type'])
  const contentId = getValue(record, ['content_id', 'target_id', 'resource_id'])
  return {
    id,
    place: `Report #${id}`,
    location: [contentType, contentId ? `ID ${contentId}` : ''].filter(Boolean).join(' · ') || '—',
    category: getValue(record, ['reason', 'title', 'description', 'message'], '—'),
    reporter,
    handle: reporter,
    status: getValue(record, ['status', 'state'], 'Unknown'),
    description: getValue(record, ['resolution', 'review_notes'], ''),
  }
}

function CatalogOverview({
  destinationItems,
  destinationTotal,
  destinationError,
  placeItems,
  placeTotal,
  placeError,
}) {
  return (
    <section className="mission-chart-grid" aria-label="Saved destinations and places">
      <article className="mission-card">
        <div className="mission-table-toolbar">
          <div>
            <h2>Saved destinations</h2>
            <p>{destinationTotal.toLocaleString()} destinations in the catalog</p>
          </div>
        </div>
        {destinationError ? <p className="mission-api-note" role="alert">Unable to load destinations: {destinationError}</p> : null}
        <div className="mission-table-scroll">
          <table className="mission-table">
            <thead>
              <tr><th>Destination</th><th>Country</th><th>Saved</th></tr>
            </thead>
            <tbody>
              {destinationItems.map((destination) => (
                <tr key={destination.id}>
                  <td><strong>{destination.name}</strong></td>
                  <td>{destination.country} ({destination.country_code})</td>
                  <td>{destination.created_at ? new Date(destination.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
              {destinationItems.length === 0 ? (
                <tr><td className="mission-no-results" colSpan="3">{destinationError ? 'Destinations are unavailable.' : 'No destinations have been saved.'}</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>

      <article className="mission-card">
        <div className="mission-table-toolbar">
          <div>
            <h2>Saved places</h2>
            <p>{placeTotal.toLocaleString()} places in the catalog</p>
          </div>
        </div>
        {placeError ? <p className="mission-api-note" role="alert">Unable to load places: {placeError}</p> : null}
        <div className="mission-table-scroll">
          <table className="mission-table">
            <thead>
              <tr><th>Place</th><th>Category</th><th>Destination ID</th></tr>
            </thead>
            <tbody>
              {placeItems.map((place) => (
                <tr key={place.id}>
                  <td><strong>{place.name}</strong></td>
                  <td>{place.category}</td>
                  <td>{place.destination_id}</td>
                </tr>
              ))}
              {placeItems.length === 0 ? (
                <tr><td className="mission-no-results" colSpan="3">{placeError ? 'Places are unavailable.' : 'No places have been saved.'}</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

function IncidentTable({
  onPageChange,
  onReportReview,
  pendingReportId,
  reportError,
  reportItems,
  reportPage,
  reportTotal,
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedId, setExpandedId] = useState('')
  const rows = useMemo(
    () => reportItems.map((record) => ({ ...getIncident(record), source: record })),
    [reportItems],
  )
  const filteredRows = rows.filter((row) => {
    const searchMatch = `${row.place} ${row.location} ${row.id} ${row.reporter} ${row.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
    const statusMatch = statusFilter === 'all' || row.status.toLowerCase().includes(statusFilter)
    return searchMatch && statusMatch
  })
  const pages = Math.max(1, Math.ceil(reportTotal / 4))
  const from = reportTotal === 0 ? 0 : (reportPage - 1) * 4 + 1
  const to = Math.min(reportPage * 4, reportTotal)

  return (
    <section className="mission-card mission-incidents">
      <div className="mission-table-toolbar">
        <div>
          <h2>Traveler-submitted reports</h2>
          <p>{reportTotal.toLocaleString()} reports</p>
        </div>
        <div className="mission-table-tools">
          <label className="mission-search">
            <Search size={16} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter reports..." aria-label="Filter reports" />
            {search ? <button type="button" onClick={() => setSearch('')} aria-label="Clear search"><X size={14} /></button> : null}
          </label>
          <button type="button" className={`mission-filter-button ${showFilters ? 'is-selected' : ''}`} onClick={() => setShowFilters((visible) => !visible)}>
            <SlidersHorizontal size={15} />Filters
          </button>
        </div>
      </div>
      {showFilters ? (
        <div className="mission-filter-row">
          <label htmlFor="incident-status">Status</label>
          <select id="incident-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending review</option>
            <option value="in_review">In review</option>
            <option value="resolved">Resolved</option>
          </select>
          <span>Filter reports by status</span>
        </div>
      ) : null}
      {reportError ? <p className="mission-api-note" role="alert">Unable to load reports: {reportError}</p> : null}
      <div className="mission-table-scroll">
        <table className="mission-table">
          <thead>
            <tr>
              <th>Report</th>
              <th>Reported by</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Admin actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => {
              const record = row.source
              const isExpanded = expandedId === row.id
              return (
                <tr key={row.id}>
                  <td>
                    <div className="mission-place">
                      <span className="mission-place__icon"><MapPin size={16} /></span>
                      <span><strong>{row.place}</strong><small>{row.location} <span>·</span> {row.id}</small></span>
                    </div>
                    {isExpanded && row.description ? <p className="mission-row-details">{row.description}</p> : null}
                  </td>
                  <td>
                    <div className="mission-reporter">
                      <span className="mission-avatar">{getInitials(row.reporter)}</span>
                      <span><strong>{row.reporter}</strong></span>
                    </div>
                  </td>
                  <td><span className="mission-category">{row.category}</span></td>
                  <td>
                    <span className={`mission-status-tag ${String(row.status).toLowerCase() === 'resolved' ? 'mission-status-tag--ready' : 'mission-status-tag--pending'}`}>
                      {String(row.status).toLowerCase() === 'resolved' ? <Check size={11} /> : <span className="mission-status__dot" />}
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="mission-actions">
                      <button type="button" className="mission-action-link" onClick={() => setExpandedId(isExpanded ? '' : row.id)}>
                        {isExpanded ? 'Close' : 'Inspect'}
                      </button>
                      {record ? (
                        <details className="mission-review">
                          <summary className="mission-action-link">Review</summary>
                          <form className="mission-review__form" onSubmit={(event) => onReportReview(event, row.id)}>
                            <label>Status
                              <select name="status" defaultValue={row.status}>
                                <option value="pending">Pending review</option>
                                <option value="in_review">In review</option>
                                <option value="resolved">Resolved</option>
                              </select>
                            </label>
                            <label>Resolution
                              <textarea name="resolution" rows="2" defaultValue={getValue(record, ['resolution', 'review_notes'])} />
                            </label>
                            <button type="submit" disabled={pendingReportId === row.id}>
                              {pendingReportId === row.id ? 'Saving…' : 'Save review'}
                            </button>
                          </form>
                        </details>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredRows.length === 0 ? (
              <tr>
                <td className="mission-no-results" colSpan="5">
                  {reportError ? 'Reports are unavailable.' : search || statusFilter !== 'all' ? 'No reports match this filter.' : 'No reports have been submitted.'}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <footer className="mission-table-footer">
        <span>Showing {from}–{to} of {reportTotal.toLocaleString()} reports</span>
        <div className="mission-pagination">
          <button type="button" aria-label="Previous page" disabled={reportPage <= 1} onClick={() => onPageChange(reportPage - 1)}><ChevronLeft size={16} /></button>
          <button type="button" onClick={() => onPageChange(Math.min(pages, reportPage + 1))} disabled={reportPage >= pages}>Next <ChevronRight size={14} /></button>
        </div>
      </footer>
    </section>
  )
}

function DashboardAnalytics({
  analytics,
  dashboard,
  destinationItems = [],
  destinationTotal = 0,
  destinationError = '',
  onRefresh,
  onReportPageChange,
  onReportReview,
  pendingReportId,
  reportError = '',
  reportItems = [],
  reportPage = 1,
  reportTotal = 0,
  placeItems = [],
  placeTotal = 0,
  placeError = '',
  userCount,
}) {
  const [activeDashboardSection, setActiveDashboardSection] = useState('reports')
  const apiMetrics = getApiMetrics(dashboard, userCount)
  const metrics = kpiDefinitions.map((metric) => {
    const apiValue = findMetric(apiMetrics, metric.keywords)
    return {
      ...metric,
      value: apiValue ?? metric.value,
    }
  })

  return (
    <div className="mission-control flex flex-col gap-4">
      <section className="mission-toolbar">
        <div className="mission-badges">
          <span className="mission-prod-badge"><span />Live database metrics</span>
        </div>
        <div className="mission-toolbar__actions">
          <button type="button" className="mission-sync-button" onClick={onRefresh}>
            <RefreshCw size={15} />Refresh data
          </button>
        </div>
      </section>

      <section className="mission-kpi-grid grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Key performance indicators">
        {metrics.map((metric) => <KpiCard metric={metric} key={metric.title} />)}
      </section>

      <ChartSection analytics={analytics} />

      <section className="mission-card mission-incidents">
        <div className="mission-tabs" role="tablist" aria-label="Saved dashboard data">
          <button
            type="button"
            role="tab"
            aria-selected={activeDashboardSection === 'reports'}
            className={activeDashboardSection === 'reports' ? 'is-active' : ''}
            onClick={() => setActiveDashboardSection('reports')}
          >
            Reports <span className="mission-tab-count">{reportTotal.toLocaleString()}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeDashboardSection === 'catalog'}
            className={activeDashboardSection === 'catalog' ? 'is-active' : ''}
            onClick={() => setActiveDashboardSection('catalog')}
          >
            Saved destinations &amp; places
            <span className="mission-tab-count">{(destinationTotal + placeTotal).toLocaleString()}</span>
          </button>
        </div>
        {activeDashboardSection === 'reports' ? (
          <IncidentTable
            onPageChange={onReportPageChange}
            onReportReview={onReportReview}
            pendingReportId={pendingReportId}
            reportError={reportError}
            reportItems={reportItems}
            reportPage={reportPage}
            reportTotal={reportTotal}
          />
        ) : (
          <CatalogOverview
            destinationItems={destinationItems}
            destinationTotal={destinationTotal}
            destinationError={destinationError}
            placeItems={placeItems}
            placeTotal={placeTotal}
            placeError={placeError}
          />
        )}
      </section>

      <div className="mission-footer"><Cloud size={14} />Dashboard values are loaded from persisted backend records.</div>
    </div>
  )
}

export default DashboardAnalytics
