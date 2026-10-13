import { useEffect, useState } from 'react'
import adminApi from '../services/adminApi.js'
import ContentManagementPage from './ContentManagementPage.jsx'
import '../App.css'

const PAGE_SIZE = 10

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', description: 'Platform overview' },
  { id: 'destinations', label: 'Destinations', description: 'Publish destinations' },
  { id: 'places', label: 'Places', description: 'Publish places in destinations' },
  { id: 'users', label: 'User management', description: 'Search and update user access' },
  { id: 'reports', label: 'Reports', description: 'Review submitted reports' },
  { id: 'settings', label: 'Settings', description: 'Application and admin access' },
  { id: 'audit', label: 'Audit logs', description: 'Track administrative activity' },
]

const statusClassName = {
  active: 'status-pill status-active',
  enabled: 'status-pill status-active',
  approved: 'status-pill status-active',
  pending: 'status-pill status-pending',
  inactive: 'status-pill status-suspended',
  suspended: 'status-pill status-suspended',
  disabled: 'status-pill status-suspended',
  resolved: 'status-pill status-resolved',
  rejected: 'status-pill status-suspended',
  open: 'status-pill status-pending',
  in_review: 'status-pill status-review',
  reviewed: 'status-pill status-review',
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

const getStatusClass = (status) =>
  statusClassName[String(status).toLowerCase()] || 'status-pill'

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
        <div className="content-card">
          <div className="empty-state">
            <strong>No dashboard metrics were returned.</strong>
            <span>The dashboard endpoint returned no scalar summary fields.</span>
          </div>
        </div>
      )
    }

    return (
      <section className="stats-grid">
        {metrics.map((metric, index) => (
          <article className={`stat-card tone-${['blue', 'green', 'amber', 'purple'][index % 4]}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>
    )
  }

  const renderUsers = () => {
    const users = data?.items || []
    const totalPages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE))

    return (
      <section className="content-card">
        <div className="card-header">
          <div>
            <h3>User accounts</h3>
            <span>{data?.total ?? users.length} total users</span>
          </div>
          <form className="filter-form" onSubmit={handleUserSearch}>
            <input
              aria-label="Search users"
              placeholder="Search name or email"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <select
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
            <button type="submit" className="secondary-button">Search</button>
          </form>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Manage access</th>
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
                      <strong>{formatValue(userName)}</strong>
                      {email ? <small className="table-subtext">{email}</small> : null}
                    </td>
                    <td>{formatValue(getValue(user, ['role', 'user_role'], '—'))}</td>
                    <td><span className={getStatusClass(status)}>{formatLabel(status)}</span></td>
                    <td>{formatDate(getValue(user, ['created_at', 'joined_at', 'created']))}</td>
                    <td>
                      <div className="action-stack">
                        <button
                          type="button"
                          className={`mini-button ${isActive ? 'danger' : ''}`}
                          disabled={pendingUserId === userId || userId.toString().startsWith('row-')}
                          onClick={() => handleUserStatusChange(user, isActive ? 'suspended' : 'active')}
                        >
                          {pendingUserId === userId ? 'Saving…' : isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 ? (
                <tr><td colSpan="5" className="empty-cell">No users match these filters.</td></tr>
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
      <section className="content-card">
        <div className="card-header">
          <div>
            <h3>Submitted reports</h3>
            <span>{data?.total ?? reports.length} total reports</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Report</th>
                <th>Submitted by</th>
                <th>Date</th>
                <th>Status</th>
                <th>Review</th>
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
                      <small className="table-subtext">{formatValue(description)}</small>
                    </td>
                    <td>{formatValue(getValue(report, ['user_email', 'reporter_email', 'email', 'user_id'], '—'))}</td>
                    <td>{formatDate(getValue(report, ['created_at', 'submitted_at', 'created']))}</td>
                    <td><span className={getStatusClass(status)}>{formatLabel(status)}</span></td>
                    <td>
                      {String(reportId).startsWith('row-') ? (
                        <span className="muted-text">Missing report ID</span>
                      ) : (
                        <details className="review-details">
                          <summary>Review report</summary>
                          <form className="review-form" onSubmit={(event) => handleReportReview(event, reportId)}>
                            <label>
                              Status
                              <input name="status" defaultValue={status === 'Unknown' ? '' : status} required />
                              <small>Enter a status value accepted by the API.</small>
                            </label>
                            <label>
                              Resolution
                              <textarea
                                name="resolution"
                                defaultValue={getValue(report, ['resolution', 'review_notes'])}
                                rows="2"
                              />
                            </label>
                            <button type="submit" className="mini-button" disabled={pendingReportId === reportId}>
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
                <tr><td colSpan="5" className="empty-cell">No reports found.</td></tr>
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
      <section className="content-card settings-card">
        <div className="card-header">
          <div>
            <h3>Application settings</h3>
            <span>Read-only configuration returned by the admin API</span>
          </div>
        </div>

        <div className="setting-row">
          <span>Application name</span>
          <strong>{formatValue(data?.app_name)}</strong>
        </div>
        <div className="setting-row">
          <span>Configured admin accounts</span>
          <strong>{adminEmails.length}</strong>
        </div>
        <div className="admin-email-list">
          {adminEmails.map((email) => (
            <div className="admin-email" key={email}>{email}</div>
          ))}
          {adminEmails.length === 0 ? (
            <p className="muted-text">No admin email addresses were returned.</p>
          ) : null}
        </div>
      </section>
    )
  }

  const renderAuditLogs = () => {
    const logs = data?.items || []
    const totalPages = Math.max(1, Math.ceil((data?.total || 0) / 50))

    return (
      <section className="content-card">
        <div className="card-header">
          <div>
            <h3>Administrative activity</h3>
            <span>{data?.total ?? logs.length} total log entries</span>
          </div>
        </div>

        <div className="audit-table-wrap">
          {logs.map((log, index) => {
            const id = getValue(log, ['id', 'log_id'], index)
            const action = getValue(log, ['action', 'event', 'description', 'activity'], 'Admin activity')
            const actor = getValue(log, ['actor_email', 'admin_email', 'user_email', 'actor', 'user_id'], 'Unknown actor')

            return (
              <article className="audit-entry" key={id}>
                <div className="audit-marker" aria-hidden="true" />
                <div className="audit-copy">
                  <strong>{formatValue(action)}</strong>
                  <span>{formatValue(actor)}</span>
                </div>
                <time>{formatDate(getValue(log, ['created_at', 'timestamp', 'occurred_at']))}</time>
              </article>
            )
          })}
          {logs.length === 0 ? <p className="empty-cell">No audit log entries found.</p> : null}
        </div>

        <Pagination page={auditPage} totalPages={totalPages} onChange={setAuditPage} />
      </section>
    )
  }

  const renderPage = () => {
    if (activeTab === 'dashboard') return renderDashboard()
    if (activeTab === 'destinations' || activeTab === 'places') {
      return (
        <ContentManagementPage
          type={activeTab}
          onCreated={() => setNotice('Content published successfully.')}
        />
      )
    }
    if (activeTab === 'users') return renderUsers()
    if (activeTab === 'reports') return renderReports()
    if (activeTab === 'settings') return renderSettings()
    return renderAuditLogs()
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">T</div>
          <div>
            <p className="eyebrow">TripOS</p>
            <h1>Admin</h1>
          </div>
        </div>

        <nav className="main-nav" aria-label="Admin sections">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
              aria-current={activeTab === item.id ? 'page' : undefined}
              onClick={() => {
                setActiveTab(item.id)
                setError('')
                setNotice('')
              }}
            >
              <span>{item.label}</span>
              <small>{item.description}</small>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="connection-indicator" />
          Connected to admin API
        </div>
      </aside>

      <main className="main-panel">
        <header className="page-header">
          <div>
            <p className="eyebrow">Admin workspace</p>
            <h2>{activePage.label}</h2>
            <p className="page-description">{activePage.description}</p>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="secondary-button refresh-button"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {error ? (
          <div className="message-banner error-message" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>Retry</button>
          </div>
        ) : null}
        {notice ? <div className="message-banner success-message" role="status">{notice}</div> : null}

        {loading ? (
          <div className="state-card loading-state">Loading {activePage.label.toLowerCase()}…</div>
        ) : error ? (
          <div className="state-card error">
            <strong>Unable to load this section.</strong>
            <span>Check the API connection and your admin permissions, then retry.</span>
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
    <div className="pagination">
      <span>Page {page} of {totalPages}</span>
      <div>
        <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}

export default AdminPage
