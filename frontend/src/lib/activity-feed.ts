import type { Notification, Payment } from '@/types'

export type ActivityFeedType = 'payment' | 'message' | 'notification'

export type ActivityFeedItem = {
  id: string
  type: ActivityFeedType
  title: string
  body: string
  createdAt: string
}

export function buildTrainerActivityFeed(
  notifications: Notification[],
  payments: Payment[],
  limit = 14,
): ActivityFeedItem[] {
  const fromNotifications: ActivityFeedItem[] = notifications.map((n) => ({
    id: `n-${n.id}`,
    type: n.title.toLowerCase().includes('оплат') ? 'payment' : 'notification',
    title: n.title,
    body: n.body,
    createdAt: n.createdAt,
  }))

  const fromPayments: ActivityFeedItem[] = payments.slice(0, 8).map((p) => ({
    id: `p-${p.id}`,
    type: 'payment' as const,
    title: 'Оплата',
    body: `${p.amount} ₽ · ${p.method ?? ''}`.trim(),
    createdAt: `${p.date}T12:00:00.000Z`,
  }))

  return [...fromNotifications, ...fromPayments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
}
