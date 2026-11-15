import { Link } from '../components/TransitionLink'
import { BeforeAfterSlider } from '../components/BeforeAfterSlider'
import { SectionHeading } from '../components/SectionHeading'
import { Icon } from '../components/Icon'
import { TRANSFORMATIONS } from '../data/transformations'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PawField } from '../components/PawField'

export default function Stories() {
  useDocumentTitle('Before & after')

  return (
    <>
      <section className="page-hero">
        <PawField variant="dark" />
        <div className="container page-hero-inner">
          <div>
            <p className="eyebrow">Before &amp; after</p>
            <h1>The difference a rescue makes.</h1>
            <p className="page-hero-lead">
              {TRANSFORMATIONS.length} animals, {TRANSFORMATIONS.length} ordinary acts of intervention. Drag each
              slider to see what happened when someone stopped, called, and did not look away.
            </p>
          </div>
          <div className="page-hero-badge">
            <Icon name="heart" size={26} />
            <strong>{TRANSFORMATIONS.length} stories</strong>
            <span>Every one started with a call</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Real outcomes, illustrative art"
            title="From crisis to recovery."
            subtitle="The artwork below is illustrated. Replace it with real, consent-cleared photographs from your shelter to tell your own cases."
            action={
              <Link to="/report" className="btn btn-ghost btn-sm">
                Report an animal <Icon name="arrowRight" size={15} />
              </Link>
            }
          />

          <div className="story-grid">
            {TRANSFORMATIONS.map((story, index) => (
              <article className="story-card card" key={story.id}>
                <BeforeAfterSlider before={story.before} after={story.after} name={story.name} />
                <div className="story-body">
                  <div className="story-head">
                    <div>
                      <h3>{story.name}</h3>
                      <p className="story-sub">
                        {story.species} · {story.location}
                      </p>
                    </div>
                    <span className="story-index">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="story-period">
                    <Icon name="clock" size={13} /> {story.period}
                  </p>
                  <p>{story.story}</p>
                  <div className="tag-row">
                    {story.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container cta-band cta-band-compact">
          <div className="cta-band-copy">
            <p className="eyebrow">The next story</p>
            <h2>It starts with someone noticing.</h2>
            <p>
              If you see an animal in distress, do not wait for someone else. A photo, a location and a report is
              often all it takes to begin a recovery.
            </p>
            <div className="cta-band-actions">
              <Link className="btn btn-accent" to="/report">
                <Icon name="camera" size={17} /> Report an animal
              </Link>
              <Link className="btn btn-ghost" to="/get-involved">
                Volunteer for rescues <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
