import { useEffect } from 'react'
import { config } from '@/lib/config'
import { fetchCurrentUser } from '@/features/api/auth-service'
import { useAuthStore } from '@/store/auth-store'

/** В WP-режиме подтягивает /auth/me при наличии сохранённого токена. */
export function AuthHydrator() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (config.useMockData || !token || user) return
    let cancelled = false
    ;(async () => {
      const me = await fetchCurrentUser()
      if (cancelled) return
      if (me) login(me, token)
      else logout()
    })()
    return () => {
      cancelled = true
    }
  }, [token, user, login, logout])

  return null
}
