import { useEffect, useState } from 'react'

/** Stable clock for relative timestamps (avoids Date.now() during render). */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])

  return now
}

export function minutesAgoFromIso(iso: string, now: number): number {
  return Math.max(1, Math.floor((now - new Date(iso).getTime()) / 60000))
}
