import { useRef, useState } from 'react'
import { Link } from '../components/TransitionLink'
import { SectionHeading } from '../components/SectionHeading'
import { DriveCard } from '../components/DriveCard'
import { ErrorNotice, SkeletonCards } from '../components/Feedback'
import { Icon } from '../components/Icon'
import { VOLUNTEER_ROLES, AVAILABILITY, VOLUNTEER_CITIES, DRIVES } from '../data/drives'
import { useAsync } from '../lib/useAsync'
import { api } from '../lib/api'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PawField } from '../components/PawField'

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  city: '',
  activities: [],
  availability: [],
  driveId: '',
  experience: '',
  message: '',
  consent: false,
  honeypot: '',
}

const CITY_ALIASES = { 'New Delhi': 'Delhi NCR', Faridabad: 'Delhi NCR' }

const STEPS = [
  {
    icon: 'search',
    title: 'Pick a drive',
    body: 'Choose a weekend feeding drive, rescue shift or health camp near you — or register as a general volunteer.',
  },
  {
    icon: 'users',
    title: 'Get a coordinator',
    body: 'A local coordinator contacts you with the meeting point, what to bring and a short safety briefing.',
  },
  {
    icon: 'paw',
    title: 'Show up and help',
    body: 'Two hours of your weekend becomes full stomachs, clean water and animals that get the care they need.',
  },
]

