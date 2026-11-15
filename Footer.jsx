import { Link } from './TransitionLink'
import { SITE } from '../data/site'
import { Icon } from './Icon'

const EXPLORE = [
  { to: '/emergency', label: 'Emergency helplines' },
  { to: '/report', label: 'Report cruelty' },
  { to: '/directory', label: 'Shelters, vets & NGOs' },
  { to: '/care', label: 'Animal care library' },
  { to: '/learn', label: 'Guides & articles' },
  { to: '/threats', label: 'What harms animals' },
  { to: '/myths', label: 'Myth vs fact' },
  { to: '/stories', label: 'Before & after' },
  { to: '/get-involved', label: 'Volunteer with us' },
]

const HELPLINES = [
  { number: '112', label: 'All emergencies' },
  { number: '108', label: 'Ambulance' },
  { number: '101', label: 'Fire services' },
  { number: '100', label: 'Police' },
  { number: '0129-2555700', label: 'AWBI (Mon–Fri)' },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="footer-logo">
            <img className="footer-logo-mark" src="/logo-mark.png" alt="" width="40" height="40" decoding="async" />{' '}
            {SITE.name}
          </span>
          <p>
            A free public resource for India’s street animals and the people who look out for them — report cruelty,
            find care, and learn what actually helps.
          </p>
          <p className="footer-note">
            Built for nationwide use. Emergency numbers are government-operated; directory entries are
            community-maintained and should be verified locally.
          </p>
        </div>

        <div className="footer-col">
          <h2>Explore</h2>
          <ul>
            {EXPLORE.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h2>Emergency</h2>
          <ul className="footer-helplines">
            {HELPLINES.map((line) => (
              <li key={line.number}>
                <a href={`tel:${line.number.replace(/[^+\d]/g, '')}`}>
                  <strong>{line.number}</strong> <span>{line.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="footer-small">
            For animal cruelty complaints, AWBI also accepts grievances at{' '}
            <a href="https://awbi.gov.in" target="_blank" rel="noreferrer">
              awbi.gov.in
            </a>
            .
          </p>
        </div>

        <div className="footer-col">
          <h2>Good to know</h2>
          <ul className="footer-plain">
            <li>Animal cruelty is an offence under the PCA Act, 1960 and BNS, 2023.</li>
            <li>Always wash a bite for 15 minutes and seek rabies PEP the same day.</li>
            <li>In a life-threatening emergency, call 112 before anything else.</li>
          </ul>
          <Link className="footer-admin" to="/admin">
            <Icon name="lock" size={14} /> Coordinator sign-in
          </Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {SITE.year} {SITE.name}. Made with care for animals. No data is sold; report contact details are shared
          only with responders.
        </p>
        <p className="footer-sources">
          Sources: <a href="https://awbi.gov.in" target="_blank" rel="noreferrer">AWBI</a> · PCA Act, 1960 · BNS, 2023 ·
          ABC Rules, 2023
        </p>
      </div>
    </footer>
  )
}
