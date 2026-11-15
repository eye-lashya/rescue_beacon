import { Link } from '../components/TransitionLink'
import { Icon } from '../components/Icon'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PawField } from '../components/PawField'

export default function NotFound() {
  useDocumentTitle('Page not found')

  return (
    <section className="section not-found">
      <PawField variant="dark" />
      <div className="container narrow not-found-inner">
        <span className="not-found-code">404</span>
        <h1>This page wandered off.</h1>
        <p className="muted">
          The link may be broken or the page may have moved. The animals are still here — here are the places that
          matter most.
        </p>
        <div className="not-found-links">
          <Link className="btn btn-primary" to="/">
            <Icon name="home" size={16} /> Back home
          </Link>
          <Link className="btn btn-ghost" to="/report">
            <Icon name="camera" size={16} /> Report an animal
          </Link>
          <Link className="btn btn-ghost" to="/emergency">
            <Icon name="siren" size={16} /> Emergency help
          </Link>
        </div>
      </div>
    </section>
  )
}
