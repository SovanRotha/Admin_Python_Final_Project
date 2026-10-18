import DashboardAnalytics from '../DashboardAnalytics.jsx'
import ContentManagementPage from '../ContentManagementPage.jsx'
import DestinationPage from '../DestinationPage.jsx'
import PlacePage from '../PlacePage.jsx'
import AdminAuditSection from './AdminAuditSection.jsx'
import AdminReportsSection from './AdminReportsSection.jsx'
import AdminSettingsSection from './AdminSettingsSection.jsx'
import AdminUsersSection from './AdminUsersSection.jsx'

function AdminContent({
  activeFilter,
  activeTab,
  auditPage,
  data,
  destinationRefreshKey,
  onDestinationCreated,
  onAuditPageChange,
  onFilterChange,
  onPlaceCreated,
  onReportPageChange,
  onReportReview,
  onRefresh,
  onSearch,
  onUserPageChange,
  onUserDelete,
  onUserStatusChange,
  pendingDeleteUserId,
  pendingReportId,
  pendingUserId,
  placeRefreshKey,
  reportPage,
  searchInput,
  setSearchInput,
  userPage,
}) {
  if (activeTab === 'dashboard') {
    return (
      <DashboardAnalytics
        dashboard={data?.dashboard}
        analytics={data?.analytics}
        destinationItems={data?.destinationItems}
        destinationTotal={data?.destinationTotal}
        destinationError={data?.destinationError}
        placeItems={data?.placeItems}
        placeTotal={data?.placeTotal}
        placeError={data?.placeError}
        onRefresh={onRefresh}
        onReportPageChange={onReportPageChange}
        onReportReview={onReportReview}
        pendingReportId={pendingReportId}
        reportError={data?.reportError}
        reportItems={data?.reportItems}
        reportPage={reportPage}
        reportTotal={data?.reportTotal}
        userCount={data?.userCount}
      />
    )
  }

  if (activeTab === 'destinations') {
    return (
      <div className="adm-split">
        <div className="adm-embed">
          <ContentManagementPage type="destinations" onCreated={onDestinationCreated} />
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
          <ContentManagementPage type="places" onCreated={onPlaceCreated} />
        </div>
        <div className="adm-embed">
          <PlacePage refreshKey={placeRefreshKey} />
        </div>
      </div>
    )
  }

  if (activeTab === 'users') {
    return (
      <AdminUsersSection
        activeFilter={activeFilter}
        data={data}
        onFilterChange={onFilterChange}
        onPageChange={onUserPageChange}
        onSearch={onSearch}
        onDelete={onUserDelete}
        onStatusChange={onUserStatusChange}
        page={userPage}
        pendingDeleteUserId={pendingDeleteUserId}
        pendingUserId={pendingUserId}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
    )
  }

  if (activeTab === 'reports') {
    return (
      <AdminReportsSection
        data={data}
        onPageChange={onReportPageChange}
        onReview={onReportReview}
        page={reportPage}
        pendingReportId={pendingReportId}
      />
    )
  }

  if (activeTab === 'settings') {
    return <AdminSettingsSection data={data} />
  }

  return <AdminAuditSection data={data} onPageChange={onAuditPageChange} page={auditPage} />
}

export default AdminContent
