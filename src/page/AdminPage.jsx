import { sidebarItems } from './admin/adminUtils.js'
import useAdminPage from './admin/useAdminPage.js'
import AdminContent from './admin/AdminContent.jsx'
import { EmptyState, LoadingSkeleton } from './admin/AdminUi.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminTheme from './admin/AdminTheme.jsx'
import './admin/admin.css'

function AdminPage({ onLogout }) {
  const admin = useAdminPage()
  const activePage = sidebarItems.find((item) => item.id === admin.activeTab) || sidebarItems[0]

  return (
    <>
      <AdminTheme />
      <AdminLayout
        activePage={activePage}
        activeTab={admin.activeTab}
        loading={admin.loading}
        notice={admin.notice}
        onLogout={onLogout}
        onRefresh={admin.refresh}
        onSelectTab={admin.handleTabChange}
        error={admin.error}
      >
        {admin.loading ? (
          <LoadingSkeleton label={activePage.label.toLowerCase()} />
        ) : admin.error && admin.activeTab !== 'dashboard' ? (
          <div className="adm-card">
            <EmptyState
              title="Unable to load this section"
              text="Check the API connection and your admin permissions, then retry."
            />
          </div>
        ) : (
          <AdminContent
            activeFilter={admin.activeFilter}
            activeTab={admin.activeTab}
            auditPage={admin.auditPage}
            data={admin.data}
            destinationRefreshKey={admin.destinationRefreshKey}
            onAuditPageChange={admin.setAuditPage}
            onDestinationCreated={admin.handleDestinationCreated}
            onFilterChange={(value) => {
              admin.setActiveFilter(value)
              admin.setUserPage(1)
            }}
            onPlaceCreated={admin.handlePlaceCreated}
            onReportPageChange={admin.setReportPage}
            onReportReview={admin.handleReportReview}
            onRefresh={admin.refresh}
            onSearch={admin.handleUserSearch}
            onUserPageChange={admin.setUserPage}
            onUserStatusChange={admin.handleUserStatusChange}
            pendingReportId={admin.pendingReportId}
            pendingUserId={admin.pendingUserId}
            placeRefreshKey={admin.placeRefreshKey}
            reportPage={admin.reportPage}
            searchInput={admin.searchInput}
            setSearchInput={admin.setSearchInput}
            userPage={admin.userPage}
          />
        )}
      </AdminLayout>
    </>
  )
}

export default AdminPage