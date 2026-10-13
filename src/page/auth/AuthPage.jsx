import { useState } from 'react'
import adminApi from '../../services/adminApi.js'
import Login from './Login.jsx'
import Register from './Register.jsx'

function AuthPage({ onAuthenticated }) {
  const [authView, setAuthView] = useState('login')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')

  const handleLogin = async ({ email, password }) => {
    if (!email || !password) {
      setAuthError('Please enter an email and password.')
      return
    }

    setAuthLoading(true)
    setAuthError('')
    setAuthNotice('')

    try {
      const result = await adminApi.login({
        email: email.trim(),
        password,
      })
      const token = result.access_token
        ?? result.token
        ?? result.data?.access_token
        ?? result.data?.token

      if (!token) {
        throw new Error('The login API response did not include an access token.')
      }

      const userData = result.user || result.data || {}
      const user = {
        ...userData,
        email: userData.email || email.trim(),
        name: userData.name || userData.full_name || 'Admin User',
      }

      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(user))
      onAuthenticated()
    } catch (loginError) {
      setAuthError(loginError.message || 'Unable to sign in.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async ({ name, email, password, confirmPassword }) => {
    if (!name || !email || !password || !confirmPassword) {
      setAuthError('Please complete every field before registering.')
      return
    }

    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.')
      return
    }

    setAuthLoading(true)
    setAuthError('')
    setAuthNotice('')

    try {
      await adminApi.register({
        name: name.trim(),
        email: email.trim(),
        password,
      })
      setAuthView('login')
      setAuthNotice('Account registered. Sign in with your new credentials. Admin access is granted only to active, allowlisted accounts.')
    } catch (registerError) {
      setAuthError(registerError.message || 'Unable to create the account.')
    } finally {
      setAuthLoading(false)
    }
  }

  const switchAuthView = (view) => {
    setAuthError('')
    setAuthNotice('')
    setAuthView(view)
  }

  if (authView === 'login') {
    return (
      <Login
        onSubmit={handleLogin}
        onSwitch={() => switchAuthView('register')}
        loading={authLoading}
        error={authError}
        notice={authNotice}
      />
    )
  }

  return (
    <Register
      onSubmit={handleRegister}
      onSwitch={() => switchAuthView('login')}
      loading={authLoading}
      error={authError}
    />
  )
}

export default AuthPage