export default function GetInvolved() {
  useDocumentTitle('Get involved')
  const formRef = useRef(null)
  const [form, setForm] = useState(INITIAL)
  const [selectedDrive, setSelectedDrive] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const { data, loading, error: drivesError, reload } = useAsync(() => api.drives(), [])
  const drives = data?.items || []

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const toggleArray = (key, value) => {
    setForm((current) => {
      const list = current[key]
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
      return { ...current, [key]: next }
    })
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const chooseDrive = (drive) => {
    setSelectedDrive(drive.id)
    setForm((current) => ({
      ...current,
      driveId: drive.id,
      city: current.city || CITY_ALIASES[drive.city] || drive.city || '',
    }))
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const validate = () => {
    const errors = {}
    if (form.name.trim().length < 2) errors.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (!/^[0-9+\-\s()]{7,24}$/.test(form.phone)) errors.phone = 'Enter a valid phone number.'
    if (!form.city) errors.city = 'Choose your city.'
    if (form.activities.length === 0) errors.activities = 'Choose at least one way to help.'
    if (form.availability.length === 0) errors.availability = 'Tell us when you are available.'
    if (!form.consent) errors.consent = 'Please confirm you can attend responsibly.'
    return errors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    const errors = validate()
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      formRef.current?.querySelector('[aria-invalid="true"], .field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        activities: form.activities,
        availability: form.availability,
        driveId: form.driveId || '',
        experience: form.experience,
        message: form.message,
        consent: form.consent,
        honeypot: form.honeypot,
      }
      const response = await api.submitRegistration(payload)
      setResult(response)
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
    }
  }

  const reset = () => {
    setForm(INITIAL)
    setSelectedDrive(null)
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
            <p className="eyebrow">You’re in</p>
            <h1>Thank you for signing up.</h1>
            <p className="success-lead">
              A coordinator will contact you before the drive with the meeting point and a safety briefing.
            </p>
            <p className="ref-code">{result.reference}</p>

            <ul className="success-list">
              <li>
                <Icon name="mail" size={17} /> Check the email you registered with — add our domain to your contacts so
                updates do not land in spam.
              </li>
              <li>
                <Icon name="users" size={17} /> Bring closed shoes, a water bottle and clothes you do not mind getting
                dirty. Equipment is provided.
              </li>
              <li>
                <Icon name="heart" size={17} /> Cannot make it? Tell your coordinator as early as possible so someone
                else can take the spot.
              </li>
            </ul>

            <div className="success-actions">
              <Link className="btn btn-primary" to="/stories">
                See the outcomes <Icon name="arrowRight" size={16} />
              </Link>
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Register for another drive
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
            <p className="eyebrow">Get involved</p>
            <h1>Give a weekend. Change a street.</h1>
            <p className="page-hero-lead">
              Feeding drives, rescue shifts, sterilisation camps and awareness sessions run every weekend across
              India. No experience needed — training and equipment are provided.
            </p>
            <div className="page-hero-actions">
              <a className="btn btn-accent" href="#register">
                <Icon name="calendar" size={17} /> Register now
              </a>
              <a className="btn btn-ghost" href="#drives">
                Browse drives <Icon name="arrowRight" size={16} />
              </a>
            </div>
          </div>
          <div className="page-hero-badge">
            <Icon name="users" size={26} />
            <strong>{DRIVES.length} drives</strong>
            <span>Across 8 cities this season</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="How it works"
            title="Simple, safe, and genuinely useful."
            subtitle="You do not need to be a vet or a rescuer. You need two hours and a willingness to show up."
          />
          <ol className="step-grid">
            {STEPS.map((step, index) => (
              <li className="step-card card" key={step.title}>
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="step-icon">
                  <Icon name={step.icon} size={20} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-tinted" id="drives">
        <div className="container">
          <SectionHeading
            eyebrow="Upcoming drives"
            title="Pick a date that works."
            subtitle="Spots are limited so every volunteer gets a real role. Full drives still need general volunteers — register and we’ll find you a place."
            action={
              <button type="button" className="btn btn-ghost btn-sm" onClick={reload}>
                <Icon name="refresh" size={15} /> Refresh
              </button>
            }
          />

          {loading ? <SkeletonCards count={3} height={250} /> : null}
          {!loading && drivesError ? <ErrorNotice error={drivesError} onRetry={reload} /> : null}
          {!loading && !drivesError ? (
            <div className="drive-list">
              {drives.map((drive) => (
                <DriveCard
                  drive={drive}
                  key={drive.id}
                  onRegister={chooseDrive}
                  selected={selectedDrive === drive.id}
                />
              ))}
            </div>
          ) : null}

          {!loading && !drivesError ? (
            <p className="hint-line">
              <Icon name="info" size={14} /> Dates shown are upcoming weekend slots. Drive details are managed by the
              server and can be updated without redeploying the site.
            </p>
          ) : null}
        </div>
      </section>

      <section className="section" id="register">
        <div className="container report-layout">
          <form className="report-form card" onSubmit={handleSubmit} ref={formRef} noValidate>
            <div className="form-section">
              <h2>
                <span className="form-step">1</span> About you
              </h2>
              <div className="field-row">
                <label className="field">
                  <span>Full name *</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => update('name', event.target.value)}
                    maxLength="80"
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.name)}
                  />
                  {fieldErrors.name ? <em className="field-error">{fieldErrors.name}</em> : null}
                </label>
                <label className="field">
                  <span>Phone *</span>
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
              <div className="field-row">
                <label className="field">
                  <span>Email *</span>
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
                <label className="field">
                  <span>City *</span>
                  <select
                    value={form.city}
                    onChange={(event) => update('city', event.target.value)}
                    aria-invalid={Boolean(fieldErrors.city)}
                  >
                    <option value="">Select your city</option>
                    {VOLUNTEER_CITIES.map((city) => (
                      <option value={city} key={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.city ? <em className="field-error">{fieldErrors.city}</em> : null}
                </label>
              </div>
            </div>

            <div className="form-section">
              <h2>
                <span className="form-step">2</span> How would you like to help?
              </h2>
              <fieldset className="field-group">
                <legend>Choose one or more</legend>
                <div className="option-grid option-grid-compact">
                  {VOLUNTEER_ROLES.map((role) => (
                    <button
                      type="button"
                      key={role.id}
                      className={`option ${form.activities.includes(role.id) ? 'is-selected' : ''}`}
                      aria-pressed={form.activities.includes(role.id)}
                      onClick={() => toggleArray('activities', role.id)}
                    >
                      <Icon name={role.icon} size={15} /> {role.label}
                    </button>
                  ))}
                </div>
                {fieldErrors.activities ? <p className="field-error">{fieldErrors.activities}</p> : null}
              </fieldset>

              <fieldset className="field-group">
                <legend>When are you available?</legend>
                <div className="option-grid option-grid-compact">
                  {AVAILABILITY.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={`option ${form.availability.includes(slot) ? 'is-selected' : ''}`}
                      aria-pressed={form.availability.includes(slot)}
                      onClick={() => toggleArray('availability', slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {fieldErrors.availability ? <p className="field-error">{fieldErrors.availability}</p> : null}
              </fieldset>

              <label className="field">
                <span>Preferred drive</span>
                <select value={form.driveId} onChange={(event) => update('driveId', event.target.value)}>
                  <option value="">No specific drive — assign me where needed</option>
                  {drives.map((drive) => (
                    <option value={drive.id} key={drive.id} disabled={drive.full}>
                      {drive.title} · {drive.city} · {new Date(`${drive.date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {drive.full ? ' (full)' : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-section">
              <h2>
                <span className="form-step">3</span> Anything else?
              </h2>
              <label className="field">
                <span>Relevant experience <span className="optional">(optional)</span></span>
                <textarea
                  rows="2"
                  value={form.experience}
                  onChange={(event) => update('experience', event.target.value)}
                  maxLength="500"
                  placeholder="First aid training, previous rescue experience, driving licence, etc."
                />
              </label>
              <label className="field">
                <span>Message to the coordinator <span className="optional">(optional)</span></span>
                <textarea
                  rows="3"
                  value={form.message}
                  onChange={(event) => update('message', event.target.value)}
                  maxLength="1000"
                  placeholder="Accessibility needs, dietary notes, or anything we should know."
                />
              </label>

              <label className="check-field">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => update('consent', event.target.checked)}
                  aria-invalid={Boolean(fieldErrors.consent)}
                />
                <span>
                  I confirm I can attend responsibly and will inform my coordinator if my plans change.
                  {fieldErrors.consent ? <em className="field-error">{fieldErrors.consent}</em> : null}
                </span>
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

            {error ? <ErrorNotice error={error} title="Your registration was not submitted" /> : null}

            <div className="form-submit">
              <button type="submit" className="btn btn-accent btn-lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner spinner-tiny" /> Registering…
                  </>
                ) : (
                  <>
                    <Icon name="paw" size={18} /> Register as a volunteer
                  </>
                )}
              </button>
              <p className="muted small">We will only use these details to coordinate volunteering.</p>
            </div>
          </form>

          <aside className="report-aside">
            <div className="aside-card card">
              <h3>What to bring</h3>
              <ul className="check-list check-list-small">
                <li>
                  <Icon name="check" size={15} /> Closed shoes and clothes you can get dirty
                </li>
                <li>
                  <Icon name="check" size={15} /> A refillable water bottle
                </li>
                <li>
                  <Icon name="check" size={15} /> A charged phone for photos and updates
                </li>
                <li>
                  <Icon name="check" size={15} /> Your coordinator’s number saved offline
                </li>
              </ul>
            </div>

            <div className="aside-card card aside-muted">
              <h3>Safety first</h3>
              <p>
                Volunteers never handle aggressive, injured or suspected rabid animals without a trained rescuer
                present. You will be briefed before every activity — and you can say no to any task.
              </p>
            </div>

            <div className="aside-card card aside-emergency">
              <h3>
                <Icon name="siren" size={18} /> Emergency during a drive
              </h3>
              <p>Call 112, then alert your coordinator.</p>
              <a className="btn btn-danger btn-block" href="tel:112">
                <Icon name="phone" size={16} /> Call 112
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
