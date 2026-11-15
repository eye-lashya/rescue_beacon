import { useParams } from 'react-router-dom'
import { Link } from '../components/TransitionLink'
import { Icon } from '../components/Icon'
import { ArticleCard } from '../components/ArticleCard'
import { ARTICLES, getArticle } from '../data/articles'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PawField } from '../components/PawField'
import { formatDate } from '../lib/format'

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2>{block.text}</h2>
    case 'h3':
      return <h3>{block.text}</h3>
    case 'p':
      return <p>{block.text}</p>
    case 'ul':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )
    case 'tip':
      return (
        <aside className="prose-tip">
          <Icon name="spark" size={20} />
          <div>
            <strong>{block.title}</strong>
            <p>{block.text}</p>
          </div>
        </aside>
      )
    case 'warning':
      return (
        <aside className="prose-warning">
          <Icon name="alert" size={20} />
          <div>
            <strong>{block.title}</strong>
            <p>{block.text}</p>
          </div>
        </aside>
      )
    case 'quote':
      return (
        <blockquote>
          “{block.text}”
          {block.cite ? <cite>{block.cite}</cite> : null}
        </blockquote>
      )
    default:
      return null
  }
}

export default function ArticleDetail() {
  const { slug } = useParams()
  const article = getArticle(slug)
  useDocumentTitle(article ? article.title : 'Guide not found')

  if (!article) {
    return (
      <section className="section">
        <div className="container narrow">
          <h1>Guide not found</h1>
          <p className="muted">That article may have moved.</p>
          <Link className="btn btn-primary" to="/learn">
            Browse all guides
          </Link>
        </div>
      </section>
    )
  }

  const related = ARTICLES.filter((item) => item.slug !== article.slug).slice(0, 2)

  return (
    <article className="article-page">
      <header className="article-hero">
        <PawField variant="dark" />
        <div className="container">
          <Link className="back-link" to="/learn">
            <Icon name="arrowRight" size={15} className="flip-x" /> All guides
          </Link>
          <div className="article-hero-meta">
            <span className="badge badge-soft">{article.category}</span>
            <span className="meta-line">
              <Icon name="clock" size={14} /> {article.readTime} min read
            </span>
            <span className="meta-line">{formatDate(article.date)}</span>
          </div>
          <h1>{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>
          <img className="article-hero-cover" src={article.cover} alt="" />
        </div>
      </header>

      <div className="container article-layout">
        <div className="prose">
          {article.blocks.map((block, index) => (
            <Block block={block} key={`${block.type}-${index}`} />
          ))}

          <div className="article-footnote">
            <Icon name="info" size={16} />
            <p>
              This guide is general information, not veterinary or legal advice. For a specific animal or case,
              consult a veterinarian or a lawyer. Laws and schedules change — verify the current text before relying
              on it in a complaint.
            </p>
          </div>
        </div>

        <aside className="article-aside">
          <div className="aside-card card">
            <h3>Need help now?</h3>
            <p>If an animal is in danger, call the national emergency line first.</p>
            <a className="btn btn-primary btn-block" href="tel:112">
              <Icon name="phone" size={16} /> Call 112
            </a>
            <Link className="btn btn-ghost btn-block" to="/report">
              <Icon name="camera" size={16} /> File a report
            </Link>
            <Link className="btn btn-ghost btn-block" to="/directory">
              <Icon name="pin" size={16} /> Find nearby care
            </Link>
          </div>

          <div className="aside-card card aside-tip">
            <h3>Share this guide</h3>
            <p>
              Send it to your building WhatsApp group or neighbourhood association. Most animal suffering is
              prevented by ordinary people knowing what to do.
            </p>
            <button
              type="button"
              className="btn btn-soft btn-block"
              onClick={async () => {
                const url = window.location.href
                try {
                  if (navigator.share) await navigator.share({ title: article.title, url })
                  else {
                    await navigator.clipboard.writeText(url)
                    window.alert('Link copied to clipboard.')
                  }
                } catch {
                  /* user cancelled */
                }
              }}
            >
              <Icon name="copy" size={16} /> Share the link
            </button>
          </div>
        </aside>
      </div>

      <section className="section section-tinted">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading-text">
              <p className="eyebrow">Keep reading</p>
              <h2>Related guides</h2>
            </div>
          </div>
          <div className="article-grid">
            {related.map((item) => (
              <ArticleCard article={item} key={item.slug} />
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
