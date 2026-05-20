import type { CalendarEvent, Message, Payment } from '@/types'

export type ClientActivityItem = {
  id: string
  type: 'workout' | 'message' | 'payment'
  at: string
}

export function buildClientRecentActivity(
  clientId: string,
  events: CalendarEvent[] = [],
  messages: Message[] = [],
  payments: Payment[] = [],
): ClientActivityItem[] {
  const items: ClientActivityItem[] = []
  for (const e of events.filter((ev) => ev.clientId === clientId)) {
    items.push({ id: `e-${e.id}`, type: 'workout', at: e.start })
  }
  for (const m of messages.filter((msg) => msg.clientId === clientId)) {
    items.push({ id: `m-${m.id}`, type: 'message', at: m.createdAt })
  }
  for (const p of payments.filter((pay) => pay.clientId === clientId)) {
    items.push({ id: `p-${p.id}`, type: 'payment', at: `${p.date}T12:00:00.000Z` })
  }
  return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5)
}
