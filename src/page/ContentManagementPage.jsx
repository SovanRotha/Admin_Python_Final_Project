import { useState } from 'react'
import adminApi from '../services/adminApi.js'

const FORM_CONFIG = {
  destinations: {
    title: 'Post a destination',
    description: 'Add a destination that travelers can discover.',
    submitLabel: 'Publish destination',
    fields: [
      { name: 'name', label: 'Destination name', required: true },
      { name: 'country', label: 'Country', required: true },
      { name: 'country_code', label: 'Country code', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'image', label: 'Image URL', type: 'url', required: true },
      { name: 'currency', label: 'Currency', required: true },
      { name: 'language', label: 'Language', required: true },
      { name: 'timezone', label: 'Timezone', required: true },
      { name: 'best_time', label: 'Best time to visit', required: true },
      {
        name: 'average_daily_cost',
        label: 'Average daily cost',
        type: 'number',
        min: '0',
        step: '0.01',
        required: true,
      },
    ],
    create: adminApi.createDestination,
  },
  places: {
    title: 'Post a place',
    description: 'Add a place and associate it with a destination.',
    submitLabel: 'Publish place',
    fields: [
      { name: 'destination_id', label: 'Destination ID', type: 'number', min: '1', step: '1', required: true },
      { name: 'name', label: 'Place name', required: true },
      { name: 'category', label: 'Category', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'address', label: 'Address', required: true },
      { name: 'latitude', label: 'Latitude', type: 'number', step: 'any', required: true },
      { name: 'longitude', label: 'Longitude', type: 'number', step: 'any', required: true },
      { name: 'estimated_cost', label: 'Estimated cost', type: 'number', min: '0', step: '0.01', required: true },
      { name: 'opening_time', label: 'Opening time', type: 'time', required: true },
      { name: 'closing_time', label: 'Closing time', type: 'time', required: true },
      { name: 'best_time_to_visit', label: 'Best time to visit', required: true },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'rating', label: 'Rating', type: 'number', min: '0', max: '5', step: '0.1', required: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
        required: true,
      },
    ],
    create: adminApi.createPlace,
  },
}

function ContentManagementPage({ type, onCreated }) {
  const config = FORM_CONFIG[type]
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(
      config.fields
        .map(({ name, type: fieldType }) => {
          const value = String(formData.get(name) ?? '').trim()
          if (!value) return null
          return [name, fieldType === 'number' ? Number(value) : value]
        })
        .filter(Boolean),
    )

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await config.create(payload)
      form.reset()
      setSuccess(`${config.title.replace(/^Post a /, '')} published successfully.`)
      onCreated?.()
    } catch (submitError) {
      setError(submitError.message || 'Unable to publish this content.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="content-card">
      <div className="card-header">
        <div>
          <h3>{config.title}</h3>
          <span>{config.description}</span>
        </div>
      </div>

      <form className="content-form" onSubmit={handleSubmit}>
        {config.fields.map((field) => (
          <label className="field" key={field.name}>
            <span>{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                rows="4"
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <select name={field.name} required={field.required} defaultValue="">
                <option value="" disabled>Select status</option>
                {field.options.map((option) => (
                  <option value={option.value} key={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type={field.type || 'text'}
                min={field.min}
                step={field.step}
                required={field.required}
              />
            )}
          </label>
        ))}

        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="auth-success" role="status">{success}</p> : null}

        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Publishing…' : config.submitLabel}
        </button>
      </form>
    </section>
  )
}

export default ContentManagementPage
