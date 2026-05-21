import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { getClientProfileIdFromStore } from '@/features/api/client-id'
import { mockApi } from '@/lib/mock-api/store'
import { emptyClientDashboard } from '@/lib/empty-client-dashboard'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type {
  ClientAttachment,
  ClientDashboard,
  ClientWorkoutDay,
  Payment,
  ProgressMeasurement,
} from '@/types'

export interface ClientSelfProfile {
  clientProfileId: string
  name: string
  email: string
  phone: string
  avatarUrl?: string
}

function resolveClientId(): string | null {
  const id = getClientProfileIdFromStore()
  if (id) return id
  if (config.useMockData) return 'c1'
  return null
}

export async function getClientDashboard(): Promise<ClientDashboard> {
  await apiDelay()
  if (config.useMockData) {
    const clientId = resolveClientId()
    if (!clientId) return emptyClientDashboard
    return mockApi.client.dashboard(clientId)
  }
  return wpFetch<ClientDashboard>(wpEndpoints.client.dashboard)
}

export async function getClientWorkouts(): Promise<ClientWorkoutDay[]> {
  await apiDelay()
  if (config.useMockData) {
    const clientId = resolveClientId()
    if (!clientId) return []
    return mockApi.client.workouts(clientId)
  }
  const res = await wpFetch<{ workouts: ClientWorkoutDay[] }>(wpEndpoints.client.workouts)
  return res.workouts
}

export async function getClientProgress(): Promise<ProgressMeasurement[]> {
  await apiDelay()
  if (config.useMockData) {
    const clientId = resolveClientId()
    if (!clientId) return []
    return mockApi.client.progress(clientId)
  }
  const res = await wpFetch<{ measurements: ProgressMeasurement[] }>(wpEndpoints.client.progress)
  return res.measurements
}

export async function saveClientProgress(data: ProgressMeasurement): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    const clientId = resolveClientId()
    if (!clientId) throw new Error('Client profile is not linked')
    mockApi.client.saveProgress({ ...data, clientId: data.clientId ?? clientId })
    return
  }
  const { date, weight, bodyFat, waist, hips, chest, arms, legs, notes, photos } = data
  await wpFetch(wpEndpoints.client.progress, {
    method: 'POST',
    body: JSON.stringify({ date, weight, bodyFat, waist, hips, chest, arms, legs, notes, photos }),
  })
}

export async function completeClientWorkout(workoutId: string): Promise<void> {
  if (config.useMockData) {
    mockApi.client.completeWorkout(workoutId)
    return
  }
  await wpFetch(`/trenerka/v1/client/workouts/${workoutId}/complete`, { method: 'POST' })
}

export async function getClientProfile(): Promise<ClientSelfProfile> {
  await apiDelay()
  if (config.useMockData) {
    const clientId = resolveClientId()
    const client = mockApi.clients.list().find((c) => c.id === clientId)
    return {
      clientProfileId: clientId ?? 'c1',
      name: client?.name ?? 'Клиент',
      email: client?.email ?? '',
      phone: client?.phone ?? '',
    }
  }
  return wpFetch<ClientSelfProfile>(wpEndpoints.client.profile)
}

export async function updateClientProfile(data: {
  name?: string
  phone?: string
  avatarUrl?: string
}): Promise<ClientSelfProfile> {
  await apiDelay(300)
  if (config.useMockData) {
    const clientId = resolveClientId()
    if (clientId) {
      mockApi.clients.update(clientId, { name: data.name, phone: data.phone })
    }
    return getClientProfile()
  }
  return wpFetch<ClientSelfProfile>(wpEndpoints.client.profile, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function getClientAttachments(): Promise<ClientAttachment[]> {
  await apiDelay()
  const clientId = resolveClientId()
  if (config.useMockData) {
    if (!clientId) return []
    return mockApi.attachments.list(clientId)
  }
  return wpFetch<ClientAttachment[]>(wpEndpoints.client.attachments)
}

export async function getClientPayments(): Promise<Payment[]> {
  await apiDelay()
  if (config.useMockData) {
    const clientId = resolveClientId()
    if (!clientId) return []
    return mockApi.client.payments(clientId)
  }
  return wpFetch<Payment[]>(wpEndpoints.payments)
}
