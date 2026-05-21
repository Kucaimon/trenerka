import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { getLoginPath as roleLoginPath, readIntendedRole } from '@/lib/auth/role-session'
import type { UserRole } from '@/types'

export function getLoginPath(role?: UserRole | null): string {
  return roleLoginPath(role ?? readIntendedRole() ?? 'trainer')
}

/** Clears auth store, WP token, role hint, and persisted session. */
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
