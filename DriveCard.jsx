import { Icon } from './Icon'

const TYPE_ICONS = { feeding: 'bowl', rescue: 'siren', camp: 'stethoscope', awareness: 'book' }

export function DriveCard({ drive, onRegister, selected = false }) {
  const date = new Date(`${drive.date}T00:00:00`)
  const day = new Intl.DateTimeFormat('en-IN', { day: '2-digit' }).format(date)
  const month = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date)
  const spotsLeft = drive.spotsLeft ?? Math.max(0, drive.spots - drive.filled)
  const full = drive.full ?? spotsLeft === 0
  const progress = Math.min(100, Math.round((drive.filled / drive.spots) * 100))

  return (
    <article className={`drive-card card ${selected ? 'is-selected' : ''}`}>
      <div className="drive-date" aria-hidden="true">
        <span className="drive-day">{day}</span>
        <span className="drive-month">{month}</span>
      </div>

      <div className="drive-main">
        <div className="drive-topline">
          <span className={`badge badge-${drive.type || 'soft'}`}>
            <Icon name={TYPE_ICONS[drive.type] || 'calendar'} size={13} /> {drive.typeLabel || drive.type}
          </span>
          <span className="meta-line">
            <Icon name="pin" size={13} /> {drive.city}
          </span>
        </div>
        <h3>{drive.title}</h3>
        <p className="drive-meta">
          <span>
            <Icon name="clock" size={14} /> {drive.time}
          </span>
          <span>
            <Icon name="map" size={14} /> {drive.venue}
          </span>
        </p>
        <p className="drive-description">{drive.description}</p>

        <div className="drive-footer">
          <div className="spots">
            <div className="spots-label">
              <span>{full ? 'Drive full' : `${spotsLeft} of ${drive.spots} spots left`}</span>
              <span className="muted">{drive.filled} registered</span>
            </div>
            <div className="progress" role="img" aria-label={`${drive.filled} of ${drive.spots} spots filled`}>
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button
            type="button"
            className={`btn ${full ? 'btn-ghost' : selected ? 'btn-soft' : 'btn-accent'} btn-sm`}
            onClick={() => onRegister?.(drive)}
            disabled={full}
          >
            {full ? 'Full — register as general volunteer' : selected ? 'Selected below' : 'Register'}
            {!full ? <Icon name="arrowRight" size={15} /> : null}
          </button>
        </div>
      </div>
    </article>
  )
}
