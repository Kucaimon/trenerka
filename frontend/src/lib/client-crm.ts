import type { Client, OnboardingState } from '@/types'

/** Derive display course %: manual field or program completion. */
export function effectiveCourseProgress(client: Client): number | undefined {
  if (client.courseProgressPct != null && client.courseProgressPct > 0) {
    return client.courseProgressPct
  }
  return client.workoutCompletionPct
}

export function needsOnboardingBadge(state?: OnboardingState): boolean {
  return Boolean(state && ['invited', 'registered', 'profile_pending', 'program_pending'].includes(state))
}

/** Pass-through + normalized progress for CRM lists. */
export function enrichClient(client: Client): Client {
  const courseProgressPct = effectiveCourseProgress(client)
  return {
    ...client,
    courseProgressPct: courseProgressPct ?? client.courseProgressPct,
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
