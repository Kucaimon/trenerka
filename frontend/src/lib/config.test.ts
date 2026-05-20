import { describe, expect, it, vi } from 'vitest'

describe('config', () => {
  it('useMockData follows VITE_USE_MOCK_DATA', async () => {
    vi.stubEnv('VITE_USE_MOCK_DATA', 'true')
    const { config } = await import('@/lib/config')
    expect(config.useMockData).toBe(true)
  })
})
