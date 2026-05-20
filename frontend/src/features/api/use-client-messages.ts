import { useAuthStore } from '@/store/auth-store'
import { useClientProfileId } from '@/features/api/client-id'
import { useMessages } from '@/features/api/hooks'

/** Client cabinet messages (server scopes thread for client role). */
export function useClientMessages() {
  const clientId = useClientProfileId()
  const isClient = useAuthStore((s) => s.user?.role) === 'client'
  return useMessages(clientId, { enabled: isClient })
}
