export const PAGE_SIZE = 10

export const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', description: 'Platform overview', icon: 'dashboard' },
  { id: 'destinations', label: 'Destinations', description: 'Publish destinations', icon: 'pin' },
  { id: 'places', label: 'Places', description: 'Publish places in destinations', icon: 'compass' },
  { id: 'users', label: 'Users', description: 'Search and update user access', icon: 'users' },
  { id: 'reports', label: 'Reports', description: 'Review submitted reports', icon: 'flag' },
]

export const getCollection = (result) => {
  if (Array.isArray(result)) {
    return result
  }

  if (Array.isArray(result?.items)) {
    return result.items
  }

  throw new Error('The admin API returned an unexpected list response; expected an array or an items array.')
}

export const getTotal = (result, items) =>
  Number(result?.total ?? result?.total_count ?? result?.count ?? result?.total_items ?? items.length)

export const getValue = (record, keys, fallback = '') => {
  for (const key of keys) {
    if (record?.[key] !== undefined && record[key] !== null) {
      return record[key]
    }
  }

  return fallback
}

export const formatLabel = (value) =>
  String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

export const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

export const formatDate = (value) => {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export const getInitials = (value) => {
  const parts = String(value).trim().split(/[\s@._-]+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

export const getRecordStatus = (record) => {
  const status = getValue(record, ['status', 'account_status', 'state'])

  if (status) {
    return String(status)
  }

  const active = getValue(record, ['is_active', 'active'], null)
  if (typeof active === 'boolean') {
    return active ? 'Active' : 'Inactive'
  }

  return 'Unknown'
}
