import { useEffect, useState } from 'react'
import adminApi from '../services/adminApi.js'
import '../App.css'

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
      <section className="content-card">
        <div className="empty-state">
          <strong>Loading places…</strong>
          <span>Please wait while we fetch saved places.</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="content-card">
        <div className="empty-state" role="alert">
          <strong>Unable to load places.</strong>
          <span>{error}</span>
        </div>
      </section>
    )
  }

  return (
    <section className="content-card">
      <div className="card-header">
        <div>
          <h3>All places</h3>
          <span>{total} places</span>
        </div>
      </div>

      <div className="destination-grid">
        {places.map((place, index) => {
          const placeName = place.name || `Place ${index + 1}`

          return (
            <article key={place.id ?? `${placeName}-${index}`} className="destination-card">
              <div className="destination-card-body">
                <div className="destination-head">
                  <h4>{placeName}</h4>
                  <span className="status-pill status-published">{place.status || 'Active'}</span>
                </div>
                <p>{place.category || 'Uncategorized'} · Destination #{place.destination_id ?? '—'}</p>
                <small>{place.description || place.address || 'No description available.'}</small>
                {place.rating !== null && place.rating !== undefined ? (
                  <small>Rating: {place.rating} / 5</small>
                ) : null}
              </div>
            </article>
          )
        })}

        {places.length === 0 ? (
          <div className="empty-state">
            <strong>No places found.</strong>
            <span>Places you add will appear here.</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default PlacePage
