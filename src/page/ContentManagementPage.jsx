import { useEffect, useState } from 'react'
import adminApi from '../services/adminApi.js'

const formTheme = `
.cm-card { display: flex; flex-direction: column; gap: 20px; }

.cm-header { display: flex; flex-direction: column; gap: 4px; }
.cm-header h3 {
  position: relative; margin: 0; padding-left: 14px;
  color: var(--ink-900, #1b2a24); font-size: 17px; font-weight: 700;
}
.cm-header h3::before {
  content: ''; position: absolute; left: 0; top: 3px; bottom: 3px; width: 4px;
  border-radius: 4px;
  background: linear-gradient(180deg, var(--forest-800, #14442f), var(--accent, #d4912a));
}
.cm-header span {
  padding-left: 14px; color: var(--ink-600, #566860); font-size: 13px;
}

.cm-form { display: flex; flex-direction: column; gap: 16px; }

.cm-field { display: flex; flex-direction: column; gap: 6px; }
.cm-field > span {
  color: var(--ink-900, #1b2a24); font-size: 12.5px; font-weight: 600;
}
.cm-field input,
.cm-field textarea,
.cm-field select {
  width: 100%; padding: 10px 12px; font: inherit; font-size: 14px;
  color: var(--ink-900, #1b2a24);
  background: var(--stone-50, #f7f8f3);
  border: 1px solid var(--stone-200, #dde1d0);
  border-radius: 10px;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.cm-field textarea { resize: vertical; min-height: 96px; }
.cm-field select { cursor: pointer; }
.cm-field input[type="file"] { padding: 8px; }
.cm-field input:focus,
.cm-field textarea:focus,
.cm-field select:focus {
  outline: 0; background: #fff;
  border-color: var(--accent, #d4912a);
  box-shadow: 0 0 0 3px var(--accent-soft, #fbefd6);
}
.cm-hint {
  color: var(--ink-400, #8a998f); font-size: 11.5px;
}

.cm-alert {
  margin: 0; padding: 10px 14px; border-radius: 10px;
  font-size: 13px; font-weight: 500;
}
.cm-alert--error { background: var(--red-soft, #fbe5e5); color: #a33030; }
.cm-alert--success { background: var(--green-soft, #def3e8); color: #1f7a52; }

.cm-submit {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 11px 18px; border: 0; border-radius: 10px;
  background: var(--accent, #d4912a); color: #fff;
  font: inherit; font-weight: 600; cursor: pointer;
  box-shadow: 0 4px 12px rgba(212, 145, 42, 0.3);
  transition: background 0.15s, transform 0.1s;
}
.cm-submit:hover:not(:disabled) { background: var(--accent-dark, #b87a1d); }
.cm-submit:active:not(:disabled) { transform: translateY(1px); }
.cm-submit:disabled { opacity: 0.55; cursor: not-allowed; }
`

