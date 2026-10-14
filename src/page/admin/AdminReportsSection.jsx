import { EmptyState, Pagination, StatusPill } from './AdminUi.jsx'
import { formatDate, formatValue, getRecordStatus, getValue, PAGE_SIZE } from './adminUtils.js'

function AdminReportsSection({ data, onPageChange, onReview, page, pendingReportId }) {
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
                        <form className="adm-review__form" onSubmit={(event) => onReview(event, reportId)}>
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
                          <button
                            type="submit"
                            className="adm-btn adm-btn--primary adm-btn--small"
                            disabled={pendingReportId === reportId}
                          >
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

      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </section>
  )
}

export default AdminReportsSection
