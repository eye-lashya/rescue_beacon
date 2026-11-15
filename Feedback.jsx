import { Icon } from './Icon'

export function Spinner({ label = 'Loading' }) {
  return (
    <span className="spinner" role="status" aria-label={label}>
      <span className="spinner-ring" />
    </span>
  )
}

export function ErrorNotice({ error, onRetry, title = 'We could not load this' }) {
  if (!error) return null
  return (
    <div className="notice notice-error" role="alert">
      <Icon name="alert" size={22} />
      <div>
        <strong>{title}</strong>
        <p>{error.message || String(error)}</p>
        {onRetry ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
            <Icon name="refresh" size={16} /> Try again
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function EmptyState({ icon = 'search', title, children }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={26} />
      </span>
      <h3>{title}</h3>
      {children ? <div className="empty-body">{children}</div> : null}
    </div>
  )
}

export function SkeletonCards({ count = 3, height = 190 }) {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" style={{ minHeight: height }} key={index}>
          <span className="skeleton-line w-40" />
          <span className="skeleton-line w-80" />
          <span className="skeleton-line w-60" />
          <span className="skeleton-line w-30" />
        </div>
      ))}
    </div>
  )
}
