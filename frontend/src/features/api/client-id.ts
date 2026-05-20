import { config } from '@/lib/config'
import { useAuthStore } from '@/store/auth-store'
import { useClientDashboard } from '@/features/api/hooks'

const MOCK_CLIENT_BY_USER: Record<string, string> = {
  cl1: 'c1',
}

/** Resolves trenerka client_profiles id for API calls (messages query param, mock store). */
export function resolveClientProfileId(
  user: { id: string; clientProfileId?: string } | null | undefined,
  dashboardClientId?: string,
): string {
  if (dashboardClientId) return dashboardClientId
  if (user?.clientProfileId) return user.clientProfileId
  if (config.useMockData && user?.id && MOCK_CLIENT_BY_USER[user.id]) {
    return MOCK_CLIENT_BY_USER[user.id]
  }
  return ''
}

export function getClientProfileIdFromStore(): string {
  const user = useAuthStore.getState().user
  return resolveClientProfileId(user)
}

export function useClientProfileId(): string {
  const user = useAuthStore((s) => s.user)
  const { data: dashboard } = useClientDashboard()
  return resolveClientProfileId(user, dashboard?.clientProfileId)
}
