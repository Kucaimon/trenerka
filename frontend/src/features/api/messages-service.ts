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

const GROUP_THREAD_ID = '0'

export function isGroupThread(clientId: string): boolean {
  return clientId === GROUP_THREAD_ID || clientId === 'group'
}

export async function getMessages(clientId: string, options?: { thread?: 'group' }): Promise<Message[]> {
  await apiDelay()
  const group = isGroupThread(clientId) || options?.thread === 'group'
  const threadKey = group ? GROUP_THREAD_ID : clientId
  if (config.useMockData) return mockApi.messages.list(threadKey)
  const params = new URLSearchParams()
  if (group) {
    params.set('thread', 'group')
    params.set('clientId', GROUP_THREAD_ID)
  } else {
    params.set('clientId', clientId)
  }
  return wpFetch<Message[]>(`${wpEndpoints.messages}?${params}`)
}

export async function sendMessage(data: {
  clientId: string
  sender: 'trainer' | 'client'
  text: string
  attachmentUrl?: string
  thread?: 'group'
}): Promise<Message> {
  await apiDelay()
  const group = isGroupThread(data.clientId) || data.thread === 'group'
  const payload = group
    ? { ...data, clientId: GROUP_THREAD_ID, thread: 'group' as const }
    : data
  if (config.useMockData) return mockApi.messages.send(payload)
  return wpFetch<Message>(wpEndpoints.messages, { method: 'POST', body: JSON.stringify(payload) })
}

export async function getUnreadCountsByClient(): Promise<Record<string, number>> {
  if (config.useMockData) {
    const clients = mockApi.clients.list()
    const counts: Record<string, number> = {}
    for (const c of clients) {
      counts[c.id] = mockApi.messages.list(c.id).filter((m) => m.sender === 'client' && !m.read).length
    }
    counts[GROUP_THREAD_ID] = mockApi.messages.list(GROUP_THREAD_ID).filter((m) => m.sender === 'client' && !m.read).length
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
