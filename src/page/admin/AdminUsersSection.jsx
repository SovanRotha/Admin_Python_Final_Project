import { EmptyState, Icon, Pagination, StatusPill } from './AdminUi.jsx'
import {
  formatDate,
  formatValue,
  getInitials,
  getRecordStatus,
  getValue,
  PAGE_SIZE,
} from './adminUtils.js'

function AdminUsersSection({
  activeFilter,
  data,
  onFilterChange,
  onPageChange,
  onSearch,
  onDelete,
  onStatusChange,
  page,
  pendingDeleteUserId,
  pendingUserId,
  searchInput,
  setSearchInput,
}) {
  const users = data?.items || []
  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE))

  return (
    <section className="adm-card">
      <div className="adm-card__header">
        <div>
          <h3>User accounts</h3>
          <p>{data?.total ?? users.length} total users</p>
        </div>
        <form className="adm-filters" onSubmit={onSearch}>
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
            onChange={(event) => onFilterChange(event.target.value)}
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
                      disabled={pendingUserId === userId || pendingDeleteUserId === userId || userId.toString().startsWith('row-')}
                      onClick={() => onStatusChange(user, isActive ? 'suspended' : 'active')}
                    >
                      {pendingUserId === userId ? 'Saving…' : isActive ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn--small adm-btn--danger"
                      disabled={pendingUserId === userId || pendingDeleteUserId === userId || userId.toString().startsWith('row-')}
                      onClick={() => onDelete(user)}
                    >
                      {pendingDeleteUserId === userId ? 'Deleting…' : 'Delete'}
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

      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </section>
  )
}

export default AdminUsersSection
