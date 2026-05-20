/** Relative ISO timestamps for production-like mock data */
export function isoOffsetDays(days: number, hour = 10, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export function isoOffsetHours(hours: number): string {
  return new Date(Date.now() + hours * 3600000).toISOString()
}

export function dateOnlyOffsetDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function currentMonthPrefix(): string {
  return new Date().toISOString().slice(0, 7)
}
