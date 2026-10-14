import { Icon } from './AdminUi.jsx'
import { sidebarItems } from './adminUtils.js'

function AdminLayout({
  activePage,
  activeTab,
  children,
  loading,
  notice,
  onLogout,
  onRefresh,
  onSelectTab,
  error,
}) {
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
              onClick={() => onSelectTab(item.id)}
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
              onClick={onRefresh}
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
            <button type="button" onClick={onRefresh}>Retry</button>
          </div>
        ) : null}
        {notice ? (
          <div className="adm-banner adm-banner--success" role="status">
            <Icon name="check" size={18} />
            <span>{notice}</span>
          </div>
        ) : null}

        {children}
      </main>
    </div>
  )
}

export default AdminLayout
