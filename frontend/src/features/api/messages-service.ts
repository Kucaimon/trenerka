import i18n from '@/i18n'
import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch, getAuthToken } from '@/lib/wordpress/client'
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
  await wpFetch(wpEndpoints.messages, { method: 'POST', body: JSON.stringify(data) })
  return {
    id: `tmp-${Date.now()}`,
    clientId: data.clientId,
    sender: data.sender,
    text: data.text,
    createdAt: new Date().toISOString(),
    read: false,
    attachmentUrl: data.attachmentUrl,
  }
}

export async function markMessageRead(id: string): Promise<void> {
  if (config.useMockData) {
    mockApi.messages.markRead(id)
    return
  }
  await wpFetch(`${wpEndpoints.messages}/${id}/read`, { method: 'POST' })
}

export async function uploadAttachment(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(i18n.t('trainer:messages.errors.fileTooLarge'))
  }
  if (config.useMockData) {
    await apiDelay(500)
    return URL.createObjectURL(file)
  }
  const form = new FormData()
  form.append('file', file)
  const token = getAuthToken()
  const res = await fetch(`${import.meta.env.VITE_WP_API_URL ?? ''}${wpEndpoints.upload}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  if (!res.ok) throw new Error(i18n.t('trainer:messages.errors.uploadFailed'))
  const data = (await res.json()) as { url: string }
  return data.url
}
