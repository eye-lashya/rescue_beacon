import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link, NavLink } from './TransitionLink'
import { SITE } from '../data/site'
import { Icon } from './Icon'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/emergency', label: 'Emergency' },
  { to: '/report', label: 'Report' },
  { to: '/directory', label: 'Directory' },
  { to: '/care', label: 'Care' },
  { to: '/learn', label: 'Learn' },
  { to: '/myths', label: 'Myths' },
  { to: '/threats', label: 'Threats' },
  { to: '/stories', label: 'Stories' },
  { to: '/get-involved', label: 'Get involved' },
]

function BrandMark() {
  return <img className="brand-mark" src="/logo.png" alt="" width="48" height="48" decoding="async" />
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container navbar">
        <Link to="/" className="brand">
          <BrandMark />
          <span className="brand-text">
            <strong>{SITE.name}</strong>
            <small>Animal cruelty reporting &amp; support</small>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? 'x' : 'menu'} size={22} />
        </button>

        <nav id="primary-navigation" className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Primary">
          <div className="nav-group nav-group-left">
            {LINKS.slice(0, 5).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="nav-group nav-group-right">
            {LINKS.slice(5).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
            <a className="nav-call" href="tel:112">
              <span className="nav-call-dot" aria-hidden="true" />
              <Icon name="phone" size={16} /> 112 <span className="nav-call-word">emergency</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
