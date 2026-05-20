import type { ClientWorkoutDay } from '@/types'

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

/** JS weekday → i18n key under common:days (mon…sun). */
export function todayDayKey(): (typeof DAY_KEYS)[number] {
  return DAY_KEYS[new Date().getDay()]
}

export function pickTodayWorkout(workouts: ClientWorkoutDay[], todayLabel: string): ClientWorkoutDay | undefined {
  const byDay = workouts.find((w) => w.day === todayLabel)
  if (byDay) return byDay
  const pending = workouts.find((w) => w.status !== 'done')
  return pending ?? workouts[0]
}

export function weekCompletionPercent(workouts: ClientWorkoutDay[]): number {
  if (!workouts.length) return 0
  const done = workouts.filter((w) => w.status === 'done').length
  return Math.round((done / workouts.length) * 100)
}

export function collectProgressPhotos(measurements: { photos?: string[] }[]): string[] {
  const urls: string[] = []
  for (const m of measurements) {
    for (const url of m.photos ?? []) {
      if (url && !urls.includes(url)) urls.push(url)
    }
  }
  return urls.slice(-6)
}
