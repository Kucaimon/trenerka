import { config } from '@/lib/config'
import { getLoginPath, readIntendedRole } from '@/lib/auth/role-session'
import { useAuthStore } from '@/store/auth-store'

export class WpApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message)
    this.name = 'WpApiError'
  }
}

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
  if (token) {
    localStorage.setItem('trenerka_token', token)
  } else {
    localStorage.removeItem('trenerka_token')
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken
  return localStorage.getItem('trenerka_token')
}

export async function wpFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  }
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${config.wpApiUrl}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => undefined)
    const apiMessage =
      body && typeof body === 'object' && 'message' in body && typeof body.message === 'string'
        ? body.message
        : res.statusText
    if (res.status === 401 && !config.useMockData) {
      const role = useAuthStore.getState().user?.role ?? readIntendedRole() ?? 'trainer'
      const loginPath = getLoginPath(role)
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign(loginPath)
      }
    }
    throw new WpApiError(apiMessage, res.status, body)
  }

  return res.json() as Promise<T>
}
