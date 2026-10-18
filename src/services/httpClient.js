const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
const UNAUTHORIZED_EVENT = 'admin:unauthorized'

const getStoredToken = () => {
  try {
    const rawToken = localStorage.getItem('admin_token') || localStorage.getItem('access_token')
    return rawToken || ''
  } catch {
    return ''
  }
}

const formatApiError = (payload) => {
  const detail = typeof payload === 'object' && payload !== null
    ? payload.detail ?? payload.message
    : payload

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') {
          return item
        }

        if (!item || typeof item !== 'object') {
          return ''
        }

        const location = Array.isArray(item.loc)
          ? item.loc.filter((part) => part !== 'body').join('.')
          : ''
        const message = typeof item.msg === 'string' ? item.msg : ''
        return location && message ? `${location}: ${message}` : message || location
      })
      .filter(Boolean)
      .join('; ')
  }

  if (typeof detail === 'string') {
    return detail
  }

  if (detail && typeof detail === 'object') {
    return JSON.stringify(detail)
  }

  return ''
}

export async function request(path, { query, body, ...options } = {}) {
  if (!API_BASE_URL) {
    throw new Error('API is not configured. Set VITE_API_BASE_URL to your FastAPI base URL, for example http://localhost:8000.')
  }

  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  }

  const queryString = searchParams.toString()
  const url = `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  const token = getStoredToken()
  if (token) {
    headers.set('Authorization', 'Bearer ' + token)
  }

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = formatApiError(payload)

    if (response.status === 401 && !path.startsWith('/api/v1/auth/')) {
      try {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('access_token')
      } catch (storageError) {
        console.error('Could not clear invalid admin credentials:', storageError)
      }
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }

    throw new Error(message || `Request failed (${response.status} ${response.statusText})`)
  }

  return payload
}
