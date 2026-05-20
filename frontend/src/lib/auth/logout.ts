import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole } from '@/types'

export function getLoginPath(role?: UserRole | null): string {
  if (role === 'client') return '/login/client'
  if (role === 'admin') return '/login/admin'
  return '/login/trainer'
}

/** Clears auth store, WP token, and persisted session. */
export function performLogout(): void {
  useAuthStore.getState().logout()
}

export function useLogout(fallbackRole: UserRole = 'trainer') {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  return useCallback(() => {
    const role = user?.role ?? fallbackRole
    performLogout()
    navigate(getLoginPath(role), { replace: true })
  }, [navigate, user?.role, fallbackRole])
}
