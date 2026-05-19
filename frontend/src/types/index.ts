export type UserRole = 'trainer' | 'client' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export type ClientStatus = 'active' | 'pause' | 'archive'

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
}

export interface NewsItem {
  id: string
  title: string
  content: string
  publishedAt: string
}

export interface ClientDashboard {
  profile: {
    name: string
    trainer: string
    packageBalance: number
  }
  currentProgram: string
  nextSession: CalendarEvent | null
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
