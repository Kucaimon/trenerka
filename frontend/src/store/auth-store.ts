import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'
import { setAuthToken } from '@/lib/wordpress/client'

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  isRole: (role: UserRole) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => {
        setAuthToken(token)
        set({ user, token })
      },
      logout: () => {
        setAuthToken(null)
        set({ user: null, token: null })
        localStorage.removeItem('trenerka-auth')
      },
      isRole: (role) => get().user?.role === role,
    }),
    {
      name: 'trenerka-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthToken(state.token)
      },
    },
  ),
)
