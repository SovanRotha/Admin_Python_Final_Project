import { useState } from 'react'
import AdminPage from './page/AdminPage.jsx'
import AuthPage from './page/auth/AuthPage.jsx'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return Boolean(localStorage.getItem('admin_token'))
    } catch {
      return false
    }
  })

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
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
