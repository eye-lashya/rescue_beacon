import { useEffect, useRef, useState } from 'react'
import { Link } from '../components/TransitionLink'
import { Icon } from '../components/Icon'
import { PhotoUploader } from '../components/PhotoUploader'
import { LocationButton } from '../components/LocationButton'
import { ErrorNotice } from '../components/Feedback'
import { useLocation } from '../context/LocationContext'
import { api } from '../lib/api'
import { REPORT_CATEGORY_LABELS, ANIMAL_LABELS, SEVERITY } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PawField } from '../components/PawField'

const INITIAL = {
  category: '',
  animalType: '',
  severity: 0,
  description: '',
  locationText: '',
  name: '',
  phone: '',
  email: '',
  honeypot: '',
}

const EVIDENCE_TIPS = [
  'Photograph the animal from a safe distance — one wide shot showing the location, then close-ups.',
  'Note the exact time, street and nearest landmark.',
  'Record vehicle numbers or shop names if visible, but never confront anyone.',
  'If the animal is in immediate danger, call 112 before filling this form.',
]

export default function Report() {
  useDocumentTitle('Report an animal')
  const location = useLocation()
  const [form, setForm] = useState(INITIAL)
  const [photo, setPhoto] = useState(null)
  const [photoError, setPhotoError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const formRef = useRef(null)

  const hasCoords = location.status === 'granted' && location.coords

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  useEffect(() => {
    if (!location.coords) return
    setForm((current) => {
      if (current.locationText.trim()) return current
      const label = location.label || `${location.coords.lat.toFixed(4)}, ${location.coords.lng.toFixed(4)}`
      return { ...current, locationText: label }
    })
  }, [location.coords, location.label])

  const validate = () => {
    const errors = {}
    if (!form.category) errors.category = 'Choose what is happening.'
    if (!form.animalType) errors.animalType = 'Choose the type of animal.'
    if (!form.severity) errors.severity = 'Choose how urgent it is.'
    if (form.description.trim().length < 20) errors.description = 'Describe the situation in at least 20 characters.'
    if (form.locationText.trim().length < 5) errors.locationText = 'Add a landmark, area or city so rescuers can find it.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (form.phone && !/^[0-9+\-\s()]{7,24}$/.test(form.phone)) errors.phone = 'Enter a valid phone number.'
    return errors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    const errors = validate()
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      const firstInvalid = formRef.current?.querySelector('[aria-invalid="true"], .field-error')
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const payload = new FormData()
    payload.append('category', form.category)
    payload.append('animalType', form.animalType)
    payload.append('severity', String(form.severity))
    payload.append('description', form.description)
    payload.append('locationText', form.locationText)
    payload.append('name', form.name)
    payload.append('phone', form.phone)
    payload.append('email', form.email)
    payload.append('honeypot', form.honeypot)
    if (hasCoords) {
      payload.append('latitude', String(location.coords.lat))
      payload.append('longitude', String(location.coords.lng))
    }
    if (photo) payload.append('photo', photo)

    setSubmitting(true)
    setProgress(0)
    try {
      const data = await api.submitReport(payload, { onProgress: setProgress })
      setResult(data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (submitError) {
      setError(submitError)
      if (submitError.details?.length) {
        const mapped = {}
        for (const detail of submitError.details) mapped[detail.field] = detail.message
        setFieldErrors(mapped)
      }
    } finally {
      setSubmitting(false)
      setProgress(0)
    }
  }

  const resetForm = () => {
    setForm(INITIAL)
    setPhoto(null)
    setPhotoError(null)
    setFieldErrors({})
    setError(null)
    setResult(null)
  }

  if (result) {
    return (
      <section className="section">
        <div className="container narrow">
          <div className="success-card card">
            <span className="success-icon">
              <Icon name="check" size={30} />
            </span>
            <p className="eyebrow">Report received</p>
            <h1>Thank you — your report is in.</h1>
            <p className="success-lead">
              Save your reference number. Rescuers and welfare officers use it to track the case.
            </p>
            <p className="ref-code">{result.reference}</p>

            <ul className="success-list">
              <li>
                <Icon name="alert" size={17} /> If the animal is in immediate danger, call <a href="tel:112">112</a>{' '}
                now — do not wait for a call-back.
              </li>
              <li>
                <Icon name="clock" size={17} /> Reports are reviewed as soon as possible. Timelines vary by city and
                volunteer availability.
              </li>
              {form.phone || form.email ? (
                <li>
                  <Icon name="phone" size={17} /> Responders may contact you on the details you shared.
                </li>
              ) : (
                <li>
                  <Icon name="info" size={17} /> You did not leave contact details, so the report will be handled
                  with the information provided.
                </li>
              )}
              {result.photoUrl ? (
                <li>
                  <Icon name="camera" size={17} /> Your photo was uploaded.{' '}
                  <a href={result.photoUrl} target="_blank" rel="noreferrer">
                    View it here
                  </a>
                  .
                </li>
              ) : null}
            </ul>

            <div className="success-actions">
              <Link className="btn btn-primary" to="/directory">
                <Icon name="pin" size={16} /> Find nearby care
              </Link>
              <Link className="btn btn-ghost" to="/emergency">
                <Icon name="siren" size={16} /> Emergency helplines
              </Link>
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Submit another report
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-hero">
        <PawField variant="dark" />
        <div className="container page-hero-inner">
          <div>
            <p className="eyebrow">Report</p>
            <h1>Tell us what you saw. We’ll get it to the right people.</h1>
            <p className="page-hero-lead">
              Add a photo, describe the situation and share your location. Reports with a photo and precise location
              are acted on fastest — and you do not need an account.
            </p>
          </div>
          <div className="page-hero-badge page-hero-badge-danger">
            <Icon name="siren" size={26} />
            <strong>Emergency?</strong>
            <span>
              Call <a href="tel:112">112</a> first
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container report-layout">
          <form className="report-form card" onSubmit={handleSubmit} ref={formRef} noValidate>
            <div className="form-section">
              <h2>
                <span className="form-step">1</span> What is happening?
              </h2>
              <fieldset className="field-group">
                <legend>Type of issue</legend>
                <div className="option-grid">
                  {Object.entries(REPORT_CATEGORY_LABELS).map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      className={`option ${form.category === value ? 'is-selected' : ''}`}
                      aria-pressed={form.category === value}
                      onClick={() => update('category', value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {fieldErrors.category ? <p className="field-error">{fieldErrors.category}</p> : null}
              </fieldset>

              <fieldset className="field-group">
                <legend>Which animal?</legend>
                <div className="option-grid option-grid-compact">
                  {Object.entries(ANIMAL_LABELS).map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      className={`option ${form.animalType === value ? 'is-selected' : ''}`}
                      aria-pressed={form.animalType === value}
                      onClick={() => update('animalType', value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {fieldErrors.animalType ? <p className="field-error">{fieldErrors.animalType}</p> : null}
              </fieldset>

              <fieldset className="field-group">
                <legend>How urgent is it?</legend>
                <div className="severity-grid">
                  {Object.entries(SEVERITY).map(([value, info]) => (
                    <button
                      type="button"
                      key={value}
                      className={`severity-option severity-${value} ${Number(form.severity) === Number(value) ? 'is-selected' : ''}`}
                      aria-pressed={Number(form.severity) === Number(value)}
                      onClick={() => update('severity', Number(value))}
                    >
                      <span className="severity-dot" aria-hidden="true" />
                      <strong>{info.label}</strong>
                      <small>{info.hint}</small>
                    </button>
                  ))}
                </div>
                {fieldErrors.severity ? <p className="field-error">{fieldErrors.severity}</p> : null}
              </fieldset>
            </div>

            <div className="form-section">
              <h2>
                <span className="form-step">2</span> Describe it
              </h2>
              <label className="field">
                <span>What did you see?</span>
                <textarea
                  rows="5"
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  placeholder="Example: A brown dog near the bus stop has a deep wound on its back leg. It is limping and cannot put weight on the leg. It has been there since yesterday."
                  maxLength="2000"
                  aria-invalid={Boolean(fieldErrors.description)}
                />
                <span className="field-hint">
                  {form.description.length}/2000 characters · at least 20
                  {fieldErrors.description ? <em className="field-error">{fieldErrors.description}</em> : null}
                </span>
              </label>
            </div>

            <div className="form-section">
              <h2>
                <span className="form-step">3</span> Where is it?
              </h2>
              <label className="field">
                <span>Location or nearest landmark</span>
                <input
                  type="text"
                  value={form.locationText}
                  onChange={(event) => update('locationText', event.target.value)}
                  placeholder="Street, landmark, area and city"
                  maxLength="300"
                  aria-invalid={Boolean(fieldErrors.locationText)}
                />
                {fieldErrors.locationText ? <em className="field-error">{fieldErrors.locationText}</em> : null}
              </label>

              <div className="location-row">
                <LocationButton label="Use my current location" />
                <span className="muted small">
                  {hasCoords
                    ? 'GPS coordinates will be attached to this report.'
                    : 'Optional — the text address is enough if you prefer not to share GPS.'}
                </span>
              </div>

              <div className="photo-section">
                <h3>Photo</h3>
                <PhotoUploader file={photo} onChange={setPhoto} onError={setPhotoError} error={photoError} />
              </div>
            </div>

            <div className="form-section">
              <h2>
                <span className="form-step">4</span> Your details <span className="optional">(optional)</span>
              </h2>
              <p className="form-note">
                Shared only with the responders handling this case. Leave blank to report anonymously.
              </p>
              <div className="field-row">
                <label className="field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => update('name', event.target.value)}
                    maxLength="80"
                    autoComplete="name"
                  />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => update('phone', event.target.value)}
                    maxLength="24"
                    autoComplete="tel"
                    aria-invalid={Boolean(fieldErrors.phone)}
                  />
                  {fieldErrors.phone ? <em className="field-error">{fieldErrors.phone}</em> : null}
                </label>
              </div>
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  maxLength="140"
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email ? <em className="field-error">{fieldErrors.email}</em> : null}
              </label>

              <div className="hp-field" aria-hidden="true">
                <label>
                  Leave this field empty
                  <input
                    type="text"
                    name="honeypot"
                    tabIndex="-1"
                    autoComplete="off"
                    value={form.honeypot}
                    onChange={(event) => update('honeypot', event.target.value)}
                  />
                </label>
              </div>
            </div>

            {error ? (
              <ErrorNotice
                error={error}
                title="Your report was not submitted"
                onRetry={undefined}
              />
            ) : null}

            {submitting && progress > 0 ? (
              <div className="upload-progress" aria-live="polite">
                <div className="progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
                <span className="muted small">Uploading… {progress}%</span>
              </div>
            ) : null}

            <div className="form-submit">
              <button type="submit" className="btn btn-accent btn-lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner spinner-tiny" /> Sending report…
                  </>
                ) : (
                  <>
                    <Icon name="camera" size={18} /> Submit report
                  </>
                )}
              </button>
              <p className="muted small">
                By submitting, you confirm the information is accurate to the best of your knowledge.
              </p>
            </div>
          </form>

          <aside className="report-aside">
            <div className="aside-card card aside-emergency">
              <h3>
                <Icon name="siren" size={18} /> Animal in danger now?
              </h3>
              <p>Call before filling any form. Every minute matters.</p>
              <a className="btn btn-danger btn-block" href="tel:112">
                <Icon name="phone" size={16} /> Call 112
              </a>
              <a className="btn btn-ghost btn-block" href="tel:108">
                <Icon name="ambulance" size={16} /> Ambulance 108
              </a>
            </div>

            <div className="aside-card card">
              <h3>Evidence that helps</h3>
              <ul className="check-list check-list-small">
                {EVIDENCE_TIPS.map((tip) => (
                  <li key={tip}>
                    <Icon name="check" size={15} /> {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="aside-card card aside-muted">
              <h3>Your privacy</h3>
              <p>
                Contact details are stored with the case and shared only with responders. Photos are stored on our
                server — never posted publicly. IP addresses are hashed for abuse prevention.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
