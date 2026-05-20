import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { getClientProfileIdFromStore } from '@/features/api/client-id'
import { mockApi } from '@/lib/mock-api/store'
import { emptyClientDashboard } from '@/lib/empty-client-dashboard'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type {
  ClientDashboard,
  ClientWorkoutDay,
  Payment,
  ProgressMeasurement,
} from '@/types'

function resolveClientId(): string | null {
  const id = getClientProfileIdFromStore()
  if (id) return id
  if (config.useMockData) return 'c1'
  return null
}

export async function getClientDashboard(): Promise<ClientDashboard> {
  await apiDelay()
  const clientId = resolveClientId()
  if (!clientId) return emptyClientDashboard
  if (config.useMockData) return mockApi.client.dashboard(clientId)
  return wpFetch<ClientDashboard>(wpEndpoints.client.dashboard)
}

export async function getClientWorkouts(): Promise<ClientWorkoutDay[]> {
  await apiDelay()
  const clientId = resolveClientId()
  if (!clientId) return []
  if (config.useMockData) return mockApi.client.workouts(clientId)
  const res = await wpFetch<{ workouts: ClientWorkoutDay[] }>(wpEndpoints.client.workouts)
  return res.workouts
}

export async function getClientProgress(): Promise<ProgressMeasurement[]> {
  await apiDelay()
  const clientId = resolveClientId()
  if (!clientId) return []
  if (config.useMockData) return mockApi.client.progress(clientId)
  const res = await wpFetch<{ measurements: ProgressMeasurement[] }>(wpEndpoints.client.progress)
  return res.measurements
}

export async function saveClientProgress(data: ProgressMeasurement): Promise<void> {
  await apiDelay()
  const clientId = resolveClientId()
  if (!clientId) throw new Error('Client profile is not linked')
  if (config.useMockData) {
    mockApi.client.saveProgress({ ...data, clientId: data.clientId ?? clientId })
    return
  }
  const { date, weight, bodyFat, waist } = data
  await wpFetch(wpEndpoints.client.progress, {
    method: 'POST',
    body: JSON.stringify({ date, weight, bodyFat, waist }),
  })
}

export async function completeClientWorkout(workoutId: string): Promise<void> {
  if (config.useMockData) {
    mockApi.client.completeWorkout(workoutId)
    return
  }
  await wpFetch(`/trenerka/v1/client/workouts/${workoutId}/complete`, { method: 'POST' })
}

export async function getClientPayments(): Promise<Payment[]> {
  await apiDelay()
  const clientId = resolveClientId()
  if (!clientId) return []
  if (config.useMockData) return mockApi.client.payments(clientId)
  return wpFetch<Payment[]>(wpEndpoints.payments)
}
