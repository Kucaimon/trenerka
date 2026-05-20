import type { Client } from '@/types'

/** Pass-through helper; mock/API data should supply CRM fields. */
export function enrichClient(client: Client): Client {
  return { ...client }
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
