import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { CalendarEvent } from '@/types'

export async function getEvents(): Promise<CalendarEvent[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.events.list()
  return wpFetch<CalendarEvent[]>(wpEndpoints.events)
}

export async function saveEvent(event: CalendarEvent): Promise<CalendarEvent> {
  await apiDelay(100)
  if (config.useMockData) return mockApi.events.save(event)
  const method = event.id && !event.id.startsWith('e-new') ? 'PUT' : 'POST'
  const path = method === 'PUT' ? `${wpEndpoints.events}/${event.id}` : wpEndpoints.events
  return wpFetch<CalendarEvent>(path, { method, body: JSON.stringify(event) })
}

export async function deleteEvent(id: string): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.events.remove(id)
    return
  }
  await wpFetch(`${wpEndpoints.events}/${id}`, { method: 'DELETE' })
}

export async function completeEvent(id: string): Promise<CalendarEvent | undefined> {
  const events = await getEvents()
  const event = events.find((e) => e.id === id)
  if (!event) return undefined
  return saveEvent({ ...event, status: 'completed' })
}

export async function copyRecurringEvent(id: string): Promise<CalendarEvent | undefined> {
  const events = await getEvents()
  const source = events.find((e) => e.id === id)
  if (!source) return undefined
  const start = new Date(source.start)
  const end = new Date(source.end)
  start.setDate(start.getDate() + 7)
  end.setDate(end.getDate() + 7)
  return saveEvent({
    ...source,
    id: `e-new-${Date.now()}`,
    start: start.toISOString(),
    end: end.toISOString(),
  })
}
