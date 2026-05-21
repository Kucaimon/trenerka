import type { TrainerProfile, User, UserRole } from '@/types'

/** Local mock/staging accounts only — not seeded on production WordPress. */
const MOCK_TRAINER_EMAIL = 'trainer@trenerka.ru'
const MOCK_TRAINER_PASSWORD = 'demo123'
const MOCK_CLIENT_EMAIL = 'client@trenerka.ru'
const MOCK_CLIENT_PASSWORD = 'demo123'
const MOCK_ADMIN_EMAIL = 'admin@trenerka.ru'
const MOCK_ADMIN_PASSWORD = 'demo123'

const MOCK_USERS_KEY = 'trenerka-mock-users-v1'
const MOCK_PROFILES_KEY = 'trenerka-trainer-profiles'
const MOCK_PENDING_KEY = 'trenerka-pending-trainers'
const MOCK_RESET_KEY = 'trenerka-reset-tokens'

export interface MockUserEntry {
  password: string
  user: User
}

export interface PendingTrainer {
  email: string
  password: string
  token: string
  fullName?: string
}

export interface MockResetToken {
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

export const defaultMockUsers: Record<string, MockUserEntry> = {
  [MOCK_TRAINER_EMAIL]: {
    password: MOCK_TRAINER_PASSWORD,
    user: { id: 't1', email: MOCK_TRAINER_EMAIL, name: 'Алексей Тренеров', role: 'trainer' },
  },
  [MOCK_CLIENT_EMAIL]: {
    password: MOCK_CLIENT_PASSWORD,
    user: {
      id: 'cl1',
      email: MOCK_CLIENT_EMAIL,
      name: 'Анна Смирнова',
      role: 'client',
      clientProfileId: 'c1',
    },
  },
  [MOCK_ADMIN_EMAIL]: {
    password: MOCK_ADMIN_PASSWORD,
    user: { id: 'a1', email: MOCK_ADMIN_EMAIL, name: 'Админ Trenerka', role: 'admin' },
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

export function loadMockUsers(): Record<string, MockUserEntry> {
  const stored = readJson<Record<string, MockUserEntry>>(MOCK_USERS_KEY, {})
  return { ...defaultMockUsers, ...stored }
}

export function saveMockUsers(users: Record<string, MockUserEntry>): void {
  const custom: Record<string, MockUserEntry> = {}
  for (const [email, entry] of Object.entries(users)) {
    if (!defaultMockUsers[email]) custom[email] = entry
  }
  writeJson(MOCK_USERS_KEY, custom)
}

export function upsertMockUser(email: string, entry: MockUserEntry): void {
  const all = loadMockUsers()
  all[email.toLowerCase()] = entry
  saveMockUsers(all)
}

export function findMockUserByEmail(email: string): MockUserEntry | undefined {
  return loadMockUsers()[email.toLowerCase()]
}

export function findMockUserByRole(role: UserRole): MockUserEntry | undefined {
  return Object.values(loadMockUsers()).find((e) => e.user.role === role)
}

export function registerMockClientUser(params: {
  email: string
  password: string
  name: string
  clientProfileId: string
}): void {
  const email = params.email.toLowerCase()
  const userId = `cl-${params.clientProfileId}`
  upsertMockUser(email, {
    password: params.password,
    user: {
      id: userId,
      email,
      name: params.name,
      role: 'client',
      clientProfileId: params.clientProfileId,
    },
  })
}

export function mockProfiles(): Record<string, TrainerProfile> {
  return { ...defaultMockProfiles, ...readJson<Record<string, TrainerProfile>>(MOCK_PROFILES_KEY, {}) }
}

export function saveMockProfile(profile: TrainerProfile): void {
  const all = mockProfiles()
  all[profile.userId] = profile
  writeJson(MOCK_PROFILES_KEY, all)
}

export function getTrainerDisplayName(): string {
  const profile = mockProfiles().t1 ?? Object.values(mockProfiles())[0]
  if (profile?.fullName?.trim()) return profile.fullName.trim()
  const trainer = findMockUserByRole('trainer')
  return trainer?.user.name ?? 'Тренер'
}

export function readPendingTrainers(): PendingTrainer[] {
  return readJson<PendingTrainer[]>(MOCK_PENDING_KEY, [])
}

export function writePendingTrainers(pending: PendingTrainer[]): void {
  writeJson(MOCK_PENDING_KEY, pending)
}

export function readResetTokens(): MockResetToken[] {
  return readJson<MockResetToken[]>(MOCK_RESET_KEY, [])
}

export function writeResetTokens(tokens: MockResetToken[]): void {
  writeJson(MOCK_RESET_KEY, tokens)
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
