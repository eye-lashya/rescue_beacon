import { useLayoutEffect } from 'react'

const REVEAL_SELECTOR = [
  '.hero-copy',
  '.hero-art',
  '.page-hero-inner > *',
  '.article-hero',
  '.article-layout > *',
  '.section-heading',
  '.quick-card',
  '.myth-card-slot',
  '.article-card',
  '.org-card',
  '.story-card',
  '.step-card',
  '.help-card',
  '.stat-card',
  '.drive-list',
  '.notice',
  '.cta-band',
  '.split-feature > *',
  '.directory-controls',
  '.directory-cta',
  '.form-section',
  '.success-card',
  '.admin-login',
  '.admin-heading',
  '.admin-tabs',
  '.case-card',
  '.empty-state',
  '[data-reveal]',
].join(',')

/**
 * Adds a subtle, staggered scroll reveal to the main content. The effect is
 * skipped entirely for people who prefer reduced motion, and it degrades to
 * fully visible content when IntersectionObserver is unavailable.
 */
export function useScrollReveal(pathname) {
  useLayoutEffect(() => {
    const main = document.getElementById('main-content')
    if (!main || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const seen = new WeakSet()
    const groups = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    const reveal = (element) => {
      if (seen.has(element) || !(element instanceof HTMLElement)) return
      seen.add(element)
      element.classList.add('reveal')
      const parent = element.parentElement
      const index = groups.get(parent) || 0
      groups.set(parent, index + 1)
      element.style.setProperty('--reveal-delay', `${Math.min(index, 6) * 65}ms`)

      // Elements that are already in view are shown immediately. This keeps
      // the first screen fully usable even if the observer callback is delayed.
      const rect = element.getBoundingClientRect()
      if (rect.top < window.innerHeight - 40 && rect.bottom > 40) {
        element.classList.add('is-visible')
        return
      }

      observer.observe(element)
    }

    const scan = (root) => {
      if (root.matches(REVEAL_SELECTOR)) reveal(root)
      root.querySelectorAll(REVEAL_SELECTOR).forEach(reveal)
    }

    document.documentElement.classList.add('reveal-ready')
    scan(main)

    // Cards loaded from the API (directory, drives, admin) arrive after the
    // first render, so keep watching for new content as it appears.
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) scan(node)
        })
      })
    })
    mutations.observe(main, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
      document.documentElement.classList.remove('reveal-ready')
    }
  }, [pathname])
}
