import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearIntendedRole,
  getDashboardPath,
  getLoginPath,
  getLoginPathForEntry,
  persistIntendedEntry,
  persistIntendedRole,
  readIntendedEntry,
  readIntendedRole,
} from '@/lib/auth/role-session'

describe('role-session', () => {
  beforeEach(() => {
    sessionStorage.clear()
    clearIntendedRole()
  })

  it('maps roles to login paths', () => {
    expect(getLoginPath('trainer')).toBe('/login/trainer')
    expect(getLoginPath('client')).toBe('/login/client')
    expect(getLoginPath('admin')).toBe('/login/admin')
  })

  it('maps entries to login paths', () => {
    expect(getLoginPathForEntry('trainer')).toBe('/login/trainer')
    expect(getLoginPathForEntry('smart-fitness')).toBe('/login/smart-fitness')
    expect(getLoginPathForEntry('client')).toBe('/login/client')
    expect(getLoginPathForEntry('admin')).toBe('/login/admin')
  })

  it('returns smart-fitness login when that entry was chosen', () => {
    persistIntendedEntry('smart-fitness')
    expect(getLoginPath('trainer')).toBe('/login/smart-fitness')
    expect(readIntendedRole()).toBe('trainer')
    expect(readIntendedEntry()).toBe('smart-fitness')
  })

  it('maps roles to dashboard paths', () => {
    expect(getDashboardPath('trainer')).toBe('/trainer')
    expect(getDashboardPath('client')).toBe('/client')
    expect(getDashboardPath('admin')).toBe('/admin')
  })

  it('persists and clears intended role in sessionStorage', () => {
    persistIntendedRole('client')
    expect(readIntendedRole()).toBe('client')
    clearIntendedRole()
    expect(readIntendedRole()).toBeNull()
    expect(readIntendedEntry()).toBeNull()
  })
})
