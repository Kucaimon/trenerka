import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { RevenueReportPoint, TrainerAnalytics } from '@/types'

export async function getTrainerAnalytics(): Promise<TrainerAnalytics> {
  await apiDelay()
  if (config.useMockData) return mockApi.analytics.trainer()
  return wpFetch<TrainerAnalytics>(wpEndpoints.analytics.trainer)
}

export async function getRevenueChart(): Promise<RevenueReportPoint[]> {
  await apiDelay()
  return mockApi.analytics.revenue()
}

export async function getRetentionChart() {
  return mockApi.analytics.retention()
}

export async function getAttendanceChart() {
  return mockApi.analytics.attendance()
}

export async function getWeekdayActivityChart() {
  await apiDelay()
  return mockApi.analytics.weekday()
}

export async function getSubscriptionMixChart() {
  await apiDelay()
  return mockApi.analytics.subscriptions()
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
