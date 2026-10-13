import { useState } from 'react'

function Register({ onSubmit, onSwitch, loading = false, error = '' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

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
            <h1>Admin setup</h1>
          </div>
        </div>

        <div className="auth-header">
          <h2>Create account</h2>
          <p>Register a new administrator to access the control panel.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Full name</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Jane Admin"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

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
              autoComplete="new-password"
              placeholder="Create a secure password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button type="button" className="text-button" onClick={onSwitch}>
            Sign in
          </button>
        </div>
      </div>
    </section>
  )
}

export default Register
