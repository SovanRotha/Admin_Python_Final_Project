const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

const getStoredToken = () => {
  try {
    const rawToken = localStorage.getItem('admin_token') || localStorage.getItem('access_token')
    return rawToken || ''
  } catch {
    return ''
  }
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
    const message = typeof payload === 'string'
      ? payload
      : payload?.detail ?? payload?.message

    throw new Error(message || `Request failed (${response.status} ${response.statusText})`)
  }

  return payload
}
