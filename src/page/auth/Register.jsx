import { useState } from 'react'

const registerTheme = `
.lg-shell {
  --forest-900: #0d2f24;
  --forest-800: #14442f;
  --stone-50: #f7f8f3;
  --stone-100: #eef0e6;
  --stone-200: #dde1d0;
  --ink-900: #1b2a24;
  --ink-600: #566860;
  --ink-400: #8a998f;
  --accent: #d4912a;
  --accent-dark: #b87a1d;
  --accent-soft: #fbefd6;
  --green-soft: #def3e8;
  --red-soft: #fbe5e5;

  display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  min-height: 100vh; background: var(--stone-50); color: var(--ink-900);
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 14px; line-height: 1.5;
}
.lg-shell *, .lg-shell *::before, .lg-shell *::after { box-sizing: border-box; }

/* Visual panel */
.lg-visual {
  position: relative; display: flex; flex-direction: column;
  justify-content: space-between; gap: 32px; padding: 40px 48px; overflow: hidden;
  color: #fff;
  background: linear-gradient(160deg, var(--forest-900) 0%, var(--forest-800) 100%);
}
.lg-visual::before, .lg-visual::after {
  content: ''; position: absolute; border-radius: 50%; pointer-events: none;
}
.lg-visual::before {
  width: 420px; height: 420px; right: -140px; top: -120px;
  background: radial-gradient(circle, rgba(212, 145, 42, 0.28), transparent 70%);
}
.lg-visual::after {
  width: 380px; height: 380px; left: -120px; bottom: -140px;
  background: radial-gradient(circle, rgba(47, 158, 110, 0.25), transparent 70%);
}
.lg-visual > * { position: relative; z-index: 1; }

.lg-visual__top { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 16px; }
.lg-visual__top small {
  display: block; font-size: 10px; font-weight: 500; letter-spacing: 1.6px;
  color: rgba(255, 255, 255, 0.55);
}
.lg-logo {
  display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), #f0c15a);
  color: var(--forest-900); font-size: 18px; font-weight: 800;
  box-shadow: 0 6px 16px rgba(212, 145, 42, 0.35);
}

.lg-visual__copy { display: flex; flex-direction: column; gap: 16px; max-width: 460px; }
.lg-kicker {
  display: inline-flex; align-items: center; gap: 10px; align-self: flex-start;
  padding: 6px 12px; border-radius: 999px; background: rgba(255, 255, 255, 0.1);
  color: #f0c15a; font-size: 11px; font-weight: 600; letter-spacing: 1.2px;
}
.lg-kicker i { width: 6px; height: 6px; border-radius: 50%; background: #f0c15a; }
.lg-visual__copy h2 {
  margin: 0; font-size: 40px; font-weight: 700; line-height: 1.15; letter-spacing: -0.8px;
}
.lg-visual__copy h2 em { font-style: normal; color: #f0c15a; }
.lg-visual__copy p { margin: 0; color: rgba(255, 255, 255, 0.7); font-size: 15px; }

.lg-visual__bottom { display: flex; align-items: center; gap: 14px; color: rgba(255, 255, 255, 0.7); font-size: 13px; }
.lg-avatars { display: flex; }
.lg-avatars b {
  display: grid; place-items: center; width: 34px; height: 34px; margin-left: -8px;
  border: 2px solid var(--forest-800); border-radius: 50%;
  background: rgba(255, 255, 255, 0.14); color: #f0c15a; font-size: 13px;
}
.lg-avatars b:first-child { margin-left: 0; }
.lg-visual__caption {
  color: rgba(255, 255, 255, 0.4); font-size: 10.5px; letter-spacing: 1.8px;
}

/* Form side */
.lg-content { display: grid; place-items: center; padding: 32px 24px; }
.lg-card {
  display: flex; flex-direction: column; gap: 22px; width: 100%; max-width: 420px;
  padding: 36px; background: #fff; border: 1px solid var(--stone-200);
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(13, 47, 36, 0.05), 0 18px 48px rgba(13, 47, 36, 0.08);
}
.lg-brand { display: flex; align-items: center; gap: 12px; }
.lg-brand__mark {
  display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px;
  background: linear-gradient(135deg, var(--forest-900), var(--forest-800));
  color: #f0c15a; font-size: 18px; font-weight: 800;
}
.lg-eyebrow { margin: 0; color: var(--accent-dark); font-size: 11px; font-weight: 700; letter-spacing: 1.4px; }
.lg-brand h1 { margin: 0; font-size: 18px; font-weight: 700; }

.lg-header h2 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
.lg-header p { margin: 4px 0 0; color: var(--ink-600); }

.lg-form { display: flex; flex-direction: column; gap: 16px; }
.lg-field { display: flex; flex-direction: column; gap: 6px; }
.lg-field > span { font-size: 12.5px; font-weight: 600; }
.lg-field input {
  width: 100%; height: 44px; padding: 0 14px; font: inherit; font-size: 14px;
  color: var(--ink-900); background: var(--stone-50);
  border: 1px solid var(--stone-200); border-radius: 10px;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.lg-field input::placeholder { color: var(--ink-400); }
.lg-field input:focus {
  outline: 0; background: #fff; border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.lg-hint { color: var(--ink-400); font-size: 11.5px; }

.lg-alert { margin: 0; padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; }
.lg-alert--error { background: var(--red-soft); color: #a33030; }
.lg-alert--success { background: var(--green-soft); color: #1f7a52; }

.lg-submit {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 46px; border: 0; border-radius: 10px; background: var(--accent); color: #fff;
  font: inherit; font-weight: 600; cursor: pointer;
  box-shadow: 0 6px 16px rgba(212, 145, 42, 0.32);
  transition: background 0.15s, transform 0.1s;
}
.lg-submit:hover:not(:disabled) { background: var(--accent-dark); }
.lg-submit:active:not(:disabled) { transform: translateY(1px); }
.lg-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.lg-footer {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  color: var(--ink-600); font-size: 13px;
}
.lg-link {
  padding: 0; border: 0; background: none; color: var(--forest-800);
  font: inherit; font-weight: 600; cursor: pointer;
}
.lg-link:hover { color: var(--accent-dark); text-decoration: underline; }

.lg-privacy {
  display: flex; align-items: center; justify-content: center; gap: 8px; margin: 0;
  padding-top: 18px; border-top: 1px solid var(--stone-100);
  color: var(--ink-400); font-size: 12px;
}

@media (max-width: 900px) {
  .lg-shell { grid-template-columns: 1fr; }
  .lg-visual { display: none; }
  .lg-content { padding: 24px 16px; }
  .lg-card { padding: 28px 22px; }
}
`

