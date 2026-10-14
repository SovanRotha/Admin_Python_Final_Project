import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Cloud,
  Database,
  FileCheck2,
  FileSearch,
  Globe2,
  Map,
  MapPin,
  MoreHorizontal,
  Plane,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TicketCheck,
  Users,
  Wifi,
  X,
} from 'lucide-react'
import { getInitials, getValue } from './admin/adminUtils.js'

const sampleIncidents = [
  {
    id: 'EV-10482',
    place: 'Grand Palace Perimeter',
    location: 'Bangkok, Thailand',
    category: 'Transfer Scam Reported',
    reporter: 'Liam Vance',
    handle: '@liamvance',
    status: 'Pending review',
    severity: 'High',
    icon: 'landmark',
    description: 'A reported tuk-tuk transfer offer near the main visitor entrance.',
  },
  {
    id: 'EV-10479',
    place: 'Chiang Mai Sunday Walking Street',
    location: 'Chiang Mai, Thailand',
    category: 'Relocation / Closed Place',
    reporter: 'Mayumi K.',
    handle: '@mayumi.travels',
    status: 'Pending review',
    severity: 'Medium',
    icon: 'market',
    description: 'Traveler report says several listed vendor locations have moved.',
  },
  {
    id: 'EV-10473',
    place: 'Rassada Pier → Koh Phi Phi Ferry',
    location: 'Phuket, Thailand',
    category: 'Timetable Inaccurate',
    reporter: 'Phuket Marine Hub',
    handle: '@phuketmarine',
    status: 'Verified & ready',
    severity: 'Low',
    icon: 'ferry',
    description: 'A ferry departure time was checked against the operator timetable.',
  },
  {
    id: 'EV-10466',
    place: 'Jay Fai Michelin Crab Omelette',
    location: 'Bangkok, Thailand',
    category: 'Outdated / Fraudulent Pricing',
    reporter: 'Marc Dupont',
    handle: '@marcdupont',
    status: 'Pending review',
    severity: 'Medium',
    icon: 'food',
    description: 'A traveler flagged a menu price that may no longer be current.',
  },
]

const sampleOversight = [
  {
    ...sampleIncidents[0],
    id: 'DST-0021',
    place: 'Bangkok City Collection',
    category: 'Destination content review',
    status: 'Verified & ready',
    severity: 'Low',
    description: 'Destination information and traveler guidance are up to date.',
  },
  {
    ...sampleIncidents[1],
    id: 'PLC-0318',
    place: 'Chiang Mai Night Market',
    category: 'Place listing needs review',
    status: 'Pending review',
    severity: 'Medium',
  },
  {
    ...sampleIncidents[2],
    id: 'PLC-0294',
    place: 'Rassada Pier',
    category: 'Transport listing verification',
    status: 'Verified & ready',
    severity: 'Low',
  },
  {
    ...sampleIncidents[3],
    id: 'PLC-0215',
    place: 'Jay Fai',
    category: 'Pricing freshness alert',
    status: 'Pending review',
    severity: 'High',
  },
]

const kpiDefinitions = [
  {
    title: 'Total Registered Travelers',
    value: '148,290',
    subtitle: '+1,210 onboarding through referral links',
    change: '+12.4%',
    icon: Users,
    tone: 'blue',
    keywords: ['user', 'traveler', 'account'],
  },
  {
    title: 'Active Trips Managed',
    value: '14,820',
    subtitle: '$31.6M aggregate travel budget involved',
    icon: Plane,
    tone: 'violet',
    keywords: ['trip', 'itinerary'],
  },
  {
    title: 'AI Screenshot Parse Jobs',
    value: '94,120',
    subtitle: '98.6% auto-resolve success rate',
    icon: FileSearch,
    tone: 'amber',
    keywords: ['ocr', 'parse', 'screenshot', 'ticket'],
  },
  {
    title: 'Destination & Place Catalog',
    value: '1,420',
    subtitle: 'Curated sites across 88,920 landmarks',
    icon: Map,
    tone: 'green',
    keywords: ['destination', 'place', 'catalog'],
  },
]

const statusMetrics = [
  { label: 'FX RATES FEED', value: 'ECD & SuperRich', note: 'Updated 3m ago', icon: Globe2, tone: 'green' },
  { label: 'OCR QUEUE LATENCY', value: '0.8s avg/page', note: 'Active', icon: Activity, tone: 'blue' },
  { label: 'ZERO-KNOWLEDGE VAULT', value: 'Worker: Optimal', note: 'Encrypted', icon: ShieldCheck, tone: 'violet' },
  { label: 'EMBEDDINGS SYNC', value: 'All 14 Gateways', note: '100% OK', icon: Wifi, tone: 'green' },
]

