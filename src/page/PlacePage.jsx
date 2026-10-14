import { useEffect, useState } from 'react'
import adminApi from '../services/adminApi.js'

const placeTheme = `
.place-card { display: flex; flex-direction: column; gap: 20px; }

.place-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap;
}
.place-header h3 {
  margin: 0; color: var(--ink-900, #1b2a24); font-size: 17px; font-weight: 700;
}
.place-count {
  display: inline-flex; align-items: center; padding: 4px 12px;
  border-radius: 999px; background: var(--accent-soft, #fbefd6);
  color: var(--accent-dark, #b87a1d); font-size: 12px; font-weight: 600;
}

.place-grid {
  display: grid; gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.place-item {
  position: relative; display: flex; flex-direction: column; overflow: hidden;
  background: #fff; border: 1px solid var(--stone-200, #dde1d0);
  border-radius: var(--radius, 14px);
  box-shadow: 0 1px 2px rgba(13, 47, 36, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.place-item::before {
  content: ''; height: 4px;
  background: linear-gradient(90deg, var(--forest-800, #14442f), var(--accent, #d4912a));
}
.place-item:hover {
  transform: translateY(-3px);
  border-color: var(--accent, #d4912a);
  box-shadow: 0 10px 26px rgba(13, 47, 36, 0.12);
}

.place-item__body {
  display: flex; flex-direction: column; gap: 8px; padding: 16px;
}
.place-item__head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
}
.place-item__head h4 {
  margin: 0; color: var(--ink-900, #1b2a24); font-size: 15px; font-weight: 700;
  line-height: 1.3;
}
.place-item__meta {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 0;
}
.place-chip {
  display: inline-flex; align-items: center; padding: 2px 10px;
  border-radius: 999px; background: var(--stone-100, #eef0e6);
  color: var(--forest-800, #14442f); font-size: 12px; font-weight: 600;
}
.place-dest {
  color: var(--ink-400, #8a998f); font-size: 12px;
}
.place-item__desc {
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  overflow: hidden; color: var(--ink-600, #566860); font-size: 12.5px; line-height: 1.55;
}
.place-rating {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 6px;
  margin-top: 2px; padding: 3px 10px; border-radius: 999px;
  background: var(--accent-soft, #fbefd6); color: var(--accent-dark, #b87a1d);
  font-size: 12px; font-weight: 600;
}

.place-pill {
  display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
  padding: 3px 10px; border-radius: 999px;
  background: var(--green-soft, #def3e8); color: var(--green, #2f9e6e);
  font-size: 11px; font-weight: 600; text-transform: capitalize; white-space: nowrap;
}
.place-pill::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor;
}

.place-empty {
  grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center;
  gap: 6px; padding: 40px 16px; color: var(--ink-600, #566860); text-align: center;
}
.place-empty strong { color: var(--ink-900, #1b2a24); font-size: 15px; }
.place-empty--error strong { color: var(--red, #d64545); }
`

const getPlaces = (payload) => {
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length }
  }

  if (Array.isArray(payload?.items)) {
    const total = Number(payload.total ?? payload.total_count ?? payload.count ?? payload.items.length)
    return {
      items: payload.items,
      total: Number.isFinite(total) ? total : payload.items.length,
    }
  }

  throw new Error('The admin API returned an unexpected place list response.')
}

function PlacePage({ refreshKey = 0 }) {
  const [places, setPlaces] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    const loadPlaces = async () => {
      setLoading(true)
      setError('')

      try {
        const firstPage = getPlaces(await adminApi.listPlaces({ page: 1, page_size: 100 }))
        const allPlaces = [...firstPage.items]
        const totalPages = Math.ceil(firstPage.total / 100)

        for (let page = 2; page <= totalPages; page += 1) {
          const nextPage = getPlaces(await adminApi.listPlaces({ page, page_size: 100 }))
          allPlaces.push(...nextPage.items)
        }

        if (isCurrent) {
          setPlaces(allPlaces)
          setTotal(firstPage.total)
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load places.')
        }
      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    loadPlaces()

    return () => {
      isCurrent = false
    }
  }, [refreshKey])

  if (loading) {
    return (
      <section className="place-card">
        <style>{placeTheme}</style>
        <div className="place-empty">
          <strong>Loading places…</strong>
          <span>Please wait while we fetch saved places.</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="place-card">
        <style>{placeTheme}</style>
        <div className="place-empty place-empty--error" role="alert">
          <strong>Unable to load places.</strong>
          <span>{error}</span>
        </div>
      </section>
    )
  }

  return (
    <section className="place-card">
      <style>{placeTheme}</style>

      <div className="place-header">
        <h3>All places</h3>
        <span className="place-count">{total} places</span>
      </div>

      <div className="place-grid">
        {places.map((place, index) => {
          const placeName = place.name || `Place ${index + 1}`

          return (
            <article key={place.id ?? `${placeName}-${index}`} className="place-item">
              <div className="place-item__body">
                <div className="place-item__head">
                  <h4>{placeName}</h4>
                  <span className="place-pill">{place.status || 'Active'}</span>
                </div>
                <p className="place-item__meta">
                  <span className="place-chip">{place.category || 'Uncategorized'}</span>
                  <span className="place-dest">Destination #{place.destination_id ?? '—'}</span>
                </p>
                <small className="place-item__desc">
                  {place.description || place.address || 'No description available.'}
                </small>
                {place.rating !== null && place.rating !== undefined ? (
                  <span className="place-rating">★ {place.rating} / 5</span>
                ) : null}
              </div>
            </article>
          )
        })}

        {places.length === 0 ? (
          <div className="place-empty">
            <strong>No places found.</strong>
            <span>Places you add will appear here.</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default PlacePage