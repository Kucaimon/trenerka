import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/lib/config', () => ({ config: { useMockData: false, wpApiUrl: 'http://test/wp-json' } }))
vi.mock('@/lib/api/delay', () => ({ apiDelay: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/features/api/client-id', () => ({ getClientProfileIdFromStore: () => '' }))
vi.mock('@/lib/wordpress/client', () => ({ wpFetch: vi.fn() }))

describe('client-cabinet-service', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('calls WP dashboard when not in mock mode (JWT scopes client)', async () => {
    const { wpFetch } = await import('@/lib/wordpress/client')
    vi.mocked(wpFetch).mockResolvedValueOnce({
      clientProfileId: '7',
      profile: { name: 'Anna', trainer: 'Alex', packageBalance: 5 },
      currentProgram: 'Strength A',
      nextSession: null,
      streakDays: 2,
      notifications: [],
    })
    const { getClientDashboard } = await import('@/features/api/client-cabinet-service')
    const dash = await getClientDashboard()
    expect(wpFetch).toHaveBeenCalledWith('/trenerka/v1/client/dashboard')
    expect(dash.profile.name).toBe('Anna')
    expect(dash.streakDays).toBe(2)
  })

  it('calls WP workouts when not in mock mode', async () => {
    const { wpFetch } = await import('@/lib/wordpress/client')
    vi.mocked(wpFetch).mockResolvedValueOnce({ workouts: [{ id: '1', day: 'Mon', title: 'A', exercises: [] }] })
    const { getClientWorkouts } = await import('@/features/api/client-cabinet-service')
    const list = await getClientWorkouts()
    expect(wpFetch).toHaveBeenCalledWith('/trenerka/v1/client/workouts')
    expect(list).toHaveLength(1)
  })

  it('posts full progress payload to WP', async () => {
    const { wpFetch } = await import('@/lib/wordpress/client')
    vi.mocked(wpFetch).mockResolvedValueOnce({ success: true })
    const { saveClientProgress } = await import('@/features/api/client-cabinet-service')
    await saveClientProgress({
      date: '2026-05-20',
      weight: 67.4,
      waist: 72,
      hips: 96,
      chest: 88,
      arms: 28,
      legs: 54,
      notes: 'Good week',
      photos: ['https://example.com/p.jpg'],
    })
    expect(wpFetch).toHaveBeenCalledWith('/trenerka/v1/client/progress', {
      method: 'POST',
      body: JSON.stringify({
        date: '2026-05-20',
        weight: 67.4,
        bodyFat: undefined,
        waist: 72,
        hips: 96,
        chest: 88,
        arms: 28,
        legs: 54,
        notes: 'Good week',
        photos: ['https://example.com/p.jpg'],
      }),
    })
  })
})
