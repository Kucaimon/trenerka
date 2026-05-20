import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'

/** True after zustand persist rehydration from localStorage. */
export function useAuthStorageReady(): boolean {
  const [ready, setReady] = useState(() => useAuthStore.persist.hasHydrated())

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) return
    return useAuthStore.persist.onFinishHydration(() => setReady(true))
  }, [])

  return ready
}
