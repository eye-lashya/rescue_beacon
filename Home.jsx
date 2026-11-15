import { Link } from '../components/TransitionLink'
import { EmergencyStrip } from '../components/EmergencyStrip'
import { SectionHeading } from '../components/SectionHeading'
import { MythCard } from '../components/MythCard'
import { BeforeAfterSlider } from '../components/BeforeAfterSlider'
import { ArticleCard } from '../components/ArticleCard'
import { PawField } from '../components/PawField'
import { Icon } from '../components/Icon'
import { ARTICLES, getArticle } from '../data/articles'
import { SPECIES } from '../data/care'
import { MISCONCEPTIONS } from '../data/misconceptions'
import { TRANSFORMATIONS } from '../data/transformations'
import { ORGANIZATIONS, ORG_CITIES } from '../data/organizations'
import { DRIVES } from '../data/drives'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const QUICK_ACTIONS = [
  {
    to: '/report',
    icon: 'camera',
    tone: 'accent',
    title: 'Report an animal in distress',
    body: 'Add a photo and your location. Your report becomes a timestamped case for responders.',
    cta: 'File a report',
  },
  {
    to: '/emergency',
    icon: 'siren',
    tone: 'danger',
    title: 'Get emergency help',
    body: 'Nationwide helplines and the nearest shelters, vets and NGOs — sorted by distance.',
    cta: 'See helplines',
  },
  {
    to: '/directory',
    icon: 'stethoscope',
    tone: 'teal',
    title: 'Find care near you',
    body: 'Shelters, veterinary hospitals and rescue groups across India, with directions.',
    cta: 'Open directory',
  },
  {
    to: '/learn',
    icon: 'book',
    tone: 'blue',
    title: 'Learn what actually helps',
    body: 'Animal law, vaccination, summer water, stray safety and everyday pet care.',
    cta: 'Read the guides',
  },
]

