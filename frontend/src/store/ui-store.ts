import { create } from 'zustand'

interface UiState {
  sidebarCollapsed: boolean
  trainerDrawerOpen: boolean
  commandOpen: boolean
  toggleSidebar: () => void
  setTrainerDrawerOpen: (open: boolean) => void
  setCommandOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  trainerDrawerOpen: false,
  commandOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setTrainerDrawerOpen: (trainerDrawerOpen) => set({ trainerDrawerOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
}))
