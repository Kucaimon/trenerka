import type { Exercise } from '@/types'
import type { ExerciseListParams, ExerciseListResult } from '@/features/api/exercise-list'
import { paginateExercises } from '@/features/api/exercise-list'

export function filterExercises(items: Exercise[], params: ExerciseListParams): Exercise[] {
  let result = items

  if (params.muscle) {
    result = result.filter((e) => e.muscleGroup === params.muscle)
  }
  if (params.equipment) {
    result = result.filter((e) => e.equipment === params.equipment)
  }
  if (params.difficulty) {
    result = result.filter((e) => e.difficulty === params.difficulty)
  }
  if (params.search?.trim()) {
    const q = params.search.trim().toLowerCase()
    result = result.filter(
      (e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q),
    )
  }

  return result
}

export function listExercisesFrom(items: Exercise[], params: ExerciseListParams = {}): ExerciseListResult {
  const filtered = filterExercises(items, params)
  const limit = params.limit ?? 20
  const page = params.page ?? 1
  return paginateExercises(filtered, page, limit)
}
