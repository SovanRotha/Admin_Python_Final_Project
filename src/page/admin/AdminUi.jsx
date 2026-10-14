import { formatLabel } from './adminUtils.js'

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

export function Icon({ name, size = 18 }) {
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

export function StatusPill({ status }) {
  const tone = statusTone[String(status).toLowerCase()] || 'neutral'
  return (
    <span className={`adm-pill adm-pill--${tone}`}>
      <span className="adm-pill__dot" />
      {formatLabel(status)}
    </span>
  )
}

export function EmptyState({ title, text }) {
  return (
    <div className="adm-empty">
      <span className="adm-empty__icon"><Icon name="inbox" size={22} /></span>
      <strong>{title}</strong>
      {text ? <span>{text}</span> : null}
    </div>
  )
}

export function LoadingSkeleton({ label }) {
  return (
    <div className="adm-card adm-skeleton" role="status" aria-label={`Loading ${label}`}>
      <div className="adm-skeleton__bar adm-skeleton__bar--title" />
      {[0, 1, 2, 3, 4].map((row) => (
        <div className="adm-skeleton__bar" key={row} />
      ))}
    </div>
  )
}

export function Pagination({ page, totalPages, onChange }) {
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
