import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    onChange()
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Trainer / CRM mobile layout (< 768px) */
export function useIsMobile(breakpoint = '(max-width: 767px)') {
  return useMediaQuery(breakpoint)
}

/** Tablet and below — hide desktop sidebar */
export function useIsTrainerMobile() {
  return useMediaQuery('(max-width: 1023px)')
}
