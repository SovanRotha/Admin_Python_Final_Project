import { useEffect, useState } from 'react'
import AdminPage from './page/AdminPage.jsx'
import AuthPage from './page/auth/AuthPage.jsx'

const UNAUTHORIZED_EVENT = 'admin:unauthorized'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return Boolean(localStorage.getItem('admin_token'))
    } catch {
      return false
    }
  })

  useEffect(() => {
    const handleUnauthorized = () => setIsAuthenticated(false)
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('admin_user')
    setIsAuthenticated(false)
  }

  return isAuthenticated ? (
    <AdminPage onLogout={handleLogout} />
  ) : (
    <AuthPage onAuthenticated={() => setIsAuthenticated(true)} />
  )
}

export default App
