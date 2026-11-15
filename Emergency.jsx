import { useState } from 'react'
import { Link } from '../components/TransitionLink'
import { SectionHeading } from '../components/SectionHeading'
import { LocationButton } from '../components/LocationButton'
import { OrgCard } from '../components/OrgCard'
import { ErrorNotice, EmptyState, SkeletonCards } from '../components/Feedback'
import { Icon } from '../components/Icon'
import { EMERGENCY_NUMBERS, EMERGENCY_STEPS, EMERGENCY_DONT } from '../data/emergency'
import { ORG_CITIES } from '../data/organizations'
import { useLocation } from '../context/LocationContext'
import { useAsync } from '../lib/useAsync'
import { api } from '../lib/api'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PawField } from '../components/PawField'

export default function Emergency() {
  useDocumentTitle('Emergency help')
  const location = useLocation()
  const [city, setCity] = useState('')

  const { data, loading, error, reload } = useAsync(
    (signal) =>
      api.orgs(
        {
          city: city || undefined,
          lat: location.coords?.lat,
          lng: location.coords?.lng,
        },
        { signal },
      ),
    [city, location.coords?.lat, location.coords?.lng],
  )

  const nearby = (data?.items || []).slice(0, 6)

  return (
    <>
      <section className="page-hero page-hero-danger">
        <PawField variant="dark" />
        <div className="container page-hero-inner">
          <div>
            <p className="eyebrow eyebrow-light">
              <Icon name="siren" size={15} /> Emergency
            </p>
            <h1>When minutes matter, know exactly who to call.</h1>
            <p className="page-hero-lead">
              These lines work across India, around the clock. Call first, then document and report — the animal’s
              chances improve with every minute saved.
            </p>
            <div className="page-hero-actions">
              <a className="btn btn-accent btn-lg" href="tel:112">
                <Icon name="phone" size={19} /> Call 112 now
              </a>
              <Link className="btn btn-outline-light btn-lg" to="/report">
                <Icon name="camera" size={19} /> File a report
              </Link>
            </div>
          </div>
          <div className="page-hero-note">
            <Icon name="alert" size={22} />
            <p>
              <strong>Life-threatening situation?</strong> Call 112 before anything else. For a critically injured
              animal, 108 ambulance services in most states will respond.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="National helplines"
            title="Save these numbers."
            subtitle="Government-operated, toll-free and available 24×7 unless noted. No app, no registration."
          />

          <div className="help-grid">
            {EMERGENCY_NUMBERS.map((line) => (
              <article className={`help-card card ${line.primary ? 'is-primary' : ''}`} key={line.id}>
                <div className="help-card-head">
                  <span className={`help-icon tone-${line.tone || 'default'}`}>
                    <Icon name={line.icon} size={22} />
                  </span>
                  {line.verified ? (
                    <span className="verified-chip">
                      <Icon name="check" size={12} /> Verified
                    </span>
                  ) : null}
                </div>
                <p className="help-label">{line.label}</p>
                <p className="help-number">{line.number}</p>
                <p className="help-description">{line.description}</p>
                {line.note ? <p className="help-note">{line.note}</p> : null}
                <a className="btn btn-primary btn-block" href={`tel:${line.tel}`}>
                  <Icon name="phone" size={16} /> Call {line.number}
                </a>
              </article>
            ))}
          </div>

          <div className="notice notice-info help-disclaimer">
            <Icon name="info" size={20} />
            <p>
              These are the standard national emergency numbers for India. Local animal welfare helplines vary by
              state and municipality — add verified local numbers to{' '}
              <code>src/data/emergency.js</code> so they appear here.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <SectionHeading
            eyebrow="Nearby help"
            title={location.label ? `Shelters and vets near ${location.label}` : 'Find shelters and vets near you'}
            subtitle="Share your location for nearest-first results, or filter by city. Always call ahead — hours and capacity change."
            action={
              <Link to="/directory" className="btn btn-ghost btn-sm">
                Full directory <Icon name="arrowRight" size={15} />
              </Link>
            }
          />

          <div className="filter-bar">
            <LocationButton label="Find near me" />
            <label className="select-field">
              <span className="visually-hidden">Filter by city</span>
              <select value={city} onChange={(event) => setCity(event.target.value)}>
                <option value="">All cities</option>
                {ORG_CITIES.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading ? <SkeletonCards count={3} height={230} /> : null}
          {!loading && error ? <ErrorNotice error={error} onRetry={reload} /> : null}
          {!loading && !error && nearby.length === 0 ? (
            <EmptyState icon="pin" title="No listings match that filter">
              Try another city, or browse the full directory.
            </EmptyState>
          ) : null}
          {!loading && !error && nearby.length > 0 ? (
            <div className="org-grid">
              {nearby.map((org) => (
                <OrgCard org={org} key={org.id} />
              ))}
            </div>
          ) : null}

          {!location.coords && !loading ? (
            <p className="hint-line">
              <Icon name="info" size={14} /> Tip: allowing location sorts the whole directory by distance. We never
              store your coordinates unless you submit a report.
            </p>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What to do"
            title="Four steps that make a difference."
            subtitle="In the first ten minutes, calm and clarity matter more than speed."
          />
          <ol className="step-grid">
            {EMERGENCY_STEPS.map((step, index) => (
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

      <section className="section section-tinted">
        <div className="container split-feature">
          <div className="split-copy">
            <p className="eyebrow">Please avoid</p>
            <h2>Five things that make an emergency worse.</h2>
            <ul className="cross-list">
              {EMERGENCY_DONT.map((item) => (
                <li key={item}>
                  <span className="cross-icon">
                    <Icon name="x" size={14} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="split-media">
            <div className="emergency-callout card">
              <span className="emergency-callout-icon">
                <Icon name="file" size={24} />
              </span>
              <h3>Every report creates a record.</h3>
              <p>
                A photo, a location and a written description are what authorities and rescuers act on. File a
                report even if you have already called — it takes two minutes and builds the case.
              </p>
              <Link className="btn btn-accent" to="/report">
                <Icon name="camera" size={16} /> Report what you saw
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
