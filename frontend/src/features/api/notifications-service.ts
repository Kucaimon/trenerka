import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { Notification } from '@/types'

export async function getNotifications(): Promise<Notification[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.notifications.list()
  return wpFetch<Notification[]>(wpEndpoints.notifications)
}

export async function markNotificationRead(id: string): Promise<void> {
  if (config.useMockData) {
    mockApi.notifications.markRead(id)
    return
  }
  await wpFetch(`${wpEndpoints.notifications}/${id}/read`, { method: 'POST' })
}
