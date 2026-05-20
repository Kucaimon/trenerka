export const SHARE_LANDING_BASE = 'https://trenerka-fit.ru'
export const SHARE_APP_BASE = 'https://app.trenerka-fit.ru'

import type { Program } from '@/types'

export type ProgramShareInput = {
  programName: string
  exerciseCount: number
  estimatedMinutes: number
  dayLabel?: string
  weeks?: number
}

export function programShareFromProgram(program: Program, dayLabel?: string): ProgramShareInput {
  const workouts = program.workouts ?? []
  const exerciseCount = workouts.reduce((sum, w) => sum + (w.exercises?.length ?? 0), 0)
  const firstDay = workouts[0]?.dayLabel

  return {
    programName: program.name,
    exerciseCount,
    estimatedMinutes: estimateWorkoutMinutes(exerciseCount),
    dayLabel: dayLabel ?? firstDay,
    weeks: program.weeks,
  }
}

export function estimateWorkoutMinutes(exerciseCount: number): number {
  return exerciseCount > 0 ? exerciseCount * 9 + 12 : 0
}

export function buildProgramShareUrl(base: 'landing' | 'app' = 'landing'): string {
  const url = new URL(base === 'landing' ? SHARE_LANDING_BASE : SHARE_APP_BASE)
  url.searchParams.set('utm_source', 'vk')
  url.searchParams.set('utm_medium', 'trainer_share')
  return url.toString()
}

export function buildVkShareUrl(shareUrl: string, title: string, description: string): string {
  const params = new URLSearchParams({
    url: shareUrl,
    title,
    description,
  })
  return `https://vk.com/share.php?${params.toString()}`
}

export function openVkShare(shareUrl: string, title: string, description: string): void {
  window.open(buildVkShareUrl(shareUrl, title, description), '_blank', 'noopener,noreferrer')
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export async function nativeShare(payload: { title: string; text: string; url: string }): Promise<void> {
  if (!canUseNativeShare()) return
  await navigator.share(payload)
}
