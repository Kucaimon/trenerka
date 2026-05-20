export type ClientActivityItem = {
  id: string
  type: 'workout' | 'message' | 'payment'
  at: string
}

const MOCK_BY_CLIENT: Record<string, ClientActivityItem[]> = {
  c1: [
    { id: 'a1', type: 'workout', at: new Date(Date.now() - 12 * 60000).toISOString() },
    { id: 'a2', type: 'message', at: new Date(Date.now() - 90 * 60000).toISOString() },
    { id: 'a3', type: 'payment', at: new Date(Date.now() - 86400000).toISOString() },
  ],
}

export function getClientRecentActivity(clientId: string): ClientActivityItem[] {
  return MOCK_BY_CLIENT[clientId] ?? [
    { id: 'd1', type: 'workout', at: new Date(Date.now() - 180 * 60000).toISOString() },
    { id: 'd2', type: 'message', at: new Date(Date.now() - 360 * 60000).toISOString() },
  ]
}
