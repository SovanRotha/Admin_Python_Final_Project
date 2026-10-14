

import { useEffect, useState } from 'react'
import adminApi from '../services/adminApi.js'
import '../App.css'

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
      <section className="content-card">
        <div className="empty-state">
          <strong>Loading destinations…</strong>
          <span>Please wait while we fetch all available places.</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="content-card">
        <div className="empty-state">
          <strong>Unable to load destinations.</strong>
          <span>{error}</span>
        </div>
      </section>
    )
  }

  return (
    <section className="content-card">
      <div className="card-header">
        <div>
          <h3>All destinations</h3>
          <span>{destinations.length} destinations</span>
        </div>
      </div>

      <div className="destination-grid">
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
            <article key={destination.id ?? `${name}-${index}`} className="destination-card">
              <img src={image} alt={name} />
              <div className="destination-card-body">
                <div className="destination-head">
                  <h4>{name}</h4>
                  <span className="status-pill status-published">{destination.status || 'Published'}</span>
                </div>
                <p>{country}</p>
                <small>{description}</small>
              </div>
            </article>
          )
        })}

        {destinations.length === 0 ? (
          <div className="empty-state">
            <strong>No destinations found.</strong>
            <span>There are currently no places to display.</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default DestinationPage