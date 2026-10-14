import { useEffect, useState } from 'react'
import adminApi from '../services/adminApi.js'
import ContentManagementPage from './ContentManagementPage.jsx'
import DestinationPage from './DestinationPage.jsx'
import PlacePage from './PlacePage.jsx'
import '../App.css'

const PAGE_SIZE = 10

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', description: 'Platform overview', icon: 'dashboard' },
  { id: 'destinations', label: 'Destinations', description: 'Publish destinations', icon: 'pin' },
  { id: 'places', label: 'Places', description: 'Publish places in destinations', icon: 'compass' },
  { id: 'users', label: 'Users', description: 'Search and update user access', icon: 'users' },
  { id: 'reports', label: 'Reports', description: 'Review submitted reports', icon: 'flag' },
  // { id: 'settings', label: 'Settings', description: 'Application and admin access', icon: 'sliders' },
  // { id: 'audit', label: 'Audit logs', description: 'Track administrative activity', icon: 'clipboard' },
]

const statusTone = {
  active: 'success',
  enabled: 'success',
  approved: 'success',
  pending: 'warning',
  open: 'warning',
  inactive: 'danger',
  suspended: 'danger',
  disabled: 'danger',
  rejected: 'danger',
  resolved: 'info',
  in_review: 'violet',
  reviewed: 'violet',
}

const iconPaths = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  flag: (
    <>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22v-7" />
    </>
  ),
  sliders: <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />,
  clipboard: (
    <>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 11-3-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </>
  ),
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </>
  ),
}

