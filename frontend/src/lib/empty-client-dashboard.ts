import type { ClientDashboard } from '@/types'

export const emptyClientDashboard: ClientDashboard = {
  profile: { name: '', trainer: '', packageBalance: 0 },
  currentProgram: '',
  nextSession: null,
  streakDays: 0,
  notifications: [],
}
