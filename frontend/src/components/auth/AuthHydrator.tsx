import { useEffect } from 'react'
import { config } from '@/lib/config'
import { fetchCurrentUser, fetchTrainerProfile } from '@/features/api/auth-service'
import { useAuthStore } from '@/store/auth-store'

/** В WP-режиме подтягивает /auth/me при наличии сохранённого токена. */
export function AuthHydrator() {
  const token = useAuthStore((s) => s.token)
  const login = useAuthStore((s) => s.login)
  const setTrainerProfile = useAuthStore((s) => s.setTrainerProfile)
  const setSessionChecking = useAuthStore((s) => s.setSessionChecking)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (config.useMockData || !token) {
      setSessionChecking(false)
      return
    }
    let cancelled = false
    setSessionChecking(true)
    ;(async () => {
      try {
        const me = await fetchCurrentUser()
        if (cancelled) return
        if (!me) {
          logout()
          return
        }
        const trainerProfile = me.role === 'trainer' ? await fetchTrainerProfile().catch(() => null) : null
        if (cancelled) return
        const current = useAuthStore.getState()
        if (!current.user || current.user.id !== me.id) {
          login(me, token, trainerProfile)
          return
        }
        if (me.role === 'trainer') {
          setTrainerProfile(
            trainerProfile && trainerProfile.userId === me.id ? trainerProfile : null,
          )
        }
      } finally {
        if (!cancelled) setSessionChecking(false)
      }
    })()
    return () => {
      cancelled = true
      setSessionChecking(false)
    }
  }, [token, login, logout, setTrainerProfile, setSessionChecking])

  return null
}
