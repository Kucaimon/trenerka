import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { wpFetch, setAuthToken } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { User, UserRole } from '@/types'
import type { WpAuthResponse } from '@/lib/wordpress/types'

const mockUsers: Record<string, { password: string; user: User }> = {
  'trainer@trenerka.ru': {
    password: 'demo123',
    user: { id: 't1', email: 'trainer@trenerka.ru', name: 'Алексей Тренеров', role: 'trainer' },
  },
  'client@trenerka.ru': {
    password: 'demo123',
    user: { id: 'cl1', email: 'client@trenerka.ru', name: 'Анна Смирнова', role: 'client' },
  },
  'admin@trenerka.ru': {
    password: 'demo123',
    user: { id: 'a1', email: 'admin@trenerka.ru', name: 'Админ Trenerka', role: 'admin' },
  },
}

export async function login(
  email: string,
  password: string,
  role: UserRole,
): Promise<{ user: User; token: string }> {
  if (config.useMockData) {
    await apiDelay(600)
    const entry = mockUsers[email.toLowerCase()]
    if (!entry || entry.password !== password || entry.user.role !== role) {
      throw new Error('Неверный email или пароль')
    }
    const token = `mock-jwt-${entry.user.id}`
    setAuthToken(token)
    return { user: entry.user, token }
  }

  const data = await wpFetch<WpAuthResponse>(wpEndpoints.auth.login, {
    method: 'POST',
    body: JSON.stringify({ username: email, password }),
  })

  const me = await wpFetch<User>(wpEndpoints.auth.me, {
    headers: { Authorization: `Bearer ${data.token}` },
  })

  if (me.role !== role) {
    throw new Error('Неверная роль для этого входа')
  }

  setAuthToken(data.token)
  return { user: me, token: data.token }
}

export async function fetchCurrentUser(): Promise<User | null> {
  if (config.useMockData) return null
  try {
    return await wpFetch<User>(wpEndpoints.auth.me)
  } catch {
    return null
  }
}

export async function registerTrainer(data: {
  name: string
  email: string
  password: string
}): Promise<void> {
  await apiDelay(800)
  if (config.useMockData) {
    void data
    return
  }
  await wpFetch(wpEndpoints.auth.registerTrainer, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function resetPassword(email: string): Promise<void> {
  await apiDelay(600)
  if (config.useMockData) {
    void email
    return
  }
  await wpFetch(wpEndpoints.auth.resetPassword, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function logout(): void {
  setAuthToken(null)
}
