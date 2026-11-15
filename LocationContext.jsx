import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const LocationContext = createContext(null)

const GEO_ERRORS = {
  1: 'Location permission was denied. You can type a landmark or pick a city instead.',
  2: 'Your location is unavailable right now. Try again or pick a city.',
  3: 'Finding your location timed out. Try again or pick a city.',
}

async function reverseGeocode(lat, lng) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 6000)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&lat=${lat}&lon=${lng}`,
      { headers: { Accept: 'application/json' }, signal: controller.signal },
    )
    clearTimeout(timer)
    if (!response.ok) return null
    const data = await response.json()
    const address = data.address || {}
    const parts = [
      address.suburb || address.neighbourhood || address.residential,
      address.city || address.town || address.village || address.county,
      address.state,
    ].filter(Boolean)
    if (parts.length) return parts.slice(0, 2).join(', ')
    if (data.display_name) return data.display_name.split(',').slice(0, 2).join(', ')
    return null
  } catch {
    return null
  }
}

export function LocationProvider({ children }) {
  const [state, setState] = useState({ status: 'idle', coords: null, label: null, error: null, accuracy: null })

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unavailable', coords: null, label: null, error: 'Location is not supported by this browser.', accuracy: null })
      return
    }

    setState((current) => ({ ...current, status: 'loading', error: null }))
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
        setState({
          status: 'granted',
          coords,
          label: null,
          error: null,
          accuracy: Math.round(position.coords.accuracy || 0),
        })
        const label = await reverseGeocode(coords.lat, coords.lng)
        if (label) setState((current) => (current.coords === coords ? { ...current, label } : current))
      },
      (error) => {
        setState({
          status: error.code === 1 ? 'denied' : 'unavailable',
          coords: null,
          label: null,
          error: GEO_ERRORS[error.code] || 'Could not get your location.',
          accuracy: null,
        })
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 },
    )
  }, [])

  const reset = useCallback(() => setState({ status: 'idle', coords: null, label: null, error: null, accuracy: null }), [])

  const value = useMemo(() => ({ ...state, request, reset }), [state, request, reset])
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) throw new Error('useLocation must be used inside LocationProvider')
  return context
}
