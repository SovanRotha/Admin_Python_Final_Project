import { formatValue, getInitials } from './adminUtils.js'

function AdminSettingsSection({ data }) {
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

export default AdminSettingsSection