function Icon({ name, size = 18 }) {
  return (
    <svg
      className="adm-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  )
}

const getCollection = (result) => {
  if (Array.isArray(result)) {
    return result
  }

  if (Array.isArray(result?.items)) {
    return result.items
  }

  throw new Error('The admin API returned an unexpected list response; expected an array or an items array.')
}

const getTotal = (result, items) =>
  Number(result?.total ?? result?.total_count ?? result?.count ?? result?.total_items ?? items.length)

const getValue = (record, keys, fallback = '') => {
  for (const key of keys) {
    if (record?.[key] !== undefined && record[key] !== null) {
      return record[key]
    }
  }

  return fallback
}

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

const formatDate = (value) => {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

const getInitials = (value) => {
  const parts = String(value).trim().split(/[\s@._-]+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

const getRecordStatus = (record) => {
  const status = getValue(record, ['status', 'account_status', 'state'])

  if (status) {
    return String(status)
  }

  const active = getValue(record, ['is_active', 'active'], null)
  if (typeof active === 'boolean') {
    return active ? 'Active' : 'Inactive'
  }

  return 'Unknown'
}

const getDashboardMetrics = (dashboard, userCount) => {
  const metrics = []

  const collect = (value, prefix = '') => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return
    }

    Object.entries(value).forEach(([key, item]) => {
      const label = prefix ? `${prefix} ${formatLabel(key)}` : formatLabel(key)
      if (item === null || ['string', 'number', 'boolean'].includes(typeof item)) {
        metrics.push({ label, value: formatValue(item) })
      } else if (item && typeof item === 'object' && !Array.isArray(item)) {
        collect(item, label)
      }
    })
  }

  collect(dashboard)

  if (
    userCount !== undefined &&
    !metrics.some(({ label }) => /user.*(count|total)|total.*users/i.test(label))
  ) {
    metrics.unshift({ label: 'Total users', value: formatValue(userCount) })
  }

  return metrics.slice(0, 8)
}

function StatusPill({ status }) {
  const tone = statusTone[String(status).toLowerCase()] || 'neutral'
  return (
    <span className={`adm-pill adm-pill--${tone}`}>
      <span className="adm-pill__dot" />
      {formatLabel(status)}
    </span>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="adm-empty">
      <span className="adm-empty__icon"><Icon name="inbox" size={22} /></span>
      <strong>{title}</strong>
      {text ? <span>{text}</span> : null}
    </div>
  )
}

function LoadingSkeleton({ label }) {
  return (
    <div className="adm-card adm-skeleton" role="status" aria-label={`Loading ${label}`}>
      <div className="adm-skeleton__bar adm-skeleton__bar--title" />
      {[0, 1, 2, 3, 4].map((row) => (
        <div className="adm-skeleton__bar" key={row} />
      ))}
    </div>
  )
}

function AdminPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [userPage, setUserPage] = useState(1)
  const [reportPage, setReportPage] = useState(1)
  const [auditPage, setAuditPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [pendingUserId, setPendingUserId] = useState(null)
  const [pendingReportId, setPendingReportId] = useState(null)
  const [destinationRefreshKey, setDestinationRefreshKey] = useState(0)
  const [placeRefreshKey, setPlaceRefreshKey] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true

    const loadPage = async () => {
      setLoading(true)
      setError('')
      setNotice('')

      try {
        let nextData

        if (activeTab === 'dashboard') {
          const [dashboard, userCount] = await Promise.all([
            adminApi.getDashboard(),
            adminApi.getUserCount(),
          ])
          nextData = { dashboard, userCount: userCount?.count }
        } else if (activeTab === 'destinations' || activeTab === 'places') {
          nextData = {}
        } else if (activeTab === 'users') {
          const active = activeFilter === '' ? undefined : activeFilter === 'true'
          const result = await adminApi.listUsers({
            page: userPage,
            page_size: PAGE_SIZE,
            search: userSearch || undefined,
            active,
          })
          const items = getCollection(result)
          nextData = { items, total: getTotal(result, items), result }
        } else if (activeTab === 'reports') {
          const result = await adminApi.listReports({
            page: reportPage,
            page_size: PAGE_SIZE,
          })
          const items = getCollection(result)
          nextData = { items, total: getTotal(result, items), result }
        } else if (activeTab === 'settings') {
          nextData = await adminApi.getSettings()
        } else if (activeTab === 'audit') {
          const result = await adminApi.listAuditLogs({
            page: auditPage,
            page_size: 50,
          })
          const items = getCollection(result)
          nextData = { items, total: getTotal(result, items), result }
        }

        if (isCurrentRequest) {
          setData(nextData)
        }
      } catch (loadError) {
        if (isCurrentRequest) {
          setError(loadError.message || 'Could not load admin data.')
          setData(null)
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false)
        }
      }
    }

    loadPage()

    return () => {
      isCurrentRequest = false
    }
  }, [
    activeFilter,
    activeTab,
    auditPage,
    refreshKey,
    reportPage,
    userPage,
    userSearch,
  ])

  const handleUserStatusChange = async (user, nextStatus) => {
    const userId = getValue(user, ['id', 'user_id'])
    if (userId === '') {
      return
    }

    setPendingUserId(userId)
    setError('')

    try {
      await adminApi.updateUserStatus(userId, nextStatus)
      setNotice(`User status updated to ${formatLabel(nextStatus)}.`)
      setRefreshKey((key) => key + 1)
    } catch (updateError) {
      setError(updateError.message || 'Unable to update this user.')
    } finally {
      setPendingUserId(null)
    }
  }

  const handleReportReview = async (event, reportId) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const status = String(formData.get('status') || '').trim()
    const resolution = String(formData.get('resolution') || '').trim()

    if (!status) {
      setError('Enter a report status before saving your review.')
      return
    }

    setPendingReportId(reportId)
    setError('')

    try {
      await adminApi.reviewReport(reportId, { status, resolution })
      setNotice('Report review saved.')
      setRefreshKey((key) => key + 1)
      form.closest('details')?.removeAttribute('open')
    } catch (reviewError) {
      setError(reviewError.message || 'Unable to save this report review.')
    } finally {
      setPendingReportId(null)
    }
  }

  const handleUserSearch = (event) => {
    event.preventDefault()
    setUserPage(1)
    setUserSearch(searchInput.trim())
  }

  const activePage = sidebarItems.find((item) => item.id === activeTab) || sidebarItems[0]

  const renderDashboard = () => {
    const metrics = getDashboardMetrics(data?.dashboard, data?.userCount)

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
      <section className="adm-stats">
        {metrics.map((metric, index) => (
          <article
            className={`adm-stat adm-stat--${['teal', 'indigo', 'emerald', 'slate'][index % 4]}`}
            key={metric.label}
          >
            <span className="adm-stat__label">{metric.label}</span>
            <strong className="adm-stat__value">{metric.value}</strong>
          </article>
        ))}
      </section>
    )
  }

  const renderUsers = () => {
    const users = data?.items || []
    const totalPages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE))

    return (
      <section className="adm-card">
        <div className="adm-card__header">
          <div>
            <h3>User accounts</h3>
            <p>{data?.total ?? users.length} total users</p>
          </div>
          <form className="adm-filters" onSubmit={handleUserSearch}>
            <label className="adm-search">
              <Icon name="search" size={16} />
              <input
                aria-label="Search users"
                placeholder="Search name or email"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>
            <select
              className="adm-select"
              aria-label="Filter users by active status"
              value={activeFilter}
              onChange={(event) => {
                setActiveFilter(event.target.value)
                setUserPage(1)
              }}
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button type="submit" className="adm-btn adm-btn--primary">Search</button>
          </form>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="adm-th-right">Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const userId = getValue(user, ['id', 'user_id'], `row-${index}`)
                const userName = getValue(user, ['full_name', 'name', 'username'], `User ${userId}`)
                const email = getValue(user, ['email', 'email_address'])
                const status = getRecordStatus(user)
                const isActive = ['active', 'enabled', 'approved'].includes(status.toLowerCase())

                return (
                  <tr key={userId}>
                    <td>
                      <div className="adm-user">
                        <span className="adm-avatar">{getInitials(userName)}</span>
                        <div>
                          <strong>{formatValue(userName)}</strong>
                          {email ? <small>{email}</small> : null}
                        </div>
                      </div>
                    </td>
                    <td>{formatValue(getValue(user, ['role', 'user_role'], '—'))}</td>
                    <td><StatusPill status={status} /></td>
                    <td className="adm-muted">{formatDate(getValue(user, ['created_at', 'joined_at', 'created']))}</td>
                    <td className="adm-td-right">
                      <button
                        type="button"
                        className={`adm-btn adm-btn--small ${isActive ? 'adm-btn--danger' : 'adm-btn--success'}`}
                        disabled={pendingUserId === userId || userId.toString().startsWith('row-')}
                        onClick={() => handleUserStatusChange(user, isActive ? 'suspended' : 'active')}
                      >
                        {pendingUserId === userId ? 'Saving…' : isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <EmptyState title="No users found" text="Try a different search or status filter." />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination page={userPage} totalPages={totalPages} onChange={setUserPage} />
      </section>
    )
  }

  const renderReports = () => {
    const reports = data?.items || []
    const totalPages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE))

    return (
      <section className="adm-card">
        <div className="adm-card__header">
          <div>
            <h3>Submitted reports</h3>
            <p>{data?.total ?? reports.length} total reports</p>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Submitted by</th>
                <th>Date</th>
                <th>Status</th>
                <th className="adm-th-right">Review</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => {
                const reportId = getValue(report, ['id', 'report_id'], `row-${index}`)
                const status = getRecordStatus(report)
                const description = getValue(report, ['reason', 'title', 'description', 'message'], 'No description provided')

                return (
                  <tr key={reportId}>
                    <td>
                      <strong>#{reportId}</strong>
                      <small className="adm-subtext">{formatValue(description)}</small>
                    </td>
                    <td>{formatValue(getValue(report, ['user_email', 'reporter_email', 'email', 'user_id'], '—'))}</td>
                    <td className="adm-muted">{formatDate(getValue(report, ['created_at', 'submitted_at', 'created']))}</td>
                    <td><StatusPill status={status} /></td>
                    <td className="adm-td-right">
                      {String(reportId).startsWith('row-') ? (
                        <span className="adm-muted">Missing report ID</span>
                      ) : (
                        <details className="adm-review">
                          <summary className="adm-btn adm-btn--small adm-btn--ghost">Review</summary>
                          <form className="adm-review__form" onSubmit={(event) => handleReportReview(event, reportId)}>
                            <label>
                              Status
                              <input name="status" defaultValue={status === 'Unknown' ? '' : status} required />
                              <small>Use a status value accepted by the API.</small>
                            </label>
                            <label>
                              Resolution
                              <textarea
                                name="resolution"
                                defaultValue={getValue(report, ['resolution', 'review_notes'])}
                                rows="3"
                              />
                            </label>
                            <button type="submit" className="adm-btn adm-btn--primary adm-btn--small" disabled={pendingReportId === reportId}>
                              {pendingReportId === reportId ? 'Saving…' : 'Save review'}
                            </button>
                          </form>
                        </details>
                      )}
                    </td>
                  </tr>
                )
              })}
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <EmptyState title="No reports yet" text="Reports submitted by users will appear here." />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination page={reportPage} totalPages={totalPages} onChange={setReportPage} />
      </section>
    )
  }

  const renderSettings = () => {
    const adminEmails = Array.isArray(data?.admin_emails) ? data.admin_emails : []

    return (
      <section className="adm-card adm-settings">
        <div className="adm-card__header">
          <div>
            <h3>Application settings</h3>
            <p>Read-only configuration returned by the admin API</p>
          </div>
        </div>

        <dl className="adm-settings__list">
          <div className="adm-settings__row">
            <dt>Application name</dt>
            <dd>{formatValue(data?.app_name)}</dd>
          </div>
          <div className="adm-settings__row">
            <dt>Configured admin accounts</dt>
            <dd>{adminEmails.length}</dd>
          </div>
        </dl>

        <div className="adm-chips">
          {adminEmails.map((email) => (
            <span className="adm-chip" key={email}>
              <span className="adm-avatar adm-avatar--small">{getInitials(email)}</span>
              {email}
            </span>
          ))}
          {adminEmails.length === 0 ? (
            <p className="adm-muted">No admin email addresses were returned.</p>
          ) : null}
        </div>
      </section>
    )
  }

  const renderAuditLogs = () => {
    const logs = data?.items || []
    const totalPages = Math.max(1, Math.ceil((data?.total || 0) / 50))

    return (
      <section className="adm-card">
        <div className="adm-card__header">
          <div>
            <h3>Administrative activity</h3>
            <p>{data?.total ?? logs.length} total log entries</p>
          </div>
        </div>

        <ol className="adm-timeline">
          {logs.map((log, index) => {
            const id = getValue(log, ['id', 'log_id'], index)
            const action = getValue(log, ['action', 'event', 'description', 'activity'], 'Admin activity')
            const actor = getValue(log, ['actor_email', 'admin_email', 'user_email', 'actor', 'user_id'], 'Unknown actor')

            return (
              <li className="adm-timeline__item" key={id}>
                <span className="adm-timeline__dot" aria-hidden="true" />
                <div className="adm-timeline__copy">
                  <strong>{formatValue(action)}</strong>
                  <span>{formatValue(actor)}</span>
                </div>
                <time>{formatDate(getValue(log, ['created_at', 'timestamp', 'occurred_at']))}</time>
              </li>
            )
          })}
        </ol>
        {logs.length === 0 ? (
          <EmptyState title="No audit entries yet" text="Admin actions will be recorded here." />
        ) : null}

        <Pagination page={auditPage} totalPages={totalPages} onChange={setAuditPage} />
      </section>
    )
  }

  const renderPage = () => {
    if (activeTab === 'dashboard') return renderDashboard()
    if (activeTab === 'destinations') {
      return (
        <div className="adm-split">
          <div className="adm-embed">
            <ContentManagementPage
              type="destinations"
              onCreated={() => {
                setNotice('Destination saved successfully.')
                setDestinationRefreshKey((key) => key + 1)
              }}
            />
          </div>
          <div className="adm-embed">
            <DestinationPage refreshKey={destinationRefreshKey} />
          </div>
        </div>
      )
    }
    if (activeTab === 'places') {
      return (
        <div className="adm-split">
          <div className="adm-embed">
            <ContentManagementPage
              type="places"
              onCreated={() => {
                setNotice('Place saved successfully.')
                setPlaceRefreshKey((key) => key + 1)
              }}
            />
          </div>
          <div className="adm-embed">
            <PlacePage refreshKey={placeRefreshKey} />
          </div>
        </div>
      )
    }
    if (activeTab === 'users') return renderUsers()
    if (activeTab === 'reports') return renderReports()
    if (activeTab === 'settings') return renderSettings()
    return renderAuditLogs()
  }

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <div className="adm-brand__mark">T</div>
          <div>
            <strong>TripOS</strong>
            <span>Admin</span>
          </div>
        </div>

        <nav className="adm-nav" aria-label="Admin sections">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`adm-nav__item ${activeTab === item.id ? 'is-active' : ''}`}
              aria-current={activeTab === item.id ? 'page' : undefined}
              title={item.description}
              onClick={() => {
                setActiveTab(item.id)
                setError('')
                setNotice('')
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="adm-sidebar__footer">
          <span className="adm-live" />
          Connected to admin API
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-header">
          <div>
            <h2>{activePage.label}</h2>
            <p>{activePage.description}</p>
          </div>
          <div className="adm-header__actions">
            <button
              type="button"
              className="adm-btn adm-btn--ghost"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={loading}
            >
              <Icon name="refresh" size={16} />
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            <button type="button" className="adm-btn adm-btn--ghost" onClick={onLogout}>
              <Icon name="logout" size={16} />
              Log out
            </button>
          </div>
        </header>

        {error ? (
          <div className="adm-banner adm-banner--error" role="alert">
            <Icon name="alert" size={18} />
            <span>{error}</span>
            <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>Retry</button>
          </div>
        ) : null}
        {notice ? (
          <div className="adm-banner adm-banner--success" role="status">
            <Icon name="check" size={18} />
            <span>{notice}</span>
          </div>
        ) : null}

        {loading ? (
          <LoadingSkeleton label={activePage.label.toLowerCase()} />
        ) : error ? (
          <div className="adm-card">
            <EmptyState
              title="Unable to load this section"
              text="Check the API connection and your admin permissions, then retry."
            />
          </div>
        ) : (
          renderPage()
        )}
      </main>
    </div>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="adm-pagination">
      <span>Page {page} of {totalPages}</span>
      <div>
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--small" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--small" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}

export default AdminPage