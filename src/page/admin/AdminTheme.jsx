const adminTheme = `
.adm-shell {
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
  --green: #2f9e6e;
  --green-soft: #def3e8;
  --red: #d64545;
  --red-soft: #fbe5e5;
  --amber-text: #a8731a;
  --amber-soft: #fcf0d4;
  --sky: #2f80c4;
  --sky-soft: #e1eefa;
  --violet: #7c5cc4;
  --violet-soft: #ece6f8;
  --radius: 14px;
  --shadow: 0 1px 2px rgba(13, 47, 36, 0.05), 0 6px 20px rgba(13, 47, 36, 0.06);

  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
  background: var(--stone-50);
  color: var(--ink-900);
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.adm-shell *, .adm-shell *::before, .adm-shell *::after { box-sizing: border-box; }
.adm-icon { flex-shrink: 0; }

/* Sidebar */
.adm-sidebar {
  position: sticky; top: 0; height: 100vh;
  display: flex; flex-direction: column; gap: 28px;
  padding: 24px 16px;
  background: linear-gradient(180deg, var(--forest-900) 0%, var(--forest-800) 100%);
  color: #fff;
}
.adm-brand { display: flex; align-items: center; gap: 12px; padding: 0 8px; }
.adm-brand__mark {
  display: grid; place-items: center; width: 40px; height: 40px;
  border-radius: 12px; background: linear-gradient(135deg, var(--accent), #f0c15a);
  color: var(--forest-900); font-size: 18px; font-weight: 800;
  box-shadow: 0 6px 16px rgba(212, 145, 42, 0.35);
}
.adm-brand strong { display: block; font-size: 16px; letter-spacing: 0.2px; }
.adm-brand span {
  display: block; font-size: 11px; letter-spacing: 1.4px;
  text-transform: uppercase; color: rgba(255, 255, 255, 0.55);
}
.adm-nav { display: flex; flex-direction: column; gap: 4px; }
.adm-nav__item {
  position: relative; display: flex; align-items: center; gap: 12px;
  width: 100%; padding: 11px 14px; border: 0; border-radius: 10px;
  background: transparent; color: rgba(255, 255, 255, 0.7);
  font: inherit; font-weight: 500; text-align: left; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.adm-nav__item:hover { background: rgba(255, 255, 255, 0.07); color: #fff; }
.adm-nav__item.is-active { background: rgba(255, 255, 255, 0.12); color: #fff; }
.adm-nav__item.is-active::before {
  content: ''; position: absolute; left: -16px; top: 10px; bottom: 10px;
  width: 4px; border-radius: 0 4px 4px 0; background: var(--accent);
}
.adm-nav__item.is-active .adm-icon { color: #f0c15a; }
.adm-sidebar__footer {
  display: flex; align-items: center; gap: 10px; margin-top: auto;
  padding: 12px 14px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.06); color: rgba(255, 255, 255, 0.65); font-size: 12px;
}
.adm-live {
  width: 8px; height: 8px; border-radius: 50%; background: #4ade80;
  box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.2);
}

/* Main + header */
.adm-main { min-width: 0; padding: 32px 40px 48px; }
.adm-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 24px;
}
.adm-header h2 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.3px; }
.adm-header p { margin: 4px 0 0; color: var(--ink-600); }
.adm-header__actions { display: flex; gap: 8px; }

/* Buttons */
.adm-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 9px 16px; border: 1px solid transparent; border-radius: 10px;
  font: inherit; font-weight: 600; line-height: 1.2; cursor: pointer; list-style: none;
  transition: background 0.15s, border-color 0.15s, transform 0.1s, box-shadow 0.15s;
}
.adm-btn:active:not(:disabled) { transform: translateY(1px); }
.adm-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.adm-btn--small { padding: 6px 12px; font-size: 13px; }
.adm-btn--primary { background: var(--accent); color: #fff; box-shadow: 0 4px 12px rgba(212, 145, 42, 0.3); }
.adm-btn--primary:hover:not(:disabled) { background: var(--accent-dark); }
.adm-btn--ghost { background: #fff; border-color: var(--stone-200); color: var(--ink-900); }
.adm-btn--ghost:hover:not(:disabled) { background: var(--stone-100); }
.adm-btn--danger { background: var(--red-soft); color: var(--red); }
.adm-btn--danger:hover:not(:disabled) { background: #f7d3d3; }
.adm-btn--success { background: var(--green-soft); color: var(--green); }
.adm-btn--success:hover:not(:disabled) { background: #cdeedd; }

/* Banners */
.adm-banner {
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
  padding: 12px 16px; border-radius: 12px; font-weight: 500;
}
.adm-banner span { flex: 1; }
.adm-banner button {
  padding: 5px 12px; border: 0; border-radius: 8px;
  background: rgba(0, 0, 0, 0.07); color: inherit; font: inherit; font-weight: 600; cursor: pointer;
}
.adm-banner--error { background: var(--red-soft); color: #a33030; }
.adm-banner--success { background: var(--green-soft); color: #1f7a52; }

/* Card */
.adm-card {
  background: #fff; border: 1px solid var(--stone-200);
  border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden;
}
.adm-card__header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; padding: 20px 24px; border-bottom: 1px solid var(--stone-100);
}
.adm-card__header h3 { margin: 0; font-size: 17px; font-weight: 700; }
.adm-card__header p { margin: 2px 0 0; color: var(--ink-600); font-size: 13px; }

/* Filters */
.adm-filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.adm-search {
  display: flex; align-items: center; gap: 8px; padding: 0 12px; height: 40px;
  min-width: 240px; border: 1px solid var(--stone-200); border-radius: 10px;
  background: var(--stone-50); color: var(--ink-400);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.adm-search:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); background: #fff; }
.adm-search input { flex: 1; border: 0; outline: 0; background: transparent; color: var(--ink-900); font: inherit; }
.adm-select {
  height: 40px; padding: 0 12px; border: 1px solid var(--stone-200); border-radius: 10px;
  background: var(--stone-50); color: var(--ink-900); font: inherit; cursor: pointer;
}
.adm-select:focus { outline: 0; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.adm-filters .adm-btn { height: 40px; }

/* Table */
.adm-table-wrap { overflow-x: auto; }
.adm-table { width: 100%; border-collapse: collapse; }
.adm-table th {
  padding: 12px 24px; background: var(--stone-50); color: var(--ink-600);
  font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-align: left;
  text-transform: uppercase; white-space: nowrap;
}
.adm-table td { padding: 16px 24px; border-top: 1px solid var(--stone-100); vertical-align: middle; }
.adm-table tbody tr:hover { background: #fafbf6; }
.adm-th-right, .adm-td-right { text-align: right !important; }
.adm-user { display: flex; align-items: center; gap: 12px; }
.adm-user strong { display: block; font-weight: 600; }
.adm-user small, .adm-subtext { display: block; color: var(--ink-600); font-size: 12px; }
.adm-subtext { max-width: 360px; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.adm-muted { color: var(--ink-600); }
.adm-avatar {
  display: grid; place-items: center; width: 38px; height: 38px; flex-shrink: 0;
  border-radius: 50%; background: linear-gradient(135deg, var(--green-soft), var(--accent-soft));
  color: var(--forest-800); font-size: 13px; font-weight: 700;
}
.adm-avatar--small { width: 24px; height: 24px; font-size: 10px; }

/* Status pills */
.adm-pill {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
  border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap;
}
.adm-pill__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.adm-pill--success { background: var(--green-soft); color: var(--green); }
.adm-pill--warning { background: var(--amber-soft); color: var(--amber-text); }
.adm-pill--danger { background: var(--red-soft); color: var(--red); }
.adm-pill--info { background: var(--sky-soft); color: var(--sky); }
.adm-pill--violet { background: var(--violet-soft); color: var(--violet); }
.adm-pill--neutral { background: var(--stone-100); color: var(--ink-600); }

/* Report review */
.adm-review { position: relative; display: inline-block; text-align: left; }
.adm-review summary::-webkit-details-marker { display: none; }
.adm-review__form {
  position: absolute; right: 0; top: calc(100% + 8px); z-index: 20;
  display: flex; flex-direction: column; gap: 12px; width: 300px; padding: 16px;
  border: 1px solid var(--stone-200); border-radius: 12px; background: #fff;
  box-shadow: 0 12px 32px rgba(13, 47, 36, 0.16);
}
.adm-review__form label {
  display: flex; flex-direction: column; gap: 6px;
  font-size: 12px; font-weight: 600; color: var(--ink-600);
}
.adm-review__form small { font-weight: 400; color: var(--ink-400); }
.adm-review__form input, .adm-review__form textarea {
  padding: 9px 12px; border: 1px solid var(--stone-200); border-radius: 8px;
  background: var(--stone-50); color: var(--ink-900); font: inherit; resize: vertical;
}
.adm-review__form input:focus, .adm-review__form textarea:focus {
  outline: 0; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); background: #fff;
}

/* Pagination */
.adm-pagination {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 14px 24px; border-top: 1px solid var(--stone-100); color: var(--ink-600); font-size: 13px;
}
.adm-pagination div { display: flex; gap: 8px; }

/* Empty + skeleton */
.adm-empty {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 48px 16px; color: var(--ink-600); text-align: center;
}
.adm-empty strong { color: var(--ink-900); font-size: 15px; }
.adm-empty__icon {
  display: grid; place-items: center; width: 52px; height: 52px; margin-bottom: 6px;
  border-radius: 50%; background: var(--stone-100); color: var(--accent);
}
.adm-skeleton { display: flex; flex-direction: column; gap: 14px; padding: 24px; }
.adm-skeleton__bar {
  height: 18px; border-radius: 8px;
  background: linear-gradient(90deg, var(--stone-100) 25%, var(--stone-50) 50%, var(--stone-100) 75%);
  background-size: 200% 100%; animation: adm-shimmer 1.4s infinite linear;
}
.adm-skeleton__bar--title { width: 30%; height: 24px; }
@keyframes adm-shimmer { to { background-position: -200% 0; } }

/* Settings + audit */
.adm-settings__list { margin: 0; padding: 8px 24px; }
.adm-settings__row {
  display: flex; justify-content: space-between; gap: 16px;
  padding: 14px 0; border-bottom: 1px solid var(--stone-100);
}
.adm-settings__row dt { color: var(--ink-600); }
.adm-settings__row dd { margin: 0; font-weight: 600; }
.adm-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 24px 24px; }
.adm-chip {
  display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px 5px 6px;
  border-radius: 999px; background: var(--stone-100); font-size: 13px;
}
.adm-timeline { margin: 0; padding: 8px 24px; list-style: none; }
.adm-timeline__item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 0; border-bottom: 1px solid var(--stone-100);
}
.adm-timeline__dot {
  width: 10px; height: 10px; margin-top: 6px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft);
}
.adm-timeline__copy { flex: 1; }
.adm-timeline__copy strong { display: block; font-weight: 600; }
.adm-timeline__copy span { color: var(--ink-600); font-size: 13px; }
.adm-timeline time { color: var(--ink-400); font-size: 12px; white-space: nowrap; }

/* Destinations / Places layout */
.adm-split { display: grid; grid-template-columns: minmax(0, 1fr); gap: 24px; }
@media (min-width: 1280px) {
  .adm-split { grid-template-columns: minmax(340px, 420px) minmax(0, 1fr); align-items: start; }
}
.adm-embed {
  min-width: 0; padding: 24px; border: 1px solid var(--stone-200);
  border-radius: var(--radius); background: #fff; box-shadow: var(--shadow);
}

/* Responsive */
@media (max-width: 960px) {
  .adm-shell { grid-template-columns: 1fr; }
  .adm-sidebar {
    position: static; height: auto; flex-direction: row; align-items: center;
    gap: 16px; padding: 12px 16px; overflow-x: auto;
  }
  .adm-brand span, .adm-sidebar__footer { display: none; }
  .adm-nav { flex-direction: row; }
  .adm-nav__item { width: auto; white-space: nowrap; }
  .adm-nav__item.is-active::before { display: none; }
  .adm-main { padding: 20px 16px 32px; }
  .adm-search { min-width: 0; flex: 1; }
}
`

function AdminTheme() {
  return <style>{adminTheme}</style>
}

export default AdminTheme
