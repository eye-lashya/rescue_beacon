import { useMemo, useState } from 'react'
import { Link } from '../components/TransitionLink'
import { SectionHeading } from '../components/SectionHeading'
import { LocationButton } from '../components/LocationButton'
import { OrgCard } from '../components/OrgCard'
import { ErrorNotice, EmptyState, SkeletonCards } from '../components/Feedback'
import { Icon } from '../components/Icon'
import { CATEGORIES, ORG_CITIES, ORG_STATES } from '../data/organizations'
import { useLocation } from '../context/LocationContext'
import { useAsync, useDebouncedValue } from '../lib/useAsync'
import { api } from '../lib/api'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PawField } from '../components/PawField'

export default function Directory() {
  useDocumentTitle('Directory')
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [sort, setSort] = useState('distance')
  const debouncedQuery = useDebouncedValue(query, 300)

  const coords = location.coords

  const { data, loading, error, reload } = useAsync(
    (signal) =>
      api.orgs(
        {
          q: debouncedQuery || undefined,
          category: category === 'all' ? undefined : category,
          city: city || undefined,
          state: state || undefined,
          lat: coords?.lat,
          lng: coords?.lng,
        },
        { signal },
      ),
    [debouncedQuery, category, city, state, coords?.lat, coords?.lng],
  )

  const items = useMemo(() => {
    const list = [...(data?.items || [])]
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [data, sort])

  const clearFilters = () => {
    setQuery('')
    setCategory('all')
    setCity('')
    setState('')
  }

  const showMadhyaPradesh = () => {
    setQuery('')
    setCategory('all')
    setCity('')
    setState('Madhya Pradesh')
    setSort('name')
  }

  const hasFilters = query || category !== 'all' || city || state

  return (
    <>
      <section className="page-hero">
        <PawField variant="dark" />
        <div className="container page-hero-inner">
          <div>
            <p className="eyebrow">Directory</p>
            <h1>Shelters, vets and rescue groups across India.</h1>
            <p className="page-hero-lead">
              Find the closest place that can help — sorted by distance when you share your location. Always call
              ahead: hours, capacity and services change.
            </p>
          </div>
          <div className="page-hero-badge">
            <Icon name="map" size={26} />
            <strong>Nationwide</strong>
            <span>Approximate locations · directions via Maps</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="mp-spotlight">
            <div className="mp-spotlight-icon">
              <Icon name="pin" size={22} />
            </div>
            <div className="mp-spotlight-copy">
              <p className="eyebrow">Madhya Pradesh spotlight</p>
              <h2>Bhopal, Indore and Jabalpur — now with more local responders.</h2>
              <p>
                We added Bhopal NGOs, 24-hour pet clinics, government veterinary hospitals, wildlife rescuers and
                district helplines. Filter the directory to Madhya Pradesh to see them together.
              </p>
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={showMadhyaPradesh}>
              <Icon name="map" size={16} /> Show MP listings
            </button>
          </div>

          <div className="directory-controls card">
            <label className="search-field">
              <Icon name="search" size={18} />
              <span className="visually-hidden">Search the directory</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, city or service…"
              />
            </label>

            <div className="control-row">
              <label className="select-field">
                <span className="visually-hidden">Filter by state</span>
                <select value={state} onChange={(event) => setState(event.target.value)}>
                  <option value="">All states</option>
                  {ORG_STATES.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

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

              <label className="select-field">
                <span className="visually-hidden">Sort results</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="distance">Nearest first</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>

              <LocationButton label="Near me" compact />
            </div>

            <div className="chip-row chip-row-tight" role="group" aria-label="Filter by category">
              <button
                type="button"
                className={`chip ${category === 'all' ? 'is-active' : ''}`}
                aria-pressed={category === 'all'}
                onClick={() => setCategory('all')}
              >
                All
              </button>
              {CATEGORIES.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`chip ${category === item.id ? 'is-active' : ''}`}
                  aria-pressed={category === item.id}
                  onClick={() => setCategory(item.id)}
                >
                  <Icon name={item.icon} size={14} /> {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="results-bar">
            <p>
              {loading ? 'Searching…' : `${items.length} ${items.length === 1 ? 'place' : 'places'}`}
              {coords && sort === 'distance' && !loading ? ' · nearest first' : ''}
            </p>
            {hasFilters ? (
              <button type="button" className="text-button" onClick={clearFilters}>
                <Icon name="x" size={14} /> Clear filters
              </button>
            ) : null}
          </div>

          {loading ? <SkeletonCards count={6} height={240} /> : null}

          {!loading && error ? <ErrorNotice error={error} onRetry={reload} /> : null}

          {!loading && !error && items.length === 0 ? (
            <EmptyState icon="search" title="No places match those filters">
              <p>Try a different city or service, or clear the filters to see the full directory.</p>
              <button type="button" className="btn btn-ghost btn-sm" onClick={clearFilters}>
                Clear filters
              </button>
            </EmptyState>
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <div className="org-grid">
              {items.map((org) => (
                <OrgCard org={org} key={org.id} />
              ))}
            </div>
          ) : null}

          <div className="notice notice-info directory-note">
            <Icon name="info" size={20} />
            <p>
              Listings are community-maintained starting points, and locations are approximate. Use “Directions” for
              the exact map location and call before travelling. To add or correct an entry, edit{' '}
              <code>src/data/organizations.js</code>.
            </p>
          </div>

          <div className="directory-cta">
            <div>
              <h2>Found an animal that needs help?</h2>
              <p>A report with a photo and location reaches responders faster than a phone call alone.</p>
            </div>
            <Link className="btn btn-accent" to="/report">
              <Icon name="camera" size={17} /> File a report
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
