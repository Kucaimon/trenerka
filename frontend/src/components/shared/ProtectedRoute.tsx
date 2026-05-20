import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole } from '@/types'

export function ProtectedRoute({ children, role }: { children: ReactNode; role: UserRole }) {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  if (!user || !token) {
    const loginPath =
      role === 'trainer' ? '/login/trainer' : role === 'client' ? '/login/client' : '/login/admin'
    return <Navigate to={loginPath} replace />
  }
  if (user.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}
