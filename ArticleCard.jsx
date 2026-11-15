import { Link } from './TransitionLink'
import { Icon } from './Icon'

export function ArticleCard({ article, featured = false }) {
  return (
    <article className={`article-card card ${featured ? 'is-featured' : ''}`}>
      <Link to={`/learn/${article.slug}`} className="article-cover-link" tabIndex={-1} aria-hidden="true">
        <img src={article.cover} alt="" loading="lazy" className="article-cover" />
      </Link>
      <div className="article-body">
        <div className="article-meta">
          <span className="badge badge-soft">{article.category}</span>
          <span className="meta-line">
            <Icon name="clock" size={13} /> {article.readTime} min read
          </span>
        </div>
        <h3>
          <Link to={`/learn/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
        <Link className="text-link" to={`/learn/${article.slug}`}>
          Read the guide <Icon name="arrowRight" size={15} />
        </Link>
      </div>
    </article>
  )
}
