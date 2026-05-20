import { describe, expect, it, vi, afterEach } from 'vitest'

describe('config', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('useMockData is true only when VITE_USE_MOCK_DATA=true', async () => {
    vi.stubEnv('VITE_USE_MOCK_DATA', 'true')
    const { config } = await import('@/lib/config')
    expect(config.useMockData).toBe(true)
  })

  it('useMockData is false when unset or not "true"', async () => {
    vi.stubEnv('VITE_USE_MOCK_DATA', 'false')
    const { config } = await import('@/lib/config')
    expect(config.useMockData).toBe(false)
  })

  it('normalizes wp API url to /wp-json suffix', async () => {
    vi.stubEnv('VITE_USE_MOCK_DATA', 'false')
    vi.stubEnv('VITE_WP_API_URL', 'https://staging.example.com')
    const { config } = await import('@/lib/config')
    expect(config.wpApiUrl).toBe('https://staging.example.com/wp-json')
  })
})
