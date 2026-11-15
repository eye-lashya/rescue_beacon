import { useCallback } from 'react'
import { flushSync } from 'react-dom'
import { Link as RouterLink, NavLink as RouterNavLink, useNavigate } from 'react-router-dom'

function shouldSkipTransition(event, { target, download, to }) {
  if (event.defaultPrevented) return true
  if (event.button !== 0) return true
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return true
  if (target && target !== '_self') return true
  if (download != null) return true
  if (typeof to === 'string' && /^(?:[a-z]+:|\/\/)/i.test(to)) return true
  if (typeof document.startViewTransition !== 'function') return true
  if (document.visibilityState !== 'visible' || !document.hasFocus()) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useTransitionClick(onClick, props) {
  const navigate = useNavigate()

  return useCallback(
    (event) => {
      onClick?.(event)
      if (shouldSkipTransition(event, props)) return

      event.preventDefault()

      let committed = false
      let fallback
      const commit = () => {
        if (committed) return
        committed = true
        window.clearTimeout(fallback)
        flushSync(() => {
          navigate(props.to, {
            replace: props.replace,
            state: props.state,
            preventScrollReset: props.preventScrollReset,
            relative: props.relative,
          })
        })
      }

      try {
        const transition = document.startViewTransition(commit)
        // If the browser never invokes the callback (background tab or a
        // skipped transition), make sure the navigation still happens.
        fallback = window.setTimeout(commit, 300)
        transition.finished.finally(() => commit()).catch(() => {})
      } catch {
        commit()
      }
    },
    [navigate, onClick, props],
  )
}

function withTransition(Base) {
  return function TransitionLink({ onClick, ...props }) {
    const handleClick = useTransitionClick(onClick, props)
    return <Base {...props} onClick={handleClick} />
  }
}

export const Link = withTransition(RouterLink)
export const NavLink = withTransition(RouterNavLink)