function Register({ onSubmit, onSwitch, loading = false, error = '' }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit?.(form)
  }

  return (
    <section className="lg-shell">
      <style>{registerTheme}</style>

      <aside className="lg-visual" aria-label="TripOS administration">
        <div className="lg-visual__top">
          <div className="lg-logo">T</div>
          <span>TripOS <small>CONTROL CENTER</small></span>
        </div>
        <div className="lg-visual__copy">
          <span className="lg-kicker"><i /> YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>Make room for<br /><em>great journeys.</em></h2>
          <p>Create your account and bring your travel operations together in one place.</p>
        </div>
        <div className="lg-visual__bottom">
          <div className="lg-avatars"><b>✦</b><b>↗</b><b>◎</b></div>
          <span>Thoughtful tools for<br />the people behind travel</span>
        </div>
        <span className="lg-visual__caption">EXPLORE MORE. MANAGE WITH EASE.</span>
      </aside>

      <div className="lg-content">
        <div className="lg-card">
          <div className="lg-brand">
            <div className="lg-brand__mark">T</div>
            <div><p className="lg-eyebrow">TRIPOS ADMIN</p><h1>Join the workspace</h1></div>
          </div>
          <div className="lg-header">
            <h2>Create your account</h2>
            <p>Set up your details to get started with TripOS.</p>
          </div>
          <form className="lg-form" onSubmit={handleSubmit}>
            <label className="lg-field">
              <span>Full name</span>
              <input type="text" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
            </label>
            <label className="lg-field">
              <span>Email address</span>
              <input type="email" name="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
            </label>
            <label className="lg-field">
              <span>Password</span>
              <input type="password" name="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={handleChange} minLength={8} required />
              <small className="lg-hint">Use at least 8 characters.</small>
            </label>
            <label className="lg-field">
              <span>Confirm password</span>
              <input type="password" name="confirmPassword" autoComplete="new-password" placeholder="Enter your password again" value={form.confirmPassword} onChange={handleChange} minLength={8} required />
            </label>
            {error ? <p className="lg-alert lg-alert--error" role="alert">{error}</p> : null}
            <button type="submit" className="lg-submit" disabled={loading}>
              {loading ? 'Creating account…' : <>Create account <span aria-hidden="true">→</span></>}
            </button>
          </form>
          <div className="lg-footer">
            <span>Already have an account?</span>
            <button type="button" className="lg-link" onClick={onSwitch}>Sign in <span aria-hidden="true">→</span></button>
          </div>
          <p className="lg-privacy"><span aria-hidden="true">◈</span> Admin access is granted to authorized accounts</p>
        </div>
      </div>
    </section>
  )
}

export default Register