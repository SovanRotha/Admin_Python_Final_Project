import { EmptyState, Pagination } from './AdminUi.jsx'
import { formatDate, formatValue, getValue } from './adminUtils.js'

function AdminAuditSection({ data, onPageChange, page }) {
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

      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </section>
  )
}

export default AdminAuditSection
