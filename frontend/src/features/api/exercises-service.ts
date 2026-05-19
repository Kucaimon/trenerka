import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { Exercise } from '@/types'
import type { ExerciseListParams, ExerciseListResult } from './exercise-list'
import { paginateExercises } from './exercise-list'

function buildQuery(params: ExerciseListParams): string {
  const q = new URLSearchParams()
  if (params.search) q.set('search', params.search)
  if (params.muscle) q.set('muscle', params.muscle)
  if (params.equipment) q.set('equipment', params.equipment)
  if (params.difficulty) q.set('difficulty', params.difficulty)
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  const s = q.toString()
  return s ? `?${s}` : ''
}

export async function listExercises(params: ExerciseListParams = {}): Promise<ExerciseListResult> {
  await apiDelay()
  if (config.useMockData) return mockApi.exercises.list(params)
  return wpFetch<ExerciseListResult>(`${wpEndpoints.exercises}${buildQuery(params)}`)
}

/** Full catalog (e.g. workout builder). */
export async function getExercises(): Promise<Exercise[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.exercises.listAll()
  const all = await wpFetch<Exercise[]>(wpEndpoints.exercises)
  return all
}

export async function getExercise(id: string): Promise<Exercise | undefined> {
  await apiDelay()
  if (config.useMockData) return mockApi.exercises.get(id)
  return wpFetch<Exercise>(`${wpEndpoints.exercises}/${id}`)
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

/** Client-side i18n-aware search + pagination over a pre-filtered set. */
export function applyExerciseListFilters(
  items: Exercise[],
  params: ExerciseListParams,
  matchSearch?: (exercise: Exercise) => boolean,
): ExerciseListResult {
  let filtered = items
  if (params.muscle) filtered = filtered.filter((e) => e.muscleGroup === params.muscle)
  if (params.equipment) filtered = filtered.filter((e) => e.equipment === params.equipment)
  if (params.difficulty) filtered = filtered.filter((e) => e.difficulty === params.difficulty)
  if (params.search?.trim() && matchSearch) {
    filtered = filtered.filter(matchSearch)
  } else if (params.search?.trim()) {
    const q = params.search.trim().toLowerCase()
    filtered = filtered.filter(
      (e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q),
    )
  }
  const limit = params.limit ?? 20
  const page = params.page ?? 1
  return paginateExercises(filtered, page, limit)
}
