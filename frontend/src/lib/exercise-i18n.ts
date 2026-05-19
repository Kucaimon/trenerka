import type { TFunction } from 'i18next'
import type { Exercise } from '@/types'

export const MUSCLE_KEYS: Record<string, string> = {
  Грудь: 'chest',
  Спина: 'back',
  Ноги: 'legs',
  Плечи: 'shoulders',
  Руки: 'arms',
  Кор: 'core',
  Кардио: 'cardio',
}

export const EQUIPMENT_KEYS: Record<string, string> = {
  Штанга: 'barbell',
  Гантели: 'dumbbells',
  Тренажёр: 'machine',
  'Собственный вес': 'bodyweight',
  Кабель: 'cable',
  Резина: 'band',
}

export function translateMuscle(muscleGroup: string, t: TFunction<'trainer'>): string {
  const key = MUSCLE_KEYS[muscleGroup]
  return key ? t(`catalog.muscles.${key}`) : muscleGroup
}

export function translateEquipment(equipment: string, t: TFunction<'trainer'>): string {
  const key = EQUIPMENT_KEYS[equipment]
  return key ? t(`catalog.equipment.${key}`) : equipment
}

export function translateExerciseField(
  exerciseId: string,
  field: 'name' | 'description' | 'technique' | 'breathingTip' | 'level',
  fallback: string | undefined,
  t: TFunction<'trainer'>,
): string {
  if (!fallback) return ''
  const key = `catalog.exercises.${exerciseId}.${field}`
  const translated = t(key, { defaultValue: '' })
  return translated || fallback
}

export function translateExerciseSteps(exercise: Exercise, t: TFunction<'trainer'>): string[] {
  const key = `catalog.exercises.${exercise.id}.steps`
  const fromLocale = t(key, { returnObjects: true, defaultValue: [] as string[] })
  if (Array.isArray(fromLocale) && fromLocale.length > 0) return fromLocale as string[]
  if (exercise.steps?.length) return exercise.steps
  if (exercise.technique) return [exercise.technique]
  if (exercise.description) return [exercise.description]
  return []
}

export function displayExercise(exercise: Exercise, t: TFunction<'trainer'>) {
  return {
    name: translateExerciseField(exercise.id, 'name', exercise.name, t),
    muscleGroup: translateMuscle(exercise.muscleGroup, t),
    equipment: translateEquipment(exercise.equipment, t),
    description: translateExerciseField(exercise.id, 'description', exercise.description, t),
    technique: translateExerciseField(exercise.id, 'technique', exercise.technique, t),
    breathingTip: translateExerciseField(exercise.id, 'breathingTip', exercise.breathingTip, t),
    level: translateExerciseField(exercise.id, 'level', exercise.level, t),
    steps: translateExerciseSteps(exercise, t),
  }
}
