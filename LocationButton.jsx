import { useLocation } from '../context/LocationContext'
import { Icon } from './Icon'

export function LocationButton({ label = 'Use my location', compact = false }) {
  const location = useLocation()
  const granted = location.status === 'granted' && location.coords

  return (
    <div className={`location-control ${compact ? 'is-compact' : ''}`}>
      <button
        type="button"
        className={`btn ${granted ? 'btn-soft' : 'btn-primary'} btn-sm`}
        onClick={location.request}
        disabled={location.status === 'loading'}
      >
        {location.status === 'loading' ? (
          <>
            <span className="spinner spinner-tiny" /> Locating…
          </>
        ) : (
          <>
            <Icon name="pin" size={16} />
            {granted ? 'Update location' : label}
          </>
        )}
      </button>

      {granted ? (
        <span className="location-status is-ok">
          <Icon name="check" size={14} />
          {location.label || `${location.coords.lat.toFixed(3)}, ${location.coords.lng.toFixed(3)}`}
          {location.accuracy ? <span className="muted"> · ±{location.accuracy} m</span> : null}
        </span>
      ) : null}

      {location.error ? (
        <span className="location-status is-error" role="alert">
          <Icon name="info" size={14} /> {location.error}
        </span>
      ) : null}
    </div>
  )
}
