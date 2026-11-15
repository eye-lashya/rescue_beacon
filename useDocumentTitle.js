import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · Rescue Beacon` : 'Rescue Beacon — Animal Cruelty Reporting & Medical Support'
    return () => {
      document.title = previous
    }
  }, [title])
}
