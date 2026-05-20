import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isTrainerProfileComplete } from '@/lib/auth/profile-complete'
import { setAuthToken } from '@/lib/wordpress/client'
import type { TrainerProfile, User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  trainerProfile: TrainerProfile | null
  /** WP /auth/me validation in progress after reload */
  sessionChecking: boolean
  login: (user: User, token: string, trainerProfile?: TrainerProfile | null) => void
  setTrainerProfile: (profile: TrainerProfile | null) => void
  setSessionChecking: (checking: boolean) => void
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
      sessionChecking: false,
      login: (user, token, trainerProfile = null) => {
        setAuthToken(token)
        const profile =
          user.role === 'trainer' && trainerProfile?.userId === user.id ? trainerProfile : null
        set({
          user,
          token,
          trainerProfile: user.role === 'trainer' ? profile : null,
        })
      },
      setTrainerProfile: (profile) => set({ trainerProfile: profile }),
      setSessionChecking: (sessionChecking) => set({ sessionChecking }),
      logout: () => {
        setAuthToken(null)
        set({ user: null, token: null, trainerProfile: null, sessionChecking: false })
        void useAuthStore.persist.clearStorage()
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
