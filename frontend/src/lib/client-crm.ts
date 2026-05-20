import type { Client, PaymentState } from '@/types'

const PAYMENT_CYCLE: PaymentState[] = ['paid', 'pending', 'overdue']

export function enrichClient(client: Client): Client {
  const idx = parseInt(client.id.replace(/\D/g, '') || '0', 10)
  return {
    ...client,
    paymentState: client.paymentState ?? PAYMENT_CYCLE[idx % 3],
    lastActivityMinutesAgo: client.lastActivityMinutesAgo ?? (idx + 1) * 37,
    workoutCompletionPct: client.workoutCompletionPct ?? Math.min(95, 55 + (idx * 7) % 40),
    sessionsThisWeek: client.sessionsThisWeek ?? (client.status === 'active' ? (idx % 3) + 1 : 0),
    upcomingSessionAt:
      client.upcomingSessionAt ??
      (client.status !== 'archive'
        ? new Date(Date.now() + (idx + 1) * 86400000).toISOString()
        : undefined),
  }
}

export function formatRelativeActivity(
  minutes: number,
  t: (key: string, opts?: Record<string, unknown>) => string,
): string {
  if (minutes < 60) return t('clients.activity.minutesAgo', { count: minutes })
  if (minutes < 1440) return t('clients.activity.hoursAgo', { count: Math.floor(minutes / 60) })
  return t('clients.activity.daysAgo', { count: Math.floor(minutes / 1440) })
}

export function formatUpcomingSession(iso: string | undefined, locale: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
