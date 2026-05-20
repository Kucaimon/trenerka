import i18n from '@/i18n'
import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { fileToDataUrl } from '@/lib/mock-api/users'
import { uploadMedia } from '@/lib/wordpress/upload'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { Message } from '@/types'

export function getMessageTemplates(): string[] {
  return [
    i18n.t('trainer:messages.templates.workoutReminder', { time: '10:00' }),
    i18n.t('trainer:messages.templates.greatSession'),
    i18n.t('trainer:messages.templates.hydration'),
    i18n.t('trainer:messages.templates.programUpdated'),
  ]
}

export const messageTemplates: string[] = new Proxy([] as string[], {
  get(_target, prop) {
    const templates = getMessageTemplates()
    const value = Reflect.get(templates, prop, templates)
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(templates) : value
  },
})

export async function getMessages(clientId: string): Promise<Message[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.messages.list(clientId)
  return wpFetch<Message[]>(`${wpEndpoints.messages}?clientId=${clientId}`)
}

export async function sendMessage(data: {
  clientId: string
  sender: 'trainer' | 'client'
  text: string
  attachmentUrl?: string
}): Promise<Message> {
  await apiDelay()
  if (config.useMockData) return mockApi.messages.send(data)
  return wpFetch<Message>(wpEndpoints.messages, { method: 'POST', body: JSON.stringify(data) })
}

export async function getUnreadCountsByClient(): Promise<Record<string, number>> {
  if (config.useMockData) {
    const clients = mockApi.clients.list()
    const counts: Record<string, number> = {}
    for (const c of clients) {
      counts[c.id] = mockApi.messages.list(c.id).filter((m) => m.sender === 'client' && !m.read).length
    }
    return counts
  }
  return wpFetch<Record<string, number>>(wpEndpoints.messageUnreadCounts)
}

export async function markMessageRead(id: string): Promise<void> {
  if (config.useMockData) {
    mockApi.messages.markRead(id)
    return
  }
  await wpFetch(`${wpEndpoints.messages}/${id}/read`, { method: 'POST' })
}

export async function uploadAttachment(file: File): Promise<string> {
  if (config.useMockData) {
    await apiDelay(500)
    return fileToDataUrl(file)
  }
  return uploadMedia(file)
}
