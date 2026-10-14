import { useEffect, useState } from 'react'
import adminApi from '../../services/adminApi.js'
import { formatLabel, getCollection, getTotal, getValue, PAGE_SIZE } from './adminUtils.js'

function useAdminPage() {
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
  }, [activeFilter, activeTab, auditPage, refreshKey, reportPage, userPage, userSearch])

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

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setError('')
    setNotice('')
  }

  const refresh = () => setRefreshKey((key) => key + 1)

  const handleDestinationCreated = () => {
    setNotice('Destination saved successfully.')
    setDestinationRefreshKey((key) => key + 1)
  }

  const handlePlaceCreated = () => {
    setNotice('Place saved successfully.')
    setPlaceRefreshKey((key) => key + 1)
  }

  return {
    activeFilter,
    activeTab,
    auditPage,
    data,
    destinationRefreshKey,
    error,
    handleDestinationCreated,
    handlePlaceCreated,
    handleReportReview,
    handleTabChange,
    handleUserSearch,
    handleUserStatusChange,
    loading,
    notice,
    pendingReportId,
    pendingUserId,
    placeRefreshKey,
    refresh,
    reportPage,
    searchInput,
    setActiveFilter,
    setAuditPage,
    setError,
    setPlaceRefreshKey,
    setReportPage,
    setSearchInput,
    setUserPage,
    setNotice,
    userPage,
  }
}

export default useAdminPage
