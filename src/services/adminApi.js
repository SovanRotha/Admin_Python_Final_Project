import { request } from './httpClient.js'

const ADMIN_ENDPOINT = '/api/v1/admin'
const REPORTS_ENDPOINT = '/api/v1/reports'
const DESTINATIONS_ENDPOINT = '/api/v1/destinations'
const PLACES_ENDPOINT = '/api/v1/places'

export const authLogin = (payload) =>
  request('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  })

export const authRegister = (payload) =>
  request('/api/v1/auth/register', {
    method: 'POST',
    body: payload,
  })

export const fetchAdminDashboard = () => request(`${ADMIN_ENDPOINT}/dashboard`)

export const fetchAdminUserCount = () => request(`${ADMIN_ENDPOINT}/users/count`)

export const fetchAdminUsers = (params = {}) =>
  request(`${ADMIN_ENDPOINT}/users`, { query: params })

export const fetchAdminUserById = (userId) =>
  request(`${ADMIN_ENDPOINT}/users/${encodeURIComponent(userId)}`)

export const updateAdminUserStatus = (userId, status) =>
  request(`${ADMIN_ENDPOINT}/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: { status },
  })

export const fetchAdminReports = (params = {}) =>
  request(`${ADMIN_ENDPOINT}/reports`, { query: params })

export const reviewAdminReport = (reportId, reviewData) =>
  request(`${ADMIN_ENDPOINT}/reports/${encodeURIComponent(reportId)}`, {
    method: 'PATCH',
    body: reviewData,
  })

export const fetchAdminSettings = () => request(`${ADMIN_ENDPOINT}/settings`)

export const fetchAdminAuditLogs = (params = {}) =>
  request(`${ADMIN_ENDPOINT}/audit-logs`, { query: params })

export const createDestination = (payload) =>
  request(DESTINATIONS_ENDPOINT, {
    method: 'POST',
    body: payload,
  })

export const createPlace = (payload) =>
  request(PLACES_ENDPOINT, {
    method: 'POST',
    body: payload,
  })

export const submitReport = (reportData) =>
  request(REPORTS_ENDPOINT, {
    method: 'POST',
    body: reportData,
  })

const adminApi = {
  login: authLogin,
  register: authRegister,
  getDashboard: fetchAdminDashboard,
  getUserCount: fetchAdminUserCount,
  listUsers: fetchAdminUsers,
  getUserById: fetchAdminUserById,
  updateUserStatus: updateAdminUserStatus,
  listReports: fetchAdminReports,
  reviewReport: reviewAdminReport,
  getSettings: fetchAdminSettings,
  listAuditLogs: fetchAdminAuditLogs,
  createDestination,
  createPlace,
  submitReport,
}

export default adminApi
