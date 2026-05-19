import type { Exercise } from '@/types'

export const EXERCISE_PAGE_SIZE = 20

export type ExerciseListParams = {
  search?: string
  muscle?: string
  equipment?: string
  difficulty?: Exercise['difficulty']
  page?: number
  limit?: number
}

export type ExerciseListResult = {
  items: Exercise[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function paginateExercises(items: Exercise[], page: number, limit: number): ExerciseListResult {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * limit
  return {
    items: items.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    totalPages,
  }
}
