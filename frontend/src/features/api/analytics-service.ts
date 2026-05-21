import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { Payment, RevenueReportPoint, TrainerAnalytics } from '@/types'

export type AttendanceChartPoint = { week: string; sessions: number }
export type WeekdayChartPoint = { day: string; sessions: number }
export type RetentionChartPoint = { month: string; rate: number }
export type SubscriptionChartPoint = { name: string; value: number; color?: string }

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

export async function getRetentionChart(): Promise<RetentionChartPoint[]> {
  if (config.useMockData) return mockApi.analytics.retention()
  return wpFetch<RetentionChartPoint[]>(wpEndpoints.analytics.retention)
}

export async function getAttendanceChart(): Promise<AttendanceChartPoint[]> {
  if (config.useMockData) return mockApi.analytics.attendance()
  return wpFetch<AttendanceChartPoint[]>(wpEndpoints.analytics.attendance)
}

export async function getWeekdayActivityChart(): Promise<WeekdayChartPoint[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.analytics.weekday()
  return wpFetch<WeekdayChartPoint[]>(wpEndpoints.analytics.weekday)
}

export async function getSubscriptionMixChart(): Promise<SubscriptionChartPoint[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.analytics.subscriptions()
  return wpFetch<SubscriptionChartPoint[]>(wpEndpoints.analytics.subscriptions)
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

export async function downloadAnalyticsSummaryExport(): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    const blob = new Blob(['Mock analytics summary'], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'analytics-summary.txt'
    a.click()
    return
  }
  const res = await wpFetch<{ filename: string; content: string; mime: string }>(
    wpEndpoints.analytics.summaryExport,
  )
  const bytes = atob(res.content)
  const blob = new Blob([bytes], { type: res.mime })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = res.filename
  a.click()
}
