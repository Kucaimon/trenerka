import i18n from '@/i18n'
import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { isTrainerProfileComplete } from '@/lib/auth/profile-complete'
import { mockApi } from '@/lib/mock-api/store'
import {
  findMockUserByEmail,
  loadMockUsers,
  mockProfiles,
  readPendingTrainers,
  readResetTokens,
  saveMockProfile,
  upsertMockUser,
  writePendingTrainers,
  writeResetTokens,
} from '@/lib/mock-api/users'
import { consumeMockInvite } from '@/features/api/invites-service'
import { wpFetch, setAuthToken } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { MemberType, TrainerProfile, User, UserRole } from '@/types'
import type { WpAuthResponse } from '@/lib/wordpress/types'

function createVerifyToken(email: string): string {
  return btoa(`verify:${email}:${Date.now()}`).replace(/=/g, '')
}

function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? email
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function login(
  email: string,
  password: string,
  role: UserRole,
): Promise<{ user: User; token: string; trainerProfile?: TrainerProfile | null }> {
  if (config.useMockData) {
    await apiDelay(600)
    const normalized = email.toLowerCase()
    const entry = findMockUserByEmail(normalized)
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
  fullName?: string
}): Promise<{ verifyToken?: string }> {
  await apiDelay(800)
  if (config.useMockData) {
    const email = data.email.toLowerCase()
    if (findMockUserByEmail(email)) {
      throw new Error(i18n.t('auth:errors.emailExists'))
    }
    const pending = readPendingTrainers()
    const token = createVerifyToken(email)
    const next = pending.filter((p) => p.email !== email)
    next.push({
      email,
      password: data.password,
      token,
      fullName: data.fullName?.trim() || displayNameFromEmail(email),
    })
    writePendingTrainers(next)
    return { verifyToken: token }
  }
  await wpFetch(wpEndpoints.auth.registerTrainer, {
    method: 'POST',
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.fullName,
    }),
  })
  return {}
}

export async function registerClient(data: {
  email: string
  password: string
  name?: string
  inviteToken?: string
  memberType?: MemberType
}): Promise<{ onboardingState?: string }> {
  await apiDelay(800)
  if (config.useMockData) {
    const email = data.email.toLowerCase()
    if (findMockUserByEmail(email)) {
      throw new Error(i18n.t('auth:errors.emailExists'))
    }
    const name = data.name?.trim() || displayNameFromEmail(email)
    const memberType = data.memberType ?? 'client'
    mockApi.clients.create(
      {
        name,
        email,
        phone: '',
        status: 'active',
        packageBalance: 0,
        goal: '',
        notes: '',
        memberType,
        lifecycleStatus: memberType === 'student' ? 'student' : 'active_client',
        onboardingState: 'profile_pending',
      },
      { loginPassword: data.password },
    )
    if (data.inviteToken) consumeMockInvite(data.inviteToken)
    return { onboardingState: 'profile_pending' }
  }
  if (!data.inviteToken) {
    throw new Error(i18n.t('auth:register.clientInviteOnly'))
  }
  const res = await wpFetch<{ onboardingState?: string }>(wpEndpoints.auth.registerClient, {
    method: 'POST',
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.name,
      inviteToken: data.inviteToken,
    }),
  })
  return res
}

export async function verifyEmail(token: string): Promise<void> {
  await apiDelay(500)
  if (config.useMockData) {
    const pending = readPendingTrainers()
    const match = pending.find((p) => p.token === token)
    if (!match) {
      throw new Error(i18n.t('auth:verify.invalidToken'))
    }
    const userId = `t-${Date.now()}`
    const fullName = match.fullName?.trim() || displayNameFromEmail(match.email)
    upsertMockUser(match.email, {
      password: match.password,
      user: { id: userId, email: match.email, name: fullName, role: 'trainer' },
    })
    writePendingTrainers(pending.filter((p) => p.token !== token))
    saveMockProfile({
      userId,
      fullName,
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

export async function resendVerificationEmail(email: string): Promise<{ alreadyVerified?: boolean }> {
  await apiDelay(500)
  if (config.useMockData) {
    const pending = readPendingTrainers()
    const match = pending.find((p) => p.email === email.toLowerCase())
    if (!match) {
      return {}
    }
    return {}
  }
  const res = await wpFetch<{ success: boolean; alreadyVerified?: boolean }>(
    wpEndpoints.auth.resendVerification,
    { method: 'POST', body: JSON.stringify({ email }) },
  )
  return { alreadyVerified: res.alreadyVerified }
}

export async function resetPassword(email: string): Promise<{ resetToken?: string }> {
  await apiDelay(600)
  if (config.useMockData) {
    const normalized = email.toLowerCase()
    if (!findMockUserByEmail(normalized)) {
      return {}
    }
    const token = btoa(`reset:${normalized}:${Date.now()}`).replace(/=/g, '')
    const tokens = readResetTokens()
    tokens.push({ email: normalized, token, expiresAt: Date.now() + 3600_000 })
    writeResetTokens(tokens)
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
    const tokens = readResetTokens()
    const match = tokens.find((t) => t.token === token && t.expiresAt > Date.now())
    if (!match) {
      throw new Error(i18n.t('auth:reset.invalidToken'))
    }
    const entry = findMockUserByEmail(match.email)
    if (entry) {
      entry.password = password
      upsertMockUser(match.email, entry)
    }
    writeResetTokens(tokens.filter((t) => t.token !== token))
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
    const users = loadMockUsers()
    const entry = Object.values(users).find((u) => u.user.id === userId)
    if (entry) {
      entry.user.name = data.fullName
      entry.user.avatar = data.avatarUrl
      upsertMockUser(entry.user.email, entry)
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