export default function Home() {
  useDocumentTitle(null)

  const summer = getArticle('water-for-street-animals-summer')
  const heroMyths = MISCONCEPTIONS.filter((myth) =>
    ['aggressive-by-nature', 'feeding-multiplies', 'sterilisation-cruel'].includes(myth.id),
  )
  const story = TRANSFORMATIONS[0]
  const nextDrive = DRIVES[0]
  const nextDriveDate = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(
    new Date(`${nextDrive.date}T00:00:00`),
  )

  return (
    <>
      <section className="hero">
        <PawField variant="dark" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <span className="pulse-dot" aria-hidden="true" /> For every street animal in India
            </span>
            <h1>
              Every animal deserves a voice. <em>Be their beacon.</em>
            </h1>
            <p className="hero-lead">
              Report cruelty in minutes with a photo and precise location, reach verified emergency helplines, and
              find shelters, vets and NGOs near you — anywhere in India.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-accent btn-lg" to="/report">
                <Icon name="camera" size={19} /> Report an animal
              </Link>
              <Link className="btn btn-outline-light btn-lg" to="/emergency">
                <Icon name="siren" size={19} /> Emergency help
              </Link>
            </div>
            <ul className="hero-points">
              <li>
                <Icon name="check" size={16} /> Photo + GPS report
              </li>
              <li>
                <Icon name="check" size={16} /> Nationwide directory
              </li>
              <li>
                <Icon name="check" size={16} /> Free, no sign-up
              </li>
            </ul>
          </div>

          <div className="hero-art">
            <div className="hero-photo-stack">
              <img
                className="hero-photo-main"
                src="/images/animals/dog-park.jpg"
                alt="Two rescued street dogs running together in the open air"
                width="1200"
                height="801"
                fetchPriority="high"
              />
              <img
                className="hero-photo-small"
                src="/images/animals/cat-indie.jpg"
                alt="A black and white community cat resting calmly"
                width="900"
                height="619"
                loading="lazy"
              />
            </div>
            <div className="hero-float hero-float-call">
              <span className="hero-float-label">Emergency</span>
              <a href="tel:112">112</a>
              <small>Police · Ambulance · Fire</small>
            </div>
            <div className="hero-float hero-float-stat">
              <Icon name="paw" size={18} />
              <strong>{ORGANIZATIONS.length}+</strong>
              <span>shelters, vets &amp; NGOs</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-actions">
        <div className="container">
          <SectionHeading
            eyebrow="Start here"
            title="What do you need right now?"
            subtitle="Four ways to help an animal today — no account needed."
          />
          <div className="quick-grid">
            {QUICK_ACTIONS.map((action) => (
              <div className="float-box" key={action.to}>
                <Link to={action.to} className={`quick-card card quick-${action.tone}`}>
                  <span className="quick-icon">
                    <Icon name={action.icon} size={24} />
                  </span>
                  <h3>{action.title}</h3>
                  <p>{action.body}</p>
                  <span className="text-link">
                    {action.cta} <Icon name="arrowRight" size={15} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmergencyStrip />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Myth vs fact"
            title="What you believe about street animals might be wrong."
            subtitle="Twelve common misconceptions, and the evidence that replaces them. Tap a card to flip it."
            action={
              <Link to="/myths" className="btn btn-ghost btn-sm">
                All 12 myths <Icon name="arrowRight" size={15} />
              </Link>
            }
          />
          <div className="myth-grid myth-grid-home">
            {heroMyths.map((myth) => (
              <MythCard myth={myth} key={myth.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container split-feature">
          <div className="split-media">
            <img
              src="/images/animals/dog-street.jpg"
              alt="A street dog standing outdoors in the Indian heat"
              className="feature-image"
              loading="lazy"
              width="1100"
              height="731"
            />
            <span className="feature-chip">
              <Icon name="drop" size={15} /> Summer essentials
            </span>
          </div>
          <div className="split-copy">
            <p className="eyebrow">Seasonal care</p>
            <h2>One bowl of clean water can save a life this summer.</h2>
            <p>
              Road surfaces cross 50°C between March and June. A shallow, heavy bowl in lasting shade — refilled
              twice a day — is the single most useful thing you can do for street animals. Here is how to do it
              properly, and what never to give.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="check" size={16} /> Shallow bowl, lasting shade, fresh water twice daily
              </li>
              <li>
                <Icon name="check" size={16} /> No milk, no ice-cold water, no sugary drinks
              </li>
              <li>
                <Icon name="check" size={16} /> Learn the early signs of heatstroke
              </li>
            </ul>
            <Link className="btn btn-primary" to={`/learn/${summer.slug}`}>
              Read the water guide <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section home-care-section">
        <div className="container">
          <SectionHeading
            eyebrow="Care library"
            title="Every animal. Every season. Real care that works."
            subtitle="Indies, community cats, parakeets, tortoises, rabbits and farm animals — what each one needs, what harms them, and how to help without causing more harm."
            action={
              <Link to="/care" className="btn btn-ghost btn-sm">
                Open care library <Icon name="arrowRight" size={15} />
              </Link>
            }
          />
          <div className="home-care-grid">
            {SPECIES.map((species) => (
              <Link className={`home-care-card home-care-${species.tone}`} to="/care" key={species.id}>
                <img src={species.image} alt={species.imageAlt} loading="lazy" />
                <span className="home-care-body">
                  <span className="home-care-icon">
                    <Icon name={species.icon} size={18} />
                  </span>
                  <strong>{species.label}</strong>
                  <span>{species.needs[0].title}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="home-threat-band">
            <span className="home-threat-icon">
              <Icon name="shield" size={24} />
            </span>
            <div>
              <p className="eyebrow">What harms animals</p>
              <h3>Traffic, plastic, heat, poison and cruelty — all preventable.</h3>
              <p>
                Learn the ten biggest threats, the first-aid steps that buy time, and the small changes that keep
                animals safe through every season.
              </p>
            </div>
            <Link className="btn btn-primary" to="/threats">
              See threats &amp; solutions <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-feature split-reverse">
          <div className="split-copy">
            <p className="eyebrow">Before &amp; after</p>
            <h2>{story.name} was dragging a broken leg. Today he runs.</h2>
            <p>{story.story}</p>
            <div className="story-meta-row">
              <span className="badge badge-soft">
                <Icon name="pin" size={13} /> {story.location}
              </span>
              <span className="meta-line">
                <Icon name="clock" size={13} /> {story.period}
              </span>
            </div>
            <Link className="btn btn-primary" to="/stories">
              See all rescue stories <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="split-media">
            <BeforeAfterSlider before={story.before} after={story.after} name={story.name} />
            <p className="slider-hint">
              <Icon name="arrowRight" size={14} /> Drag the slider to compare
            </p>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <SectionHeading
            eyebrow="Learn"
            title="Practical guides, not lectures."
            subtitle="Written for Indian streets, Indian law and Indian summers."
            action={
              <Link to="/learn" className="btn btn-ghost btn-sm">
                Browse all guides <Icon name="arrowRight" size={15} />
              </Link>
            }
          />
          <div className="article-grid">
            {ARTICLES.slice(0, 3).map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="cta-band-copy">
            <p className="eyebrow">Weekend volunteering</p>
            <h2>Two hours on a Saturday. A full stomach for a street dog.</h2>
            <p>
              Join a feeding drive, help at a sterilisation camp, or ride along on a night rescue. Training and
              equipment are provided — you just bring the willingness.
            </p>
            <div className="cta-band-actions">
              <Link className="btn btn-accent" to="/get-involved">
                Register for a drive <Icon name="arrowRight" size={16} />
              </Link>
              <span className="cta-next">
                <Icon name="calendar" size={16} /> Next drive: {nextDriveDate} · {nextDrive.city}
              </span>
            </div>
          </div>
          <div className="cta-band-stats">
            <div>
              <strong>{ORG_CITIES.length}</strong>
              <span>cities in the directory</span>
            </div>
            <div>
              <strong>{MISCONCEPTIONS.length}</strong>
              <span>myths busted</span>
            </div>
            <div>
              <strong>24×7</strong>
              <span>emergency helplines</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
