import { useMemo, useRef, useState } from 'react'
import { Link } from '../components/TransitionLink'
import { SectionHeading } from '../components/SectionHeading'
import { PawField } from '../components/PawField'
import { Icon } from '../components/Icon'
import { BREEDS, CARE_STATS, PHOTO_CREDITS, SEASONAL_CARE, SPECIES, THREATS } from '../data/care'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const PHOTO_STRIP = [
  { src: '/images/animals/dog-park.jpg', alt: 'Two dogs running together outdoors', label: 'Play' },
  { src: '/images/animals/cat-longhair.jpg', alt: 'A long-haired cat looking towards the camera', label: 'Rest' },
  { src: '/images/animals/parakeet.jpg', alt: 'A rose-ringed parakeet on a branch', label: 'Fly' },
  { src: '/images/animals/star-tortoise.jpg', alt: 'An Indian star tortoise walking on grass', label: 'Protect' },
  { src: '/images/animals/cow-field.jpg', alt: 'Cattle grazing in a field at sunset', label: 'Graze' },
  { src: '/images/animals/marwari-horse.jpg', alt: 'A Marwari horse with curved ears', label: 'Gallop' },
  { src: '/images/animals/peacock.jpg', alt: 'An Indian peafowl displaying its feathers', label: 'Watch' },
  { src: '/images/animals/snake.jpg', alt: 'A snake resting among leaves', label: 'Coil' },
]

const SPECIES_META = Object.fromEntries(SPECIES.map((species) => [species.id, species]))

