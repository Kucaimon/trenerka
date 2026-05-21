import type { UserRole } from '@/types'

const ROLE_STORAGE_KEY = 'trenerka-intended-role'
const ENTRY_STORAGE_KEY = 'trenerka-intended-entry'

/** UI entry point before credentials (Edge-style). Smart Fitness uses WP role `trainer`. */
export type LoginEntry = 'client' | 'trainer' | 'smart-fitness' | 'admin'

export function persistIntendedRole(role: UserRole): void {
  try {
    sessionStorage.setItem(ROLE_STORAGE_KEY, role)
  } catch {
    /* private mode / quota */
  }
}

export function persistIntendedEntry(entry: LoginEntry): void {
  try {
    sessionStorage.setItem(ENTRY_STORAGE_KEY, entry)
    if (entry === 'smart-fitness' || entry === 'trainer') {
      sessionStorage.setItem(ROLE_STORAGE_KEY, 'trainer')
    } else {
      sessionStorage.setItem(ROLE_STORAGE_KEY, entry)
    }
  } catch {
    /* private mode / quota */
  }
}

export function readIntendedRole(): UserRole | null {
  try {
    const value = sessionStorage.getItem(ROLE_STORAGE_KEY)
    if (value === 'trainer' || value === 'client' || value === 'admin') return value
  } catch {
    /* ignore */
  }
  return null
}

export function readIntendedEntry(): LoginEntry | null {
  try {
    const value = sessionStorage.getItem(ENTRY_STORAGE_KEY)
    if (
      value === 'trainer' ||
      value === 'client' ||
      value === 'admin' ||
      value === 'smart-fitness'
    ) {
      return value
    }
  } catch {
    /* ignore */
  }
  return null
}

export function clearIntendedRole(): void {
  try {
    sessionStorage.removeItem(ROLE_STORAGE_KEY)
    sessionStorage.removeItem(ENTRY_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function getLoginPathForEntry(entry: LoginEntry): string {
  if (entry === 'client') return '/login/client'
  if (entry === 'admin') return '/login/admin'
  if (entry === 'smart-fitness') return '/login/smart-fitness'
  return '/login/trainer'
}

export function getLoginPath(role: UserRole): string {
  if (role === 'client') return '/login/client'
  if (role === 'admin') return '/login/admin'
  const entry = readIntendedEntry()
  if (entry === 'smart-fitness') return '/login/smart-fitness'
  return '/login/trainer'
}

export function getDashboardPath(role: UserRole): string {
  if (role === 'client') return '/client'
  if (role === 'admin') return '/admin'
  return '/trainer'
}
