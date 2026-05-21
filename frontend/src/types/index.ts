import type { LifecycleStatus, MemberType, OnboardingState } from '@/types/member'

export type { ClientAttachment, InviteLink, LifecycleStatus, MaterialCategory, MemberType, OnboardingState } from '@/types/member'

export type UserRole = 'trainer' | 'client' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  /** Client profile row id (WP trenerka_client_profiles), not WP user id. */
  clientProfileId?: string
}

export interface TrainerProfile {
  userId: string
  fullName: string
  specialization: string
  experience: string
  phone: string
  avatarUrl?: string
  /** Display name for the trainer-wide group chat thread */
  groupChatTitle?: string
}

export interface PlatformPlan {
  id: string
  name: string
  priceRub: number
  clientLimit: number
  active: boolean
}

export type ClientStatus = 'active' | 'pause' | 'archive'
export type PaymentState = 'paid' | 'pending' | 'overdue'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: ClientStatus
  joinedAt: string
  packageBalance: number
  lastSession?: string
  goal?: string
  notes?: string
  dateOfBirth?: string | null
  paymentState?: PaymentState
  lastActivityMinutesAgo?: number
  workoutCompletionPct?: number
  /** Manual or program-linked course progress (0–100) */
  courseProgressPct?: number
  sessionsThisWeek?: number
  upcomingSessionAt?: string
  /** Fit platform: client, student, academy member, etc. */
  memberType?: MemberType
  lifecycleStatus?: LifecycleStatus
  onboardingState?: OnboardingState
  /** Last message count for CRM summary */
  messageCount?: number
  lastMessageAt?: string
}

export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description?: string
  technique?: string
  imageUrl?: string
  videoUrl?: string
  pdfUrl?: string
  isPublic?: boolean
  /** Numbered technique steps (infographic-style detail) */
  steps?: string[]
  breathingTip?: string
  /** Display level label, e.g. «для новичков» */
  level?: string
  trainerName?: string
}

export interface WorkoutSet {
  reps: number
  weight?: number
  restSec: number
}

export interface WorkoutExerciseItem {
  id: string
  exerciseId: string
  name?: string
  muscleGroup?: string
  sets: number
  reps: string
  restSeconds: number
  videoUrl?: string
  technique?: string
  imageUrl?: string
  pdfUrl?: string
}

export interface ProgramWorkout {
  id: string
  weekNumber: number
  dayLabel: string
  title: string
  exercises: WorkoutExerciseItem[]
}

export interface Program {
  id: string
  name: string
  description?: string
  pdfUrl?: string
  weeks: number
  workouts?: ProgramWorkout[]
}

export interface ClientProgramAssignment {
  id: string
  clientId: string
  programId: string
  startDate: string
  endDate?: string
  status: string
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  sets: WorkoutSet[]
  supersetWith?: string
}

export type CalendarEventType = 'training' | 'consultation' | 'group'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  clientId?: string
  type?: CalendarEventType
  status?: string
  recurring?: boolean
  color?: string
}

export interface Payment {
  id: string
  clientId: string
  amount: number
  date: string
  method: string
  note?: string
  sessionsAdded?: number
}

export interface Message {
  id: string
  clientId: string
  sender: 'trainer' | 'client'
  text: string
  createdAt: string
  read: boolean
  attachmentUrl?: string
}

export interface AiInsight {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export interface Notification {
  id: string
  title: string
  body: string
  createdAt: string
  read: boolean
  type?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

export interface MealPlan {
  id: string
  day: string
  meals: { time: string; name: string; calories: number }[]
}

export interface ProgressMeasurement {
  date: string
  weight: number
  waist?: number
  hips?: number
  chest?: number
  arms?: number
  legs?: number
  bodyFat?: number
  notes?: string
  photos?: string[]
  clientId?: string
}

export interface CreateClientResult {
  client: Client
  temporaryPassword?: string
  welcomeEmailSent?: boolean
}

export interface NewsItem {
  id: string
  title: string
  content: string
  publishedAt: string
}

export interface ClientDashboard {
  clientProfileId?: string
  profile: {
    name: string
    trainer: string
    packageBalance: number
    phone?: string
    email?: string
    coachNotes?: string
    avatarUrl?: string
  }
  currentProgram: string
  nextSession: CalendarEvent | null
  streakDays?: number
  notifications: Notification[]
}

export interface ClientWorkoutDay {
  id: string
  day: string
  title: string
  date?: string
  duration?: number
  status?: string
  exercises: {
    name: string
    muscle: string
    sets: number
    reps: string
    rest: number
    technique: string
    videoUrl?: string
    imageUrl?: string
    pdfUrl?: string
  }[]
}

export interface TrainerAnalytics {
  activeClients: number
  monthlyRevenue: number
  weeklySessions: number
  unreadMessages: number
}

export interface AdminStats {
  trainers: number
  clients: number
  paymentsTotal: number
  exercises: number
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: UserRole
  blocked: boolean
  emailVerified?: boolean
}

export interface RevenueReportPoint {
  month: string
  revenue: number
  clients: number
}

export interface PaymentProviderConfig {
  provider: 'stripe' | 'yookassa' | 'mock'
  enabled: boolean
  publicKey?: string
}