export default function Care() {
  useDocumentTitle('Animal care')
  const [speciesFilter, setSpeciesFilter] = useState('all')
  const breedsRef = useRef(null)

  const breeds = useMemo(
    () => BREEDS.filter((breed) => speciesFilter === 'all' || breed.species === speciesFilter),
    [speciesFilter],
  )

  const showSpecies = (id) => {
    setSpeciesFilter(id)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.requestAnimationFrame(() => {
      breedsRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    })
  }

  return (
    <>
      <section className="care-hero">
        <PawField variant="dark" />
        <div className="container care-hero-inner">
          <div className="care-hero-copy">
            <p className="eyebrow eyebrow-light">Care library</p>
            <h1>Every kind of animal. Every season. Real care that works.</h1>
            <p className="care-hero-lead">
              From indies and community cats to parakeets, tortoises, rabbits and farm animals — understand what each
              one needs, what harms them, and how to help without causing more harm.
            </p>
            <div className="care-hero-actions">
              <button type="button" className="btn btn-accent btn-lg" onClick={() => showSpecies('all')}>
                <Icon name="paw" size={18} /> Explore the breeds
              </button>
              <Link className="btn btn-outline-light btn-lg" to="/threats">
                <Icon name="shield" size={18} /> What harms animals
              </Link>
            </div>
            <dl className="care-hero-stats">
              <div>
                <dt>{CARE_STATS.species}</dt>
                <dd>species groups</dd>
              </div>
              <div>
                <dt>{CARE_STATS.breeds}</dt>
                <dd>breed &amp; type guides</dd>
              </div>
              <div>
                <dt>{CARE_STATS.seasons}</dt>
                <dd>seasonal care plans</dd>
              </div>
            </dl>
          </div>

          <div className="care-hero-media" aria-hidden="true">
            <img className="care-hero-main" src="/images/animals/dog-street.jpg" alt="" width="1280" height="851" />
            <img className="care-hero-small care-hero-small-a" src="/images/animals/cat-indie.jpg" alt="" width="900" height="619" />
            <img className="care-hero-small care-hero-small-b" src="/images/animals/rabbit.jpg" alt="" width="900" height="1350" />
            <span className="care-hero-tag care-hero-tag-a">
              <Icon name="heart" size={15} /> Care, not cruelty
            </span>
            <span className="care-hero-tag care-hero-tag-b">
              <Icon name="leaf" size={15} /> 26 breed guides
            </span>
          </div>
        </div>
      </section>

      <section className="section care-species-section">
        <div className="container">
          <SectionHeading
            eyebrow="Start with the species"
            title="Choose a companion. Learn what they actually need."
            subtitle="Care is not one-size-fits-all. Pick a group to see the essentials, then jump into breeds and types."
          />
          <div className="species-grid">
            {SPECIES.map((species) => (
              <button
                type="button"
                className={`species-card species-${species.tone}`}
                key={species.id}
                onClick={() => showSpecies(species.id)}
              >
                <span className="species-photo">
                  <img src={species.image} alt={species.imageAlt} loading="lazy" />
                  <span className="species-icon">
                    <Icon name={species.icon} size={22} />
                  </span>
                </span>
                <span className="species-body">
                  <strong>{species.label}</strong>
                  <span>{species.blurb}</span>
                  <span className="text-link">
                    Care essentials <Icon name="arrowRight" size={14} />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="photo-strip" aria-label="Real animals at the heart of this guide">
        <div className="container photo-strip-inner">
          {PHOTO_STRIP.map((photo) => (
            <figure className="photo-strip-item" key={photo.src}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <figcaption>{photo.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section section-tinted" ref={breedsRef} id="breeds">
        <div className="container">
          <SectionHeading
            eyebrow="Breeds & types"
            title="Know the animal in front of you."
            subtitle="Care summaries for Indian native breeds and the companions people ask about most. Tap a card for the practical detail."
            action={<span className="result-count">{breeds.length} guides</span>}
          />

          <div className="chip-row" role="group" aria-label="Filter breeds by species">
            <button
              type="button"
              className={`chip ${speciesFilter === 'all' ? 'is-active' : ''}`}
              aria-pressed={speciesFilter === 'all'}
              onClick={() => setSpeciesFilter('all')}
            >
              All
            </button>
            {SPECIES.map((species) => (
              <button
                type="button"
                key={species.id}
                className={`chip ${speciesFilter === species.id ? 'is-active' : ''}`}
                aria-pressed={speciesFilter === species.id}
                onClick={() => setSpeciesFilter(species.id)}
              >
                <Icon name={species.icon} size={14} /> {species.label}
              </button>
            ))}
          </div>

          <div className="breed-grid">
            {breeds.map((breed) => {
              const species = SPECIES_META[breed.species]
              return (
                <article className={`breed-card card breed-${species.tone}`} key={breed.id}>
                  <div className="breed-top">
                    <span className="breed-icon">
                      <Icon name={species.icon} size={24} />
                    </span>
                    <span className="breed-species">{species.label}</span>
                    <span className="breed-level">{breed.careLevel}</span>
                  </div>
                  <div className="breed-heading">
                    <h3>{breed.name}</h3>
                    <p>{breed.summary}</p>
                  </div>
                  <dl className="breed-facts">
                    <div>
                      <dt>Origin</dt>
                      <dd>{breed.origin}</dd>
                    </div>
                    <div>
                      <dt>Size</dt>
                      <dd>{breed.size}</dd>
                    </div>
                    <div>
                      <dt>Lifespan</dt>
                      <dd>{breed.lifespan}</dd>
                    </div>
                    <div>
                      <dt>Temperament</dt>
                      <dd>{breed.temperament}</dd>
                    </div>
                  </dl>
                  <details className="breed-details">
                    <summary>
                      <span>How to care</span>
                      <Icon name="chevronDown" size={16} />
                    </summary>
                    <ul>
                      {breed.cares.map((care) => (
                        <li key={care}>
                          <Icon name="check" size={14} /> {care}
                        </li>
                      ))}
                    </ul>
                    {breed.warning ? (
                      <p className="breed-warning">
                        <Icon name="alert" size={15} /> {breed.warning}
                      </p>
                    ) : null}
                  </details>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="The five freedoms"
            title="What good care looks like, in every species."
            subtitle="Housing, food, health and behaviour are not extras. They are the minimum an animal needs to live well."
          />
          <div className="species-care-grid">
            {SPECIES.map((species) => (
              <article className="species-care-card card" key={species.id}>
                <div className="species-care-head">
                  <span className={`species-care-icon species-${species.tone}`}>
                    <Icon name={species.icon} size={20} />
                  </span>
                  <h3>{species.label}</h3>
                </div>
                <ul className="species-needs">
                  {species.needs.map((need) => (
                    <li key={need.title}>
                      <strong>{need.title}</strong>
                      <span>{need.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted seasonal-section">
        <div className="container">
          <SectionHeading
            eyebrow="Seasonal care"
            title="The same street is a different emergency in June and December."
            subtitle="Plan ahead for India’s four hardest seasons for animals. Small preparations prevent most suffering."
            action={
              <Link to="/threats" className="btn btn-ghost btn-sm">
                See all threats <Icon name="arrowRight" size={15} />
              </Link>
            }
          />
          <div className="season-grid">
            {SEASONAL_CARE.map((season) => (
              <article className={`season-card card season-${season.tone}`} key={season.id}>
                <div className="season-head">
                  <span className="season-icon">
                    <Icon name={season.icon} size={22} />
                  </span>
                  <div>
                    <h3>{season.label}</h3>
                    <p>{season.months}</p>
                  </div>
                </div>
                <p className="season-summary">{season.summary}</p>
                <ul>
                  {season.actions.map((action) => (
                    <li key={action}>
                      <Icon name="check" size={14} /> {action}
                    </li>
                  ))}
                </ul>
                <p className="season-warning">
                  <Icon name="alert" size={15} /> {season.warning}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container care-threat-teaser">
          <div className="care-threat-copy">
            <p className="eyebrow">What harms animals</p>
            <h2>Most injuries are preventable. The cause is usually us.</h2>
            <p>
              Traffic, plastic, heat, fireworks, poison, cruelty and illegal wildlife trade hurt animals every day.
              Understanding the cause is the first step to stopping it.
            </p>
            <div className="care-threat-list">
              {THREATS.slice(0, 4).map((threat) => (
                <span className="care-threat-chip" key={threat.id}>
                  <Icon name={threat.icon} size={15} /> {threat.title}
                </span>
              ))}
            </div>
            <Link className="btn btn-primary" to="/threats">
              Explore threats &amp; solutions <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="care-threat-media">
            <img src="/images/animals/elephant.jpg" alt="An elephant walking through its habitat" loading="lazy" />
            <span className="care-threat-caption">
              <Icon name="shield" size={16} /> Wildlife needs space, not spectators
            </span>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <div className="care-credits">
            <div>
              <p className="eyebrow">Photo credits</p>
              <h2>Real animals, credited properly.</h2>
              <p>
                Photographs are used under the Unsplash License or Creative Commons licences. Wikimedia Commons images
                retain their original attribution and share-alike terms.
              </p>
            </div>
            <details className="credits-details">
              <summary>
                <span>View image credits</span>
                <Icon name="chevronDown" size={16} />
              </summary>
              <ul>
                {PHOTO_CREDITS.map((credit) => (
                  <li key={credit.file}>
                    <strong>{credit.file}</strong> — {credit.title}, {credit.author} ({credit.license}, {credit.source})
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band cta-band-compact">
          <div className="cta-band-copy">
            <p className="eyebrow">From knowledge to action</p>
            <h2>See an animal who needs help?</h2>
            <p>
              A photo, a location and a short description can get an animal treated faster. Report it, or call the
              nearest responder in the directory.
            </p>
            <div className="cta-band-actions">
              <Link className="btn btn-accent" to="/report">
                <Icon name="camera" size={17} /> Report an animal
              </Link>
              <Link className="btn btn-ghost" to="/directory">
                Find help near you <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
