import { describe, expect, it, vi, beforeEach } from 'vitest'
import { resolveClientProfileId } from '@/features/api/client-id'

vi.mock('@/lib/config', () => ({
  config: { useMockData: true },
}))

describe('resolveClientProfileId', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('prefers dashboard client id', () => {
    expect(resolveClientProfileId({ id: 'cl1' }, 'wp-99')).toBe('wp-99')
  })

  it('uses user clientProfileId when set', () => {
    expect(resolveClientProfileId({ id: 'u1', clientProfileId: 'wp-42' })).toBe('wp-42')
  })

  it('maps mock user id in demo mode', () => {
    expect(resolveClientProfileId({ id: 'cl1' })).toBe('c1')
  })

  it('returns empty string when unresolved', () => {
    expect(resolveClientProfileId({ id: 'unknown' })).toBe('')
  })
})
