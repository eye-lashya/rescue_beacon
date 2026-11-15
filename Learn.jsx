import { useState } from 'react'
import { Link } from '../components/TransitionLink'
import { ArticleCard } from '../components/ArticleCard'
import { SectionHeading } from '../components/SectionHeading'
import { Icon } from '../components/Icon'
import { ARTICLES, ARTICLE_CATEGORIES } from '../data/articles'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PawField } from '../components/PawField'

export default function Learn() {
  useDocumentTitle('Learn')
  const [category, setCategory] = useState('All')
  const featured = ARTICLES.filter((article) => article.featured)

  const filtered = ARTICLES.filter((article) => category === 'All' || article.category === category)

  return (
    <>
      <section className="page-hero">
        <PawField variant="dark" />
        <div className="container page-hero-inner">
          <div>
            <p className="eyebrow">Learn</p>
            <h1>What actually helps an animal — in India.</h1>
            <p className="page-hero-lead">
              Clear, practical guides on animal law, vaccination, street safety, summer water and everyday pet care.
              Written for real streets, real budgets and real Indian summers.
            </p>
          </div>
          <div className="page-hero-badge">
            <Icon name="book" size={26} />
            <strong>{ARTICLES.length} guides</strong>
            <span>Free to read &amp; share</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Start with these"
            title="The essentials."
            subtitle="Three guides that cover the situations people ask about most."
          />
          <div className="featured-grid">
            {featured.map((article) => (
              <ArticleCard article={article} featured key={article.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container learn-hubs">
          <Link className="learn-hub learn-hub-care" to="/care">
            <span className="learn-hub-icon">
              <Icon name="paw" size={24} />
            </span>
            <div>
              <p className="eyebrow">Care library</p>
              <h2>Breeds, species and seasonal care.</h2>
              <p>26 practical guides for dogs, cats, birds, reptiles, small companions and farm animals.</p>
            </div>
            <span className="text-link">
              Explore care <Icon name="arrowRight" size={15} />
            </span>
          </Link>
          <Link className="learn-hub learn-hub-threats" to="/threats">
            <span className="learn-hub-icon">
              <Icon name="shield" size={24} />
            </span>
            <div>
              <p className="eyebrow">What harms animals</p>
              <h2>The dangers — and how to prevent them.</h2>
              <p>Traffic, plastic, heat, fireworks, poison, cruelty and illegal wildlife trade.</p>
            </div>
            <span className="text-link">
              See threats <Icon name="arrowRight" size={15} />
            </span>
          </Link>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <SectionHeading
            eyebrow="All guides"
            title="Browse by topic."
            subtitle="Every guide is written to be acted on today, not filed away."
            action={
              <span className="result-count">
                {filtered.length} of {ARTICLES.length}
              </span>
            }
          />

          <div className="chip-row" role="group" aria-label="Filter guides by topic">
            {['All', ...ARTICLE_CATEGORIES].map((item) => (
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

          <div className="article-grid">
            {filtered.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band cta-band-compact">
          <div className="cta-band-copy">
            <p className="eyebrow">From reading to doing</p>
            <h2>Know what to do? Report it.</h2>
            <p>
              A report with a photo and location is the fastest way to get an animal help. It takes about two minutes.
            </p>
            <div className="cta-band-actions">
              <Link className="btn btn-accent" to="/report">
                <Icon name="camera" size={17} /> Report an animal
              </Link>
              <Link className="btn btn-ghost" to="/get-involved">
                Volunteer instead <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
