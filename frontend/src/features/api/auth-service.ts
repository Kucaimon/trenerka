import i18n from '@/i18n'
import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { isTrainerProfileComplete } from '@/lib/auth/profile-complete'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch, setAuthToken } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { TrainerProfile, User, UserRole } from '@/types'
import type { WpAuthResponse } from '@/lib/wordpress/types'

const MOCK_PROFILES_KEY = 'trenerka-trainer-profiles'
const MOCK_PENDING_KEY = 'trenerka-pending-trainers'
const MOCK_RESET_KEY = 'trenerka-reset-tokens'

interface PendingTrainer {
  email: string
  password: string
  token: string
}

interface MockResetToken {
  email: string
  token: string
  expiresAt: number
}

const defaultMockProfiles: Record<string, TrainerProfile> = {
  t1: {
    userId: 't1',
    fullName: 'Алексей Тренеров',
    specialization: 'Силовой тренинг',
    experience: '8 лет',
    phone: '+7 900 000-00-01',
  },
}

const mockUsers: Record<string, { password: string; user: User }> = {
  'trainer@trenerka.ru': {
    password: 'demo123',
    user: { id: 't1', email: 'trainer@trenerka.ru', name: 'Алексей Тренеров', role: 'trainer' },
  },
  'client@trenerka.ru': {
    password: 'demo123',
    user: {
      id: 'cl1',
      email: 'client@trenerka.ru',
      name: 'Анна Смирнова',
      role: 'client',
      clientProfileId: 'c1',
    },
  },
  'admin@trenerka.ru': {
    password: 'demo123',
    user: { id: 'a1', email: 'admin@trenerka.ru', name: 'Админ Trenerka', role: 'admin' },
  },
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function mockProfiles(): Record<string, TrainerProfile> {
  return { ...defaultMockProfiles, ...readJson<Record<string, TrainerProfile>>(MOCK_PROFILES_KEY, {}) }
}

function saveMockProfile(profile: TrainerProfile): void {
  const all = mockProfiles()
  all[profile.userId] = profile
  writeJson(MOCK_PROFILES_KEY, all)
}

function createVerifyToken(email: string): string {
  return btoa(`verify:${email}:${Date.now()}`).replace(/=/g, '')
}

export async function login(
  email: string,
  password: string,
  role: UserRole,
): Promise<{ user: User; token: string; trainerProfile?: TrainerProfile | null }> {
  if (config.useMockData) {
    await apiDelay(600)
    const normalized = email.toLowerCase()
    const entry = mockUsers[normalized]
    if (!entry || entry.password !== password || entry.user.role !== role) {
      throw new Error(i18n.t('auth:errors.invalidCredentials'))
    }
    const token = `mock-jwt-${entry.user.id}`
    setAuthToken(token)
    const trainerProfile = role === 'trainer' ? mockProfiles()[entry.user.id] ?? null : null
    return { user: entry.user, token, trainerProfile }
  }

  const data = await wpFetch<WpAuthResponse>(wpEndpoints.auth.login, {
    method: 'POST',
    body: JSON.stringify({ username: email, password }),
  })

  const me = await wpFetch<User>(wpEndpoints.auth.me, {
    headers: { Authorization: `Bearer ${data.token}` },
  })

  if (me.role !== role) {
    throw new Error(i18n.t('auth:errors.wrongRole'))
  }

  setAuthToken(data.token)
  const trainerProfile = role === 'trainer' ? await fetchTrainerProfile().catch(() => null) : null
  return { user: me, token: data.token, trainerProfile }
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
  email: string
  password: string
}): Promise<{ verifyToken?: string }> {
  await apiDelay(800)
  if (config.useMockData) {
    const email = data.email.toLowerCase()
    if (mockUsers[email]) {
      throw new Error(i18n.t('auth:errors.emailExists'))
    }
    const pending = readJson<PendingTrainer[]>(MOCK_PENDING_KEY, [])
    const token = createVerifyToken(email)
    const next = pending.filter((p) => p.email !== email)
    next.push({ email, password: data.password, token })
    writeJson(MOCK_PENDING_KEY, next)
    return { verifyToken: token }
  }
  await wpFetch(wpEndpoints.auth.registerTrainer, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return {}
}

export async function registerClient(data: {
  email: string
  password: string
  name?: string
}): Promise<void> {
  await apiDelay(800)
  if (config.useMockData) {
    const email = data.email.toLowerCase()
    if (mockUsers[email]) {
      throw new Error(i18n.t('auth:errors.emailExists'))
    }
    const name = data.name?.trim() || email.split('@')[0] || email
    const userId = `cl-${Date.now()}`
    const { client } = mockApi.clients.create({
      name,
      email,
      phone: '',
      status: 'active',
      packageBalance: 0,
      goal: '',
      notes: '',
    })
    mockUsers[email] = {
      password: data.password,
      user: {
        id: userId,
        email,
        name,
        role: 'client',
        clientProfileId: client.id,
      },
    }
    return
  }
  throw new Error(i18n.t('auth:register.clientInviteOnly'))
}

export async function verifyEmail(token: string): Promise<void> {
  await apiDelay(500)
  if (config.useMockData) {
    const pending = readJson<PendingTrainer[]>(MOCK_PENDING_KEY, [])
    const match = pending.find((p) => p.token === token)
    if (!match) {
      throw new Error(i18n.t('auth:verify.invalidToken'))
    }
    const userId = `t-${Date.now()}`
    mockUsers[match.email] = {
      password: match.password,
      user: { id: userId, email: match.email, name: match.email.split('@')[0], role: 'trainer' },
    }
    writeJson(
      MOCK_PENDING_KEY,
      pending.filter((p) => p.token !== token),
    )
    saveMockProfile({
      userId,
      fullName: '',
      specialization: '',
      experience: '',
      phone: '',
    })
    return
  }
  await wpFetch('/trenerka/v1/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  })
}

export async function resetPassword(email: string): Promise<{ resetToken?: string }> {
  await apiDelay(600)
  if (config.useMockData) {
    const normalized = email.toLowerCase()
    if (!mockUsers[normalized]) {
      return {}
    }
    const token = btoa(`reset:${normalized}:${Date.now()}`).replace(/=/g, '')
    const tokens = readJson<MockResetToken[]>(MOCK_RESET_KEY, [])
    tokens.push({ email: normalized, token, expiresAt: Date.now() + 3600_000 })
    writeJson(MOCK_RESET_KEY, tokens)
    return { resetToken: token }
  }
  await wpFetch(wpEndpoints.auth.resetPassword, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  return {}
}

export async function confirmResetPassword(token: string, password: string): Promise<void> {
  await apiDelay(600)
  if (config.useMockData) {
    const tokens = readJson<MockResetToken[]>(MOCK_RESET_KEY, [])
    const match = tokens.find((t) => t.token === token && t.expiresAt > Date.now())
    if (!match) {
      throw new Error(i18n.t('auth:reset.invalidToken'))
    }
    const entry = mockUsers[match.email]
    if (entry) {
      entry.password = password
    }
    writeJson(
      MOCK_RESET_KEY,
      tokens.filter((t) => t.token !== token),
    )
    return
  }
  await wpFetch('/trenerka/v1/auth/reset-password/confirm', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}

export async function fetchTrainerProfile(userId?: string): Promise<TrainerProfile | null> {
  if (config.useMockData) {
    await apiDelay(300)
    const id = userId ?? ''
    if (!id) return null
    return mockProfiles()[id] ?? null
  }
  return wpFetch<TrainerProfile>(wpEndpoints.auth.trainerProfile)
}

export async function updateTrainerProfile(
  userId: string,
  data: Omit<TrainerProfile, 'userId'>,
): Promise<TrainerProfile> {
  await apiDelay(500)
  if (config.useMockData) {
    const profile: TrainerProfile = { userId, ...data }
    saveMockProfile(profile)
    const entry = Object.values(mockUsers).find((u) => u.user.id === userId)
    if (entry) {
      entry.user.name = data.fullName
      entry.user.avatar = data.avatarUrl
    }
    return profile
  }
  return wpFetch<TrainerProfile>(wpEndpoints.auth.trainerProfile, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function logout(): void {
  setAuthToken(null)
}

export { isTrainerProfileComplete }
