import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isTrainerProfileComplete } from '@/lib/auth/profile-complete'
import { setAuthToken } from '@/lib/wordpress/client'
import type { TrainerProfile, User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  trainerProfile: TrainerProfile | null
  login: (user: User, token: string, trainerProfile?: TrainerProfile | null) => void
  setTrainerProfile: (profile: TrainerProfile | null) => void
  logout: () => void
  isRole: (role: UserRole) => boolean
  isTrainerProfileComplete: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      trainerProfile: null,
      login: (user, token, trainerProfile = null) => {
        setAuthToken(token)
        set({
          user,
          token,
          trainerProfile: user.role === 'trainer' ? trainerProfile : null,
        })
      },
      setTrainerProfile: (profile) => set({ trainerProfile: profile }),
      logout: () => {
        setAuthToken(null)
        set({ user: null, token: null, trainerProfile: null })
        localStorage.removeItem('trenerka-auth')
      },
      isRole: (role) => get().user?.role === role,
      isTrainerProfileComplete: () => isTrainerProfileComplete(get().trainerProfile),
    }),
    {
      name: 'trenerka-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        trainerProfile: state.trainerProfile,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthToken(state.token)
      },
    },
  ),
)