const FORM_CONFIG = {
  destinations: {
    title: 'Post a destination',
    description: 'Add a destination that travelers can discover.',
    submitLabel: 'Publish destination',
    fields: [
      { name: 'name', label: 'Destination name', maxLength: 255, required: true },
      { name: 'country', label: 'Country', maxLength: 255, required: true },
      { name: 'country_code', label: 'Country code', minLength: 2, maxLength: 10, required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'image', label: 'Destination image', type: 'file', accept: 'image/*' },
      {
        name: 'currency', label: 'Currency', type: 'select', required: true,
        options: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'THB', 'AUD', 'CAD', 'CHF', 'INR', 'KRW', 'SGD', 'MYR', 'IDR', 'VND', 'PHP', 'NZD', 'HKD', 'AED', 'SAR'].map((value) => ({ value, label: value })),
      },
      {
        name: 'language', label: 'Language', type: 'select', required: true,
        options: [
          ['en', 'English'], ['th', 'Thai'], ['zh', 'Chinese'], ['ja', 'Japanese'],
          ['ko', 'Korean'], ['es', 'Spanish'], ['fr', 'French'], ['de', 'German'],
          ['it', 'Italian'], ['pt', 'Portuguese'], ['ru', 'Russian'], ['ar', 'Arabic'],
          ['hi', 'Hindi'], ['id', 'Indonesian'], ['vi', 'Vietnamese'], ['ms', 'Malay'],
          ['nl', 'Dutch'], ['tr', 'Turkish'], ['sv', 'Swedish'], ['km', 'Khmer'],
        ].map(([value, label]) => ({ value, label })),
      },
      {
        name: 'timezone', label: 'Time zone', type: 'select', required: true,
        options: (typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : ['UTC', 'Asia/Bangkok', 'Asia/Tokyo', 'Europe/London', 'America/New_York']).map((value) => ({ value, label: value.replaceAll('_', ' ') })),
      },
      { name: 'best_time', label: 'Best time to visit' },
      {
        name: 'average_daily_cost',
        label: 'Average daily cost',
        type: 'number',
        min: '0',
        step: '0.01',
      },
    ],
    create: adminApi.createDestination,
  },
  places: {
    title: 'Post a place',
    description: 'Add a place and associate it with a destination.',
    submitLabel: 'Publish place',
    fields: [
      { name: 'destination_id', label: 'Destination', type: 'destination', required: true },
      { name: 'name', label: 'Place name', maxLength: 255, required: true },
      {
        name: 'category', label: 'Category', type: 'select', required: true,
        options: ['Attraction', 'Restaurant', 'Hotel', 'Museum', 'Park', 'Beach', 'Shopping', 'Entertainment', 'Religious site', 'Nature', 'Other'].map((value) => ({ value, label: value })),
      },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'address', label: 'Address' },
      { name: 'latitude', label: 'Latitude', type: 'number', step: 'any' },
      { name: 'longitude', label: 'Longitude', type: 'number', step: 'any' },
      { name: 'estimated_cost', label: 'Estimated cost', type: 'number', min: '0', step: '0.01' },
      { name: 'opening_time', label: 'Opening time', type: 'time' },
      { name: 'closing_time', label: 'Closing time', type: 'time' },
      { name: 'best_time_to_visit', label: 'Best time to visit', maxLength: 100 },
      { name: 'website', label: 'Website', type: 'url', maxLength: 500 },
      { name: 'rating', label: 'Rating', type: 'number', min: '0', max: '5', step: '0.01' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
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
  const [destinations, setDestinations] = useState([])
  const [destinationError, setDestinationError] = useState('')

  useEffect(() => {
    if (type !== 'places') return undefined
    let current = true
    adminApi.listDestinations({ page: 1, page_size: 100 })
      .then((result) => {
        const items = Array.isArray(result) ? result : result?.items
        if (!Array.isArray(items)) throw new Error('Unexpected destinations response.')
        if (current) setDestinations(items)
      })
      .catch((loadError) => {
        if (current) setDestinationError(loadError.message || 'Unable to load destinations.')
      })
    return () => { current = false }
  }, [type])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const tooLongField = config.fields.find(({ name, maxLength }) => {
      const value = String(formData.get(name) ?? '').trim()
      return maxLength && value.length > maxLength
    })

    if (tooLongField) {
      setError(`${tooLongField.label} must be ${tooLongField.maxLength} characters or fewer.`)
      return
    }

    const payload = Object.fromEntries(
      config.fields
        .map(({ name, type: fieldType }) => {
          if (fieldType === 'file') return null
          const value = String(formData.get(name) ?? '').trim()
          if (!value) return null
          return [name, fieldType === 'number' || fieldType === 'destination' ? Number(value) : value]
        })
        .filter(Boolean),
    )

    const imageFile = formData.get('image')
    if (imageFile instanceof File && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        setError('Image must be 5 MB or smaller.')
        return
      }
      try {
        payload.image = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new Error('Unable to read the selected image.'))
          reader.readAsDataURL(imageFile)
        })
      } catch (imageError) {
        setError(imageError.message)
        return
      }
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await config.create(payload)
      form.reset()
      setSuccess(`${config.title.replace(/^Post a /, '')} saved successfully.`)
      onCreated?.()
    } catch (submitError) {
      setError(submitError.message || 'Unable to publish this content.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="cm-card">
      <style>{formTheme}</style>

      <div className="cm-header">
        <h3>{config.title}</h3>
        <span>{config.description}</span>
      </div>

      <form className="cm-form" onSubmit={handleSubmit}>
        {config.fields.map((field) => (
          <label className="cm-field" key={field.name}>
            <span>{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                rows="4"
                maxLength={field.maxLength}
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <select name={field.name} required={field.required} defaultValue="">
                <option value="" disabled>Select {field.label.toLowerCase()}</option>
                {field.options.map((option) => (
                  <option value={option.value} key={option.value}>{option.label}</option>
                ))}
              </select>
            ) : field.type === 'destination' ? (
              <select name={field.name} required={field.required} defaultValue="" disabled={destinations.length === 0}>
                <option value="" disabled>Select a destination</option>
                {destinations.map((destination) => (
                  <option value={destination.id} key={destination.id}>{destination.name} — {destination.country}</option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type={field.type || 'text'}
                accept={field.accept}
                min={field.min}
                max={field.max}
                minLength={field.minLength}
                maxLength={field.maxLength}
                step={field.step}
                required={field.required}
              />
            )}
            {field.type === 'destination' && destinationError ? (
              <small className="cm-hint" role="alert">{destinationError}</small>
            ) : null}
            {field.type === 'file' ? (
              <small className="cm-hint">Choose an image up to 5 MB. The selected file is sent as an image data URL.</small>
            ) : null}
            {field.maxLength ? (
              <small className="cm-hint">Maximum {field.maxLength} characters.</small>
            ) : null}
          </label>
        ))}

        {error ? <p className="cm-alert cm-alert--error" role="alert">{error}</p> : null}
        {success ? <p className="cm-alert cm-alert--success" role="status">{success}</p> : null}

        <button type="submit" className="cm-submit" disabled={submitting}>
          {submitting ? 'Publishing…' : config.submitLabel}
        </button>
      </form>
    </section>
  )
}

export default ContentManagementPage
