import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { useScrollReveal } from './lib/useScrollReveal'
import Home from './pages/Home'
import Emergency from './pages/Emergency'
import Report from './pages/Report'
import Directory from './pages/Directory'
import Learn from './pages/Learn'
import ArticleDetail from './pages/ArticleDetail'
import Care from './pages/Care'
import Threats from './pages/Threats'
import Myths from './pages/Myths'
import Stories from './pages/Stories'
import GetInvolved from './pages/GetInvolved'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  useScrollReveal(pathname)

  useLayoutEffect(() => {
    if (typeof document.startViewTransition !== 'function') return
    document.documentElement.classList.add('has-view-transitions')
    return () => document.documentElement.classList.remove('has-view-transitions')
  }, [])

  // Forward clicks animate from TransitionLink. Browser Back/Forward fires
  // `popstate`, which React Router handles on the bubble phase — so a
  // capture-phase listener can snapshot the old page, then let React commit
  // the new one before the new snapshot is taken.
  useEffect(() => {
    if (typeof document.startViewTransition !== 'function') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onPopState = () => {
      if (document.visibilityState !== 'visible') return

      const settle = () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        })

      try {
        // Calling this while a previous transition is still running is safe:
        // the browser skips the old animation and starts the new one, so
        // rapid Back/Forward presses always animate the latest page.
        document.startViewTransition(settle)
      } catch {
        // Browsers without a usable implementation fall back to `route-in`.
      }
    }

    window.addEventListener('popstate', onPopState, true)
    return () => window.removeEventListener('popstate', onPopState, true)
  }, [])

  return (
    <ErrorBoundary>
      <ScrollToTop />
      {!isAdmin ? (
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
      ) : null}
      {!isAdmin ? <Navbar /> : null}

      <main id="main-content">
        <div className="route-view" key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/report" element={<Report />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:slug" element={<ArticleDetail />} />
            <Route path="/care" element={<Care />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/myths" element={<Myths />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      {!isAdmin ? <Footer /> : null}
    </ErrorBoundary>
  )
}