const chartMonths = [
  { month: 'Jan', sea: 42, east: 28, europe: 18 },
  { month: 'Feb', sea: 54, east: 36, europe: 25 },
  { month: 'Mar', sea: 48, east: 43, europe: 32 },
  { month: 'Apr', sea: 68, east: 48, europe: 39 },
  { month: 'May', sea: 58, east: 55, europe: 43 },
  { month: 'Jun', sea: 76, east: 62, europe: 50 },
  { month: 'Jul', sea: 88, east: 73, europe: 61 },
]

const documentKinds = [
  { label: 'Flight Boarding Passes', value: 42, color: '#2563eb' },
  { label: 'Hotel & Villa Bookings', value: 31, color: '#7c3aed' },
  { label: 'Transit & Island Passes', value: 15, color: '#0f9f84' },
  { label: 'Expense Receipts & Split Ledger', value: 12, color: '#f59e0b' },
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
        {metric.change ? <span className="mission-change"><ArrowUpRight size={13} />{metric.change}</span> : null}
      </div>
      <p>{metric.subtitle}</p>
    </article>
  )
}

function MetricStatusCard({ metric }) {
  const Icon = metric.icon
  return (
    <article className="mission-status">
      <span className={`mission-status__icon mission-status__icon--${metric.tone}`}><Icon size={17} /></span>
      <div className="mission-status__content">
        <span className="mission-eyebrow">{metric.label}</span>
        <strong>{metric.value}</strong>
      </div>
      <span className={`mission-status__pill mission-status__pill--${metric.tone}`}>
        <span className="mission-status__dot" />{metric.note}
      </span>
    </article>
  )
}

