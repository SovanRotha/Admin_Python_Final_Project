import { useEffect, useState } from 'react'
import adminApi from '../services/adminApi.js'

const destinationTheme = `
.dest-card { display: flex; flex-direction: column; gap: 20px; }

.dest-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap;
}
.dest-header h3 {
  margin: 0; color: var(--ink-900, #1b2a24); font-size: 17px; font-weight: 700;
}
.dest-count {
  display: inline-flex; align-items: center; padding: 4px 12px;
  border-radius: 999px; background: var(--accent-soft, #fbefd6);
  color: var(--accent-dark, #b87a1d); font-size: 12px; font-weight: 600;
}

.dest-grid {
  display: grid; gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.dest-item {
  display: flex; flex-direction: column; overflow: hidden;
  background: #fff; border: 1px solid var(--stone-200, #dde1d0);
  border-radius: var(--radius, 14px);
  box-shadow: 0 1px 2px rgba(13, 47, 36, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.dest-item:hover {
  transform: translateY(-3px);
  border-color: var(--accent, #d4912a);
  box-shadow: 0 10px 26px rgba(13, 47, 36, 0.12);
}
.dest-item__media {
  position: relative; aspect-ratio: 16 / 10; overflow: hidden;
  background: var(--stone-100, #eef0e6);
}
.dest-item__media img {
  display: block; width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s ease;
}
.dest-item:hover .dest-item__media img { transform: scale(1.05); }
.dest-item__media::after {
  content: ''; position: absolute; inset: auto 0 0 0; height: 45%;
  background: linear-gradient(180deg, transparent, rgba(13, 47, 36, 0.35));
  pointer-events: none;
}

.dest-item__body {
  display: flex; flex-direction: column; gap: 6px; padding: 16px;
}
.dest-item__head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
}
.dest-item__head h4 {
  margin: 0; color: var(--ink-900, #1b2a24); font-size: 15px; font-weight: 700;
  line-height: 1.3;
}
.dest-item__country {
  margin: 0; color: var(--forest-800, #14442f); font-size: 13px; font-weight: 600;
}
.dest-item__desc {
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  overflow: hidden; color: var(--ink-600, #566860); font-size: 12.5px; line-height: 1.55;
}

.dest-pill {
  display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
  padding: 3px 10px; border-radius: 999px;
  background: var(--green-soft, #def3e8); color: var(--green, #2f9e6e);
  font-size: 11px; font-weight: 600; text-transform: capitalize; white-space: nowrap;
}
.dest-pill::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor;
}

.dest-empty {
  grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center;
  gap: 6px; padding: 40px 16px; color: var(--ink-600, #566860); text-align: center;
}
.dest-empty strong { color: var(--ink-900, #1b2a24); font-size: 15px; }
.dest-empty--error strong { color: var(--red, #d64545); }
`

const getDestinations = (payload) => {
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

  throw new Error('The admin API returned an unexpected destination list response.')
}

function DestinationPage({ refreshKey = 0 }) {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    const loadDestinations = async () => {
      setLoading(true)
      setError('')

      try {
        const firstPage = getDestinations(
          await adminApi.listDestinations({ page: 1, page_size: 100 }),
        )
        const allDestinations = [...firstPage.items]
        const totalPages = Math.ceil(firstPage.total / 100)

        for (let page = 2; page <= totalPages; page += 1) {
          const nextPage = getDestinations(
            await adminApi.listDestinations({ page, page_size: 100 }),
          )
          allDestinations.push(...nextPage.items)
        }

        if (isCurrent) {
          setDestinations(allDestinations)
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load destinations.')
        }
      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    loadDestinations()

    return () => {
      isCurrent = false
    }
  }, [refreshKey])

  if (loading) {
    return (
      <section className="dest-card">
        <style>{destinationTheme}</style>
        <div className="dest-empty">
          <strong>Loading destinations…</strong>
          <span>Please wait while we fetch all available places.</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="dest-card">
        <style>{destinationTheme}</style>
        <div className="dest-empty dest-empty--error">
          <strong>Unable to load destinations.</strong>
          <span>{error}</span>
        </div>
      </section>
    )
  }

  return (
    <section className="dest-card">
      <style>{destinationTheme}</style>

      <div className="dest-header">
        <h3>All destinations</h3>
        <span className="dest-count">{destinations.length} destinations</span>
      </div>

      <div className="dest-grid">
        {destinations.map((destination, index) => {
          const name = destination.name || destination.title || `Destination ${index + 1}`
          const country = destination.country || destination.location || destination.city || 'Worldwide'
          const description = destination.description || destination.summary || 'No description available yet.'
          const image =
            destination.image ||
            destination.image_url ||
            destination.cover_image ||
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80'

          return (
            <article key={destination.id ?? `${name}-${index}`} className="dest-item">
              <div className="dest-item__media">
                <img src={image} alt={name} loading="lazy" />
              </div>
              <div className="dest-item__body">
                <div className="dest-item__head">
                  <h4>{name}</h4>
                  <span className="dest-pill">{destination.status || 'Published'}</span>
                </div>
                <p className="dest-item__country">{country}</p>
                <small className="dest-item__desc">{description}</small>
              </div>
            </article>
          )
        })}

        {destinations.length === 0 ? (
          <div className="dest-empty">
            <strong>No destinations found.</strong>
            <span>There are currently no places to display.</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default DestinationPage