import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { getClientProfileIdFromStore } from '@/features/api/client-id'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type {
  ClientDashboard,
  ClientWorkoutDay,
  Payment,
  ProgressMeasurement,
} from '@/types'

function mockClientId(): string {
  return getClientProfileIdFromStore() || 'c1'
}

export async function getClientDashboard(): Promise<ClientDashboard> {
  await apiDelay()
  if (config.useMockData) return mockApi.client.dashboard(mockClientId())
  return wpFetch<ClientDashboard>(wpEndpoints.client.dashboard)
}

export async function getClientWorkouts(): Promise<ClientWorkoutDay[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.client.workouts(mockClientId())
  const res = await wpFetch<{ workouts: ClientWorkoutDay[] }>(wpEndpoints.client.workouts)
  return res.workouts
}

export async function getClientProgress(): Promise<ProgressMeasurement[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.client.progress(mockClientId())
  const res = await wpFetch<{ measurements: ProgressMeasurement[] }>(wpEndpoints.client.progress)
  return res.measurements
}

export async function saveClientProgress(data: ProgressMeasurement): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.client.saveProgress({ ...data, clientId: data.clientId ?? mockClientId() })
    return
  }
  const { clientId: _omit, ...body } = data
  await wpFetch(wpEndpoints.client.progress, { method: 'POST', body: JSON.stringify(body) })
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
  if (config.useMockData) return mockApi.client.payments(mockClientId())
  return wpFetch<Payment[]>(wpEndpoints.payments)
}
