import { useEffect } from 'react'
import { config } from '@/lib/config'
import { fetchCurrentUser, fetchTrainerProfile } from '@/features/api/auth-service'
import { useAuthStore } from '@/store/auth-store'

/** В WP-режиме подтягивает /auth/me при наличии сохранённого токена. */
export function AuthHydrator() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const setTrainerProfile = useAuthStore((s) => s.setTrainerProfile)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (config.useMockData || !token || user) return
    let cancelled = false
    ;(async () => {
      const me = await fetchCurrentUser()
      if (cancelled) return
      if (!me) {
        logout()
        return
      }
      const trainerProfile = me.role === 'trainer' ? await fetchTrainerProfile().catch(() => null) : null
      if (cancelled) return
      login(me, token, trainerProfile)
      if (trainerProfile) setTrainerProfile(trainerProfile)
    })()
    return () => {
      cancelled = true
    }
  }, [token, user, login, logout, setTrainerProfile])

  return null
}
