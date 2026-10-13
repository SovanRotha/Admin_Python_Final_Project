import { useState } from 'react'

function Login({ onSubmit, onSwitch, loading = false, error = '', notice = '' }) {
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit?.(form)
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">T</div>
          <div>
            <p className="eyebrow">TripOS</p>
            <h1>Admin access</h1>
          </div>
        </div>

        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Sign in to manage users, reports, and platform settings.</p>
        </div>

        {notice ? <p className="auth-success" role="status">{notice}</p> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="admin@tripos.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Need an admin account?</span>
          <button type="button" className="text-button" onClick={onSwitch}>
            Create one
          </button>
        </div>
      </div>
    </section>
  )
}

export default Login
