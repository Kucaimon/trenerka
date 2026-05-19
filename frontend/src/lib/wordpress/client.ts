import { config } from '@/lib/config'

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
    throw new WpApiError(res.statusText, res.status, body)
  }

  return res.json() as Promise<T>
}
