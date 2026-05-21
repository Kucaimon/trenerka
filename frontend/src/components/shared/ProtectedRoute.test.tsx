import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'

vi.mock('@/hooks/use-auth-ready', () => ({
  useAuthStorageReady: () => true,
}))

vi.mock('@/lib/config', () => ({
  config: { useMockData: true },
}))

let authState = {
  user: null as { id: string; role: string } | null,
  token: null as string | null,
  sessionChecking: false,
}

vi.mock('@/store/auth-store', () => ({
  useAuthStore: (selector: (s: typeof authState) => unknown) => selector(authState),
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    authState = { user: null, token: null, sessionChecking: false }
  })

  it('redirects unauthenticated trainer to /login/trainer', async () => {
    const { findByText } = render(
      <MemoryRouter initialEntries={['/trainer']}>
        <Routes>
          <Route
            path="/trainer"
            element={
              <ProtectedRoute role="trainer">
                <div>Secret</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login/trainer" element={<div>Trainer login</div>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(await findByText('Trainer login')).toBeTruthy()
  })

  it('redirects client away from trainer route to /client', async () => {
    authState = {
      user: { id: 'cl1', role: 'client' },
      token: 'mock-token',
      sessionChecking: false,
    }
    const { findByText } = render(
      <MemoryRouter initialEntries={['/trainer']}>
        <Routes>
          <Route
            path="/trainer"
            element={
              <ProtectedRoute role="trainer">
                <div>Trainer area</div>
              </ProtectedRoute>
            }
          />
          <Route path="/client" element={<div>Client home</div>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(await findByText('Client home')).toBeTruthy()
  })

  it('allows authenticated trainer into trainer route', async () => {
    authState = {
      user: { id: 't1', role: 'trainer' },
      token: 'mock-token',
      sessionChecking: false,
    }
    const { findByText } = render(
      <MemoryRouter initialEntries={['/trainer']}>
        <Routes>
          <Route
            path="/trainer"
            element={
              <ProtectedRoute role="trainer">
                <div>Trainer area</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    expect(await findByText('Trainer area')).toBeTruthy()
  })
})
