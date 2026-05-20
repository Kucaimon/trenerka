import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'

vi.mock('@/hooks/use-auth-ready', () => ({
  useAuthStorageReady: () => true,
}))

vi.mock('@/store/auth-store', () => ({
  useAuthStore: (selector: (s: { user: unknown; token: string | null; sessionChecking: boolean }) => unknown) =>
    selector({ user: null, token: null, sessionChecking: false }),
}))

vi.mock('@/lib/wordpress/client', () => ({
  getAuthToken: () => null,
}))

describe('ProtectedRoute', () => {
  it('redirects unauthenticated trainer to login', async () => {
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
          <Route path="/login/trainer" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(await findByText('Login')).toBeTruthy()
  })
})
