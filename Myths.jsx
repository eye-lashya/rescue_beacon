import { useState } from 'react'
import { Link } from '../components/TransitionLink'
import { SectionHeading } from '../components/SectionHeading'
import { MythCard } from '../components/MythCard'
import { Icon } from '../components/Icon'
import { MISCONCEPTIONS, MISCONCEPTION_CATEGORIES } from '../data/misconceptions'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PawField } from '../components/PawField'

export default function Myths() {
  useDocumentTitle('Myth vs fact')
  const [category, setCategory] = useState('All')
  const filtered = MISCONCEPTIONS.filter((myth) => category === 'All' || myth.category === category)

  return (
    <>
      <section className="page-hero">
        <PawField variant="dark" />
        <div className="container page-hero-inner">
          <div>
            <p className="eyebrow">Myth vs fact</p>
            <h1>Twelve things people get wrong about street animals.</h1>
            <p className="page-hero-lead">
              Misconceptions get animals hurt. These cards replace common myths with what the law, veterinary science
              and lived experience actually say. Tap any card to flip it.
            </p>
          </div>
          <div className="page-hero-badge">
            <Icon name="spark" size={26} />
            <strong>{MISCONCEPTIONS.length} myths</strong>
            <span>Backed by law &amp; evidence</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Filter"
            title="Browse by theme."
            subtitle="Behaviour, feeding, health, law and community — or flip through all of them."
            action={<span className="result-count">{filtered.length} cards</span>}
          />

          <div className="chip-row" role="group" aria-label="Filter myths by category">
            {['All', ...MISCONCEPTION_CATEGORIES].map((item) => (
              <button
                type="button"
                key={item}
                className={`chip ${category === item ? 'is-active' : ''}`}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="myth-grid">
            {filtered.map((myth) => (
              <MythCard myth={myth} key={myth.id} />
            ))}
          </div>

          <div className="notice notice-info myth-note">
            <Icon name="info" size={20} />
            <p>
              Myths are not harmless opinions. False beliefs about strays drive harassment, illegal relocation and
              violence. Share a card when you hear one repeated — calmly and with the source.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container cta-band cta-band-compact">
          <div className="cta-band-copy">
            <p className="eyebrow">Turn understanding into action</p>
            <h2>Now you know better. Help someone else understand too.</h2>
            <p>
              Volunteer at a feeding drive, report cruelty with evidence, or simply keep a water bowl full this
              summer. Small, consistent actions change streets.
            </p>
            <div className="cta-band-actions">
              <Link className="btn btn-accent" to="/get-involved">
                Join a drive <Icon name="arrowRight" size={16} />
              </Link>
              <Link className="btn btn-ghost" to="/learn">
                Read the guides <Icon name="book" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
