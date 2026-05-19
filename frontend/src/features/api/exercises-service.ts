import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { Exercise } from '@/types'

export async function getExercises(): Promise<Exercise[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.exercises.list()
  return wpFetch<Exercise[]>(wpEndpoints.exercises)
}

export async function createExercise(data: Omit<Exercise, 'id'>): Promise<Exercise> {
  await apiDelay()
  if (config.useMockData) return mockApi.exercises.create(data)
  return wpFetch<Exercise>(wpEndpoints.exercises, { method: 'POST', body: JSON.stringify(data) })
}

export async function updateExercise(id: string, data: Partial<Exercise>): Promise<Exercise | undefined> {
  await apiDelay()
  if (config.useMockData) return mockApi.exercises.update(id, data)
  return wpFetch<Exercise>(`${wpEndpoints.exercises}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteExercise(id: string): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.exercises.remove(id)
    return
  }
  await wpFetch(`${wpEndpoints.exercises}/${id}`, { method: 'DELETE' })
}
