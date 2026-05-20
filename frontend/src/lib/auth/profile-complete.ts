import type { TrainerProfile } from '@/types'

export function isTrainerProfileComplete(profile: TrainerProfile | null | undefined): boolean {
  if (!profile) return false
  return (
    profile.fullName.trim().length >= 2 &&
    profile.specialization.trim().length >= 2 &&
    profile.experience.trim().length >= 1 &&
    profile.phone.trim().length >= 5
  )
}
