import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { Payment, RevenueReportPoint, TrainerAnalytics } from '@/types'

export async function getTrainerAnalytics(): Promise<TrainerAnalytics> {
  await apiDelay()
  if (config.useMockData) return mockApi.analytics.trainer()
  return wpFetch<TrainerAnalytics>(wpEndpoints.analytics.trainer)
}

export async function getRevenueChart(): Promise<RevenueReportPoint[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.analytics.revenue()
  const payments = await wpFetch<Payment[]>(wpEndpoints.payments)
  const byMonth = new Map<string, { revenue: number; clients: Set<string> }>()
  for (const p of payments) {
    const month = p.date.slice(0, 7)
    const entry = byMonth.get(month) ?? { revenue: 0, clients: new Set<string>() }
    entry.revenue += p.amount
    entry.clients.add(p.clientId)
    byMonth.set(month, entry)
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, v]) => ({
      month,
      revenue: v.revenue,
      clients: v.clients.size,
    }))
}

export async function getRetentionChart() {
  if (config.useMockData) return mockApi.analytics.retention()
  return []
}

export async function getAttendanceChart() {
  if (config.useMockData) return mockApi.analytics.attendance()
  return []
}

export async function getWeekdayActivityChart() {
  await apiDelay()
  if (config.useMockData) return mockApi.analytics.weekday()
  return []
}

export async function getSubscriptionMixChart() {
  await apiDelay()
  if (config.useMockData) return mockApi.analytics.subscriptions()
  return []
}

export async function downloadClientProgressPdf(clientId: string): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    const blob = new Blob(['Mock PDF report'], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `progress-${clientId}.txt`
    a.click()
    return
  }
  const res = await wpFetch<{ filename: string; content: string; mime: string }>(
    wpEndpoints.analytics.clientPdf(clientId),
  )
  const bytes = atob(res.content)
  const blob = new Blob([bytes], { type: res.mime })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = res.filename
  a.click()
}