function ChartSection() {
  const maxTotal = Math.max(...chartMonths.map((month) => month.sea + month.east + month.europe))
  const gradient = `conic-gradient(${documentKinds
    .reduce((acc, item) => {
      const start = acc.end
      const end = start + item.value * 3.6
      acc.stops.push(`${item.color} ${start}deg ${end}deg`)
      acc.end = end
      return acc
    }, { end: 0, stops: [] }).stops.join(', ')})`

  return (
    <section className="mission-chart-grid" aria-label="Trip and OCR analytics">
      <article className="mission-card mission-chart-card">
        <div className="mission-card__heading">
          <div>
            <div className="mission-heading-icon"><BarChart3 size={17} /></div>
            <h2>Trip Lifecycle Metrics</h2>
            <p>Trip Creations &amp; Itinerary Volume <span className="mission-muted">· Jan–Jul 2026</span></p>
          </div>
          <button className="mission-icon-button" type="button" aria-label="More trip metric options"><MoreHorizontal size={18} /></button>
        </div>
        <div className="mission-chart-legend">
          <span><i className="mission-legend-dot mission-legend-dot--blue" />Southeast Asia</span>
          <span><i className="mission-legend-dot mission-legend-dot--violet" />Japan &amp; East Asia</span>
          <span><i className="mission-legend-dot mission-legend-dot--amber" />Europe &amp; UK</span>
        </div>
        <div className="mission-bar-chart">
          <div className="mission-chart-y-axis"><span>3k</span><span>2k</span><span>1k</span><span>0</span></div>
          <div className="mission-bar-chart__plot">
            {[0, 1, 2, 3].map((line) => <span key={line} className="mission-chart-gridline" style={{ bottom: `${line * 33.333}%` }} />)}
            <div className="mission-bars">
              {chartMonths.map((month) => {
                const total = month.sea + month.east + month.europe
                return (
                  <div className="mission-bar-group" key={month.month} title={`${month.month}: ${total} itineraries`}>
                    <div className="mission-stack" style={{ height: `${(total / maxTotal) * 100}%` }}>
                      <span className="mission-stack__segment mission-stack__segment--amber" style={{ height: `${(month.europe / total) * 100}%` }} />
                      <span className="mission-stack__segment mission-stack__segment--violet" style={{ height: `${(month.east / total) * 100}%` }} />
                      <span className="mission-stack__segment mission-stack__segment--blue" style={{ height: `${(month.sea / total) * 100}%` }} />
                    </div>
                    <span className="mission-bar-label">{month.month}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="mission-insight">
          <span className="mission-insight__icon"><Sparkles size={16} /></span>
          <p>Bangkok &amp; Tokyo continue as top cross-border anchors with <strong>+28%</strong> itinerary extensions.</p>
          <button type="button" className="mission-link">View Detailed Ingest Logs <ArrowRight size={14} /></button>
        </div>
      </article>

      <article className="mission-card mission-chart-card">
        <div className="mission-card__heading">
          <div>
            <div className="mission-heading-icon mission-heading-icon--violet"><FileCheck2 size={17} /></div>
            <h2>OCR Model Stats</h2>
            <p>Parsed Document Split <span className="mission-muted">· 94,120 parsed tickets &amp; receipts</span></p>
          </div>
          <button className="mission-icon-button" type="button" aria-label="More OCR metric options"><MoreHorizontal size={18} /></button>
        </div>
        <div className="mission-donut-layout">
          <div className="mission-donut" role="img" aria-label="Parsed document split: 42% flight boarding passes, 31% hotel and villa bookings, 15% transit and island passes, 12% expense receipts">
            <div className="mission-donut__center"><strong>94.1k</strong><span>documents</span></div>
            <div className="mission-donut__graphic" style={{ background: gradient }} />
          </div>
          <ul className="mission-donut-legend">
            {documentKinds.map((kind) => (
              <li key={kind.label}>
                <span className="mission-legend-dot" style={{ backgroundColor: kind.color }} />
                <span>{kind.label}</span>
                <strong>{kind.value}%</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="mission-review-note"><ShieldCheck size={15} />Fallback Human Reviews: <strong>1.4%</strong></div>
      </article>
    </section>
  )
}

function getIncident(record, index) {
  const id = getValue(record, ['id', 'report_id', 'event_id'], `report-${index + 1}`)
  const reporter = getValue(record, ['reporter_name', 'user_name', 'user_email', 'reporter_email', 'user_id'], 'Traveler')
  const category = getValue(record, ['category', 'type', 'reason', 'report_type'], 'Content report')
  return {
    id,
    place: getValue(record, ['place_name', 'destination_name', 'title', 'name'], `Reported place #${index + 1}`),
    location: getValue(record, ['location', 'address', 'destination'], 'Location under review'),
    category: String(category).replace(/[_-]+/g, ' '),
    reporter: String(reporter).split('@')[0],
    handle: getValue(record, ['reporter_handle', 'user_handle'], `@${String(reporter).split('@')[0].toLowerCase().replace(/\s+/g, '.')}`),
    status: getValue(record, ['status', 'state'], 'Pending review'),
    severity: getValue(record, ['severity', 'priority'], 'Medium'),
    description: getValue(record, ['description', 'message', 'details', 'reason'], 'Review the submitted report and verify the latest traveler information.'),
  }
}

function IncidentTable({
  activeTab,
  onActiveTabChange,
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
  const isReports = activeTab === 'reports'
  const hasApiReports = isReports && reportItems.length > 0
  const rows = useMemo(
    () => (
      hasApiReports
        ? reportItems.map((record, index) => ({ ...getIncident(record, index), source: record }))
        : isReports
          ? sampleIncidents
          : sampleOversight
    ),
    [hasApiReports, isReports, reportItems],
  )
  const filteredRows = rows.filter((row) => {
    const searchMatch = `${row.place} ${row.location} ${row.id} ${row.reporter} ${row.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
    const statusMatch = statusFilter === 'all' || row.status.toLowerCase().includes(statusFilter)
    return searchMatch && statusMatch
  })
  const apiTotal = isReports && hasApiReports ? reportTotal : 32
  const pages = Math.max(1, Math.ceil(apiTotal / 4))
  const from = apiTotal === 0 ? 0 : (reportPage - 1) * 4 + 1
  const to = Math.min(reportPage * 4, apiTotal)
  const hasRecordId = (id) => !String(id).startsWith('report-')

  return (
    <section className="mission-card mission-incidents">
      <div className="mission-tabs" role="tablist" aria-label="Admin oversight sections">
        <button
          type="button"
          role="tab"
          aria-selected={isReports}
          className={isReports ? 'is-active' : ''}
          onClick={() => onActiveTabChange('reports')}
        >
          Recent Content Reports &amp; Flagged Places
          <span className="mission-tab-count">3 Pending</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isReports}
          className={!isReports ? 'is-active' : ''}
          onClick={() => onActiveTabChange('oversight')}
        >
          Curated Destinations Oversight &amp; Alerts
        </button>
      </div>
      <div className="mission-table-toolbar">
        <div>
          <h2>{isReports ? 'Traveler-submitted incidents' : 'Catalog integrity queue'}</h2>
          <p>{hasApiReports ? `${reportTotal.toLocaleString()} reports from the admin API` : 'Example incident data'} <span className="mission-muted">· Last synced just now</span></p>
        </div>
        <div className="mission-table-tools">
          <label className="mission-search">
            <Search size={16} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter by location..." aria-label="Filter by location" />
            {search ? <button type="button" onClick={() => setSearch('')} aria-label="Clear search"><X size={14} /></button> : null}
          </label>
          <button type="button" className={`mission-filter-button ${showFilters ? 'is-selected' : ''}`} onClick={() => setShowFilters((visible) => !visible)}>
            <SlidersHorizontal size={15} />Report ID / EV
          </button>
        </div>
      </div>
      {showFilters ? (
        <div className="mission-filter-row">
          <label htmlFor="incident-status">Status</label>
          <select id="incident-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending review</option>
            <option value="verified">Verified &amp; ready</option>
          </select>
          <span>Filter by incident status</span>
        </div>
      ) : null}
      {reportError && isReports ? <p className="mission-api-note" role="status">Live reports unavailable: {reportError}. Showing sample rows.</p> : null}
      <div className="mission-table-scroll">
        <table className="mission-table">
          <thead>
            <tr>
              <th>Place / itinerary reference</th>
              <th>Reported by</th>
              <th>Incident category</th>
              <th>Severity &amp; status</th>
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
                      <span className="mission-place__icon">{row.id.startsWith('DST') ? <Building2 size={16} /> : <MapPin size={16} />}</span>
                      <span><strong>{row.place}</strong><small>{row.location} <span>·</span> {row.id}</small></span>
                    </div>
                    {isExpanded ? <p className="mission-row-details">{row.description}</p> : null}
                  </td>
                  <td>
                    <div className="mission-reporter">
                      <span className="mission-avatar">{getInitials(row.reporter)}</span>
                      <span><strong>{row.reporter}</strong><small>{row.handle}</small></span>
                    </div>
                  </td>
                  <td><span className="mission-category">{row.category}</span></td>
                  <td>
                    <span className={`mission-severity mission-severity--${String(row.severity).toLowerCase()}`}>
                      {String(row.severity).toLowerCase() === 'high' ? <ArrowUpRight size={12} /> : String(row.severity).toLowerCase() === 'low' ? <ArrowDownRight size={12} /> : null}
                      {row.severity}
                    </span>
                    <span className={`mission-status-tag ${String(row.status).toLowerCase().includes('verified') ? 'mission-status-tag--ready' : 'mission-status-tag--pending'}`}>
                      {String(row.status).toLowerCase().includes('verified') ? <Check size={11} /> : <span className="mission-status__dot" />}
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="mission-actions">
                      <button type="button" className="mission-action-link" onClick={() => setExpandedId(isExpanded ? '' : row.id)}>
                        {isExpanded ? 'Close' : 'Inspect'}
                      </button>
                      {record && hasRecordId(row.id) ? (
                        <details className="mission-review">
                          <summary className="mission-action-link">Review</summary>
                          <form className="mission-review__form" onSubmit={(event) => onReportReview(event, row.id)}>
                            <label>Status
                              <select name="status" defaultValue={String(row.status).toLowerCase().includes('verified') ? 'resolved' : 'in_review'}>
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
                      ) : <button type="button" className="mission-action-link mission-action-link--muted" title="Available for live report records">Flag</button>}
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredRows.length === 0 ? (
              <tr><td className="mission-no-results" colSpan="5">No reports match this filter.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <footer className="mission-table-footer">
        <span>Showing {from}–{to} of {apiTotal.toLocaleString()} items</span>
        <div className="mission-pagination">
          <button type="button" aria-label="Previous page" disabled={reportPage <= 1} onClick={() => onPageChange(reportPage - 1)}><ChevronLeft size={16} /></button>
          {[1, 2, 3].map((page) => (
            <button type="button" key={page} className={reportPage === page ? 'is-current' : ''} onClick={() => onPageChange(page)}>{page}</button>
          ))}
          <button type="button" onClick={() => onPageChange(Math.min(pages, reportPage + 1))} disabled={reportPage >= pages}>Next <ChevronRight size={14} /></button>
        </div>
      </footer>
    </section>
  )
}

function SystemHealth() {
  const [safetyLock, setSafetyLock] = useState(false)
  return (
    <section className="mission-health" aria-label="System health">
      <article className="mission-health-card">
        <span className="mission-health-icon mission-health-icon--blue"><Database size={17} /></span>
        <div><strong>Warm Redis Cache</strong><p>2.02B key/value entries active</p></div>
        <button type="button" className="mission-flush-button" disabled title="Cache flush is not connected to an API endpoint">Flush Cache</button>
      </article>
      <article className="mission-health-card">
        <span className="mission-health-icon mission-health-icon--green"><TicketCheck size={17} /></span>
        <div><strong>OCR Parser v4.3-1C</strong><p>Precision &amp; accuracy 98.9%</p></div>
        <span className="mission-health-badge">Keying 100%</span>
      </article>
      <article className="mission-health-card">
        <span className="mission-health-icon mission-health-icon--amber"><ShieldCheck size={17} /></span>
        <div><strong>Read-Only Safety Lock</strong><p>Prevent write lock collisions</p></div>
        <button
          type="button"
          className={`mission-switch ${safetyLock ? 'is-on' : ''}`}
          role="switch"
          aria-checked={safetyLock}
          aria-label="Toggle read-only safety lock"
          onClick={() => setSafetyLock((enabled) => !enabled)}
        ><span /></button>
        <span className="mission-switch-label">{safetyLock ? 'Enabled' : 'Disabled'}</span>
      </article>
    </section>
  )
}

function DashboardAnalytics({
  dashboard,
  onRefresh,
  onReportPageChange,
  onReportReview,
  pendingReportId,
  reportError = '',
  reportItems = [],
  reportPage = 1,
  reportTotal = 0,
  userCount,
}) {
  const [period, setPeriod] = useState('Last 7 Days')
  const [activeIncidentTab, setActiveIncidentTab] = useState('reports')
  const apiMetrics = getApiMetrics(dashboard, userCount)
  const metrics = kpiDefinitions.map((metric, index) => {
    const apiValue = findMetric(apiMetrics, metric.keywords)
    return {
      ...metric,
      value: index === 0 && userCount !== undefined
        ? new Intl.NumberFormat().format(userCount)
        : apiValue ?? metric.value,
    }
  })

  return (
    <div className="mission-control flex flex-col gap-4">
      <section className="mission-toolbar">
        <div className="mission-badges">
          <span className="mission-prod-badge"><span />PROD-cluster A-2</span>
          <span className="mission-latency"><Activity size={13} />Latency <strong>41ms</strong></span>
          <span className="mission-sample-label">Illustrative telemetry</span>
        </div>
        <div className="mission-toolbar__actions">
          <div className="mission-periods" role="group" aria-label="Dashboard date range">
            {['Last 7 Days', 'Last 30 Days', 'Year to Date'].map((item) => (
              <button type="button" key={item} className={period === item ? 'is-active' : ''} onClick={() => setPeriod(item)}>{item}</button>
            ))}
          </div>
          <label className="mission-cluster">
            <span>Cluster:</span>
            <select aria-label="Select cluster" defaultValue="ap-southeast-1">
              <option value="ap-southeast-1">AP-Southeast-1</option>
              <option value="ap-northeast-1">AP-Northeast-1</option>
              <option value="eu-west-1">EU-West-1</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <button type="button" className="mission-sync-button" onClick={onRefresh}>
            <RefreshCw size={15} />Sync Pipelines
          </button>
        </div>
      </section>

      <section className="mission-status-grid grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="System status metrics">
        {statusMetrics.map((metric) => <MetricStatusCard key={metric.label} metric={metric} />)}
      </section>

      <section className="mission-kpi-grid grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Key performance indicators">
        {metrics.map((metric) => <KpiCard metric={metric} key={metric.title} />)}
      </section>

      <ChartSection />

      <IncidentTable
        activeTab={activeIncidentTab}
        onActiveTabChange={setActiveIncidentTab}
        onPageChange={onReportPageChange}
        onReportReview={onReportReview}
        pendingReportId={pendingReportId}
        reportError={reportError}
        reportItems={reportItems}
        reportPage={reportPage}
        reportTotal={reportTotal}
      />

      <SystemHealth />
      <div className="mission-footer"><Cloud size={14} />Platform telemetry is illustrative; traveler counts and report rows are sourced from the admin API when available.</div>
    </div>
  )
}

export default DashboardAnalytics
