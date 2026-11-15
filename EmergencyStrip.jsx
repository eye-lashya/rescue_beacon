import { Link } from './TransitionLink'
import { QUICK_DIAL } from '../data/site'
import { Icon } from './Icon'

const LINES = [
  { key: 'emergency', number: QUICK_DIAL.emergency, label: 'All emergencies', icon: 'siren' },
  { key: 'ambulance', number: QUICK_DIAL.ambulance, label: 'Ambulance', icon: 'ambulance' },
  { key: 'fire', number: QUICK_DIAL.fire, label: 'Fire', icon: 'flame' },
  { key: 'police', number: QUICK_DIAL.police, label: 'Police', icon: 'shield' },
]

export function EmergencyStrip({ title = 'In an emergency, call first.' }) {
  return (
    <section className="emergency-strip" aria-label="Emergency numbers">
      <div className="container emergency-strip-inner">
        <div className="emergency-strip-text">
          <span className="emergency-pulse" aria-hidden="true" />
          <div>
            <strong>{title}</strong>
            <p>Toll-free, 24×7, works across India. Report cruelty or get an injured animal to care.</p>
          </div>
        </div>
        <div className="emergency-lines">
          {LINES.map((line) => (
            <a className="emergency-line" href={`tel:${line.number}`} key={line.key}>
              <Icon name={line.icon} size={18} />
              <span>
                <strong>{line.number}</strong>
                <small>{line.label}</small>
              </span>
            </a>
          ))}
        </div>
        <Link to="/emergency" className="emergency-strip-link">
          All helplines <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </section>
  )
}
