import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/lib/config', () => ({ config: { useMockData: false, wpApiUrl: 'http://test/wp-json' } }))
vi.mock('@/lib/api/delay', () => ({ apiDelay: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/features/api/client-id', () => ({ getClientProfileIdFromStore: () => '' }))
vi.mock('@/lib/wordpress/client', () => ({ wpFetch: vi.fn() }))

describe('client-cabinet-service', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns empty dashboard when client profile id is missing in production mode', async () => {
    const { getClientDashboard } = await import('@/features/api/client-cabinet-service')
    const dash = await getClientDashboard()
    expect(dash.profile.name).toBe('')
    expect(dash.notifications).toEqual([])
  })

  it('returns empty workouts without client id', async () => {
    const { getClientWorkouts } = await import('@/features/api/client-cabinet-service')
    await expect(getClientWorkouts()).resolves.toEqual([])
  })
})
