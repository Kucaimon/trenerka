import { beforeEach, describe, expect, it, vi } from 'vitest'
import { login } from '@/features/api/auth-service'

vi.mock('@/lib/config', () => ({
  config: { useMockData: true, wpApiUrl: 'http://test' },
}))

vi.mock('@/lib/api/delay', () => ({
  apiDelay: () => Promise.resolve(),
}))

vi.mock('@/lib/wordpress/client', () => ({
  setAuthToken: vi.fn(),
  wpFetch: vi.fn(),
}))

describe('auth-service login (mock)', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('logs in trainer with correct role', async () => {
    const result = await login('trainer@trenerka.ru', 'demo123', 'trainer')
    expect(result.user.role).toBe('trainer')
    expect(result.token).toMatch(/^mock-jwt-/)
  })

  it('logs in client with correct role', async () => {
    const result = await login('client@trenerka.ru', 'demo123', 'client')
    expect(result.user.role).toBe('client')
  })

  it('logs in admin with correct role', async () => {
    const result = await login('admin@trenerka.ru', 'demo123', 'admin')
    expect(result.user.role).toBe('admin')
  })

  it('rejects wrong role at trainer login', async () => {
    await expect(login('client@trenerka.ru', 'demo123', 'trainer')).rejects.toThrow()
  })

  it('rejects invalid credentials', async () => {
    await expect(login('trainer@trenerka.ru', 'wrong', 'trainer')).rejects.toThrow()
  })
})
