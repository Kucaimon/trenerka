import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type {
  Achievement,
  ClientDashboard,
  ClientWorkoutDay,
  MealPlan,
  Payment,
  ProgressMeasurement,
} from '@/types'

const MOCK_CLIENT_ID = 'c1'

export async function getClientDashboard(): Promise<ClientDashboard> {
  await apiDelay()
  if (config.useMockData) return mockApi.client.dashboard(MOCK_CLIENT_ID)
  return wpFetch<ClientDashboard>(wpEndpoints.client.dashboard)
}

export async function getClientWorkouts(): Promise<ClientWorkoutDay[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.client.workouts(MOCK_CLIENT_ID)
  const res = await wpFetch<{ workouts: ClientWorkoutDay[] }>(wpEndpoints.client.workouts)
  return res.workouts
}

export async function getClientProgress(): Promise<ProgressMeasurement[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.client.progress(MOCK_CLIENT_ID)
  const res = await wpFetch<{ measurements: ProgressMeasurement[] }>(wpEndpoints.client.progress)
  return res.measurements
}

export async function saveClientProgress(data: ProgressMeasurement): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.client.saveProgress(data)
    return
  }
  await wpFetch(wpEndpoints.client.progress, { method: 'POST', body: JSON.stringify(data) })
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
  if (config.useMockData) return mockApi.client.payments(MOCK_CLIENT_ID)
  return wpFetch<Payment[]>(wpEndpoints.payments)
}

export async function getAchievements(): Promise<Achievement[]> {
  await apiDelay()
  return mockApi.achievements()
}

export async function getMealPlan(): Promise<MealPlan[]> {
  await apiDelay()
  return mockApi.mealPlan()
}
