import {
  mockAchievements,
  mockCalendarEvents,
  mockClients,
  mockExercises,
  mockMealPlan,
  mockMessages,
  mockNews,
  mockNotifications,
  mockPayments,
  mockProgress,
  mockRevenueData,
  mockRetentionData,
  mockAttendanceData,
  mockWeekdayActivity,
  mockSubscriptionMix,
  mockClientFiles,
} from '@/lib/mock-data'
import { currentMonthPrefix } from '@/lib/mock-data/dates'
import { listExercisesFrom } from '@/lib/mock-data/exercise-list'
import type { ExerciseListParams } from '@/features/api/exercise-list'
import type {
  CalendarEvent,
  Client,
  ClientDashboard,
  ClientWorkoutDay,
  Exercise,
  Message,
  NewsItem,
  Notification,
  Payment,
  Program,
  ProgressMeasurement,
  TrainerAnalytics,
  AdminStats,
  AdminUser,
} from '@/types'

const STORAGE_KEY = 'trenerka_mock_store_v4'

interface MockStore {
  clients: Client[]
  exercises: Exercise[]
  programs: Program[]
  clientPrograms: { id: string; clientId: string; programId: string; startDate: string; status: string }[]
  events: CalendarEvent[]
  payments: Payment[]
  messages: Message[]
  notifications: Notification[]
  progress: ProgressMeasurement[]
  news: NewsItem[]
  workoutCompletions: string[]
  blockedUserIds: string[]
}

function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function seed(): MockStore {
  return {
    clients: mockClients.map((c) => ({ ...c, dateOfBirth: null })),
    exercises: mockExercises.map((e) => ({
      ...e,
      description: 'Базовое упражнение каталога.',
      technique: 'Контролируйте амплитуду и дыхание.',
      isPublic: true,
    })),
    programs: [
      {
        id: 'prog-1',
        name: 'Силовая A',
        description: 'Базовая силовая программа',
        weeks: 4,
        workouts: [
          {
            id: 'w1',
            weekNumber: 1,
            dayLabel: 'Пн',
            title: 'Силовая A',
            exercises: [
              { id: 'we1', exerciseId: 'ex-1', name: 'Жим лёжа', muscleGroup: 'Грудь', sets: 4, reps: '8', restSeconds: 90, technique: 'Лопатки сведены.' },
              { id: 'we2', exerciseId: 'ex-2', name: 'Приседания', muscleGroup: 'Ноги', sets: 5, reps: '5', restSeconds: 120, technique: 'Колени по линии носков.' },
            ],
          },
        ],
      },
    ],
    clientPrograms: [
      { id: 'cp1', clientId: 'c1', programId: 'prog-1', startDate: '2026-04-01', status: 'active' },
      { id: 'cp2', clientId: 'c4', programId: 'prog-1', startDate: '2026-03-15', status: 'active' },
      { id: 'cp3', clientId: 'c10', programId: 'prog-1', startDate: '2026-05-01', status: 'active' },
    ],
    events: mockCalendarEvents,
    payments: mockPayments,
    messages: mockMessages,
    notifications: mockNotifications,
    progress: mockProgress.map((p) => ({ ...p, clientId: 'c1' })),
    news: mockNews,
    workoutCompletions: [],
    blockedUserIds: [],
  }
}

function load(): MockStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as MockStore
  } catch {
    /* ignore */
  }
  const s = seed()
  save(s)
  return s
}

function save(store: MockStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

let store = load()

function refresh(): void {
  store = load()
}

export const mockApi = {
  reset() {
    localStorage.removeItem(STORAGE_KEY)
    store = seed()
    save(store)
  },

  clients: {
    list(): Client[] {
      refresh()
      return [...store.clients]
    },
    get(id: string) {
      return store.clients.find((c) => c.id === id)
    },
    create(data: Omit<Client, 'id' | 'joinedAt'>) {
      const client: Client = { ...data, id: uid('c'), joinedAt: new Date().toISOString().slice(0, 10) }
      const temporaryPassword = `tmp${Math.random().toString(36).slice(2, 8)}`
      store.clients.push(client)
      save(store)
      return { client, temporaryPassword }
    },
    update(id: string, data: Partial<Client>) {
      const i = store.clients.findIndex((c) => c.id === id)
      if (i >= 0) store.clients[i] = { ...store.clients[i]!, ...data }
      save(store)
      return store.clients[i]
    },
    remove(id: string) {
      const i = store.clients.findIndex((c) => c.id === id)
      if (i >= 0) store.clients[i]!.status = 'archive'
      save(store)
    },
  },

  exercises: {
    list(params: ExerciseListParams = {}) {
      refresh()
      return listExercisesFrom(store.exercises, params)
    },
    listAll(): Exercise[] {
      refresh()
      return [...store.exercises]
    },
    get(id: string): Exercise | undefined {
      refresh()
      return store.exercises.find((e) => e.id === id)
    },
    create(data: Omit<Exercise, 'id'>) {
      const ex: Exercise = { ...data, id: uid('ex'), isPublic: false }
      store.exercises.push(ex)
      save(store)
      return ex
    },
    update(id: string, data: Partial<Exercise>) {
      const i = store.exercises.findIndex((e) => e.id === id)
      if (i >= 0) store.exercises[i] = { ...store.exercises[i]!, ...data }
      save(store)
      return store.exercises[i]
    },
    remove(id: string) {
      store.exercises = store.exercises.filter((e) => e.id !== id)
      save(store)
    },
  },

  programs: {
    list(): Program[] {
      return store.programs.map(({ workouts, ...p }) => {
        void workouts
        return p
      })
    },
    get(id: string): Program | undefined {
      return store.programs.find((p) => p.id === id)
    },
    save(program: Program) {
      const i = store.programs.findIndex((p) => p.id === program.id)
      if (i >= 0) store.programs[i] = program
      else store.programs.push({ ...program, id: program.id || uid('prog') })
      save(store)
      return program
    },
    remove(id: string) {
      store.programs = store.programs.filter((p) => p.id !== id)
      save(store)
    },
    assign(clientId: string, programId: string, startDate: string) {
      store.clientPrograms = store.clientPrograms.filter(
        (cp) => !(cp.clientId === clientId && cp.status === 'active'),
      )
      store.clientPrograms.push({ id: uid('cp'), clientId, programId, startDate, status: 'active' })
      save(store)
    },
    getAssignment(clientId: string) {
      const cp = store.clientPrograms.find((x) => x.clientId === clientId && x.status === 'active')
      if (!cp) return null
      const program = store.programs.find((p) => p.id === cp.programId)
      return { assignment: cp, program: program ?? null }
    },
  },

  progress: {
    byClient(clientId: string) {
      return store.progress.filter((p) => p.clientId === clientId)
    },
  },

  events: {
    list(): CalendarEvent[] {
      refresh()
      return [...store.events]
    },
    save(event: CalendarEvent) {
      const i = store.events.findIndex((e) => e.id === event.id)
      if (i >= 0) store.events[i] = event
      else store.events.push({ ...event, id: event.id || uid('e') })
      save(store)
      return event
    },
    remove(id: string) {
      store.events = store.events.filter((e) => e.id !== id)
      save(store)
    },
  },

  payments: {
    list(): Payment[] {
      refresh()
      return [...store.payments]
    },
    create(payment: Omit<Payment, 'id'>) {
      const p: Payment = { ...payment, id: uid('p') }
      store.payments.unshift(p)
      if (payment.sessionsAdded) {
        const c = store.clients.find((x) => x.id === payment.clientId)
        if (c) c.packageBalance += payment.sessionsAdded
      }
      save(store)
      return p
    },
    update(id: string, data: Partial<Payment>) {
      const i = store.payments.findIndex((p) => p.id === id)
      if (i >= 0) store.payments[i] = { ...store.payments[i]!, ...data }
      save(store)
      return store.payments[i]
    },
    remove(id: string) {
      store.payments = store.payments.filter((p) => p.id !== id)
      save(store)
    },
    report(from: string, to: string) {
      const total = store.payments
        .filter((p) => p.date >= from && p.date <= to)
        .reduce((s, p) => s + p.amount, 0)
      return { from, to, total }
    },
  },

  messages: {
    list(clientId: string): Message[] {
      return store.messages.filter((m) => m.clientId === clientId)
    },
    send(data: { clientId: string; sender: 'trainer' | 'client'; text: string; attachmentUrl?: string }) {
      const msg: Message = {
        id: uid('m'),
        clientId: data.clientId,
        sender: data.sender,
        text: data.text,
        createdAt: new Date().toISOString(),
        read: false,
        attachmentUrl: data.attachmentUrl,
      }
      store.messages.push(msg)
      save(store)
      return msg
    },
    markRead(id: string) {
      const m = store.messages.find((x) => x.id === id)
      if (m) m.read = true
      save(store)
    },
  },

  notifications: {
    list(): Notification[] {
      return [...store.notifications]
    },
    markRead(id: string) {
      const n = store.notifications.find((x) => x.id === id)
      if (n) n.read = true
      save(store)
    },
  },

  client: {
    dashboard(clientId = 'c1'): ClientDashboard {
      const profile = store.clients.find((c) => c.id === clientId)
      const cp = store.clientPrograms.find((x) => x.clientId === clientId && x.status === 'active')
      const program = cp ? store.programs.find((p) => p.id === cp.programId) : null
      const next = store.events
        .filter((e) => e.clientId === clientId)
        .sort((a, b) => a.start.localeCompare(b.start))[0]
      return {
        profile: {
          name: profile?.name.split(' ')[0] ?? 'Клиент',
          trainer: 'Алексей Тренеров',
          packageBalance: profile?.packageBalance ?? 0,
        },
        currentProgram: program?.name ?? 'Не назначена',
        nextSession: next ?? null,
        notifications: store.notifications.slice(0, 5),
      }
    },
    workouts(clientId = 'c1'): ClientWorkoutDay[] {
      const cp = store.clientPrograms.find((x) => x.clientId === clientId && x.status === 'active')
      if (!cp) return []
      const program = store.programs.find((p) => p.id === cp.programId)
      return (program?.workouts ?? []).map((w) => ({
        id: w.id,
        day: w.dayLabel,
        title: w.title,
        duration: 45 + w.exercises.length * 5,
        status: 'planned',
        exercises: w.exercises.map((ex) => ({
          name: ex.name ?? '',
          muscle: ex.muscleGroup ?? '',
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.restSeconds,
          technique: ex.technique ?? '',
          videoUrl: ex.videoUrl,
        })),
      }))
    },
    progress(clientId = 'c1'): ProgressMeasurement[] {
      void clientId
      return [...store.progress]
    },
    saveProgress(data: ProgressMeasurement) {
      store.progress.push({ ...data, clientId: data.clientId ?? 'c1' })
      save(store)
    },
    completeWorkout(workoutId: string) {
      store.workoutCompletions.push(workoutId)
      save(store)
    },
    payments(clientId: string): Payment[] {
      return store.payments.filter((p) => p.clientId === clientId)
    },
  },

  analytics: {
    trainer(): TrainerAnalytics {
      return {
        activeClients: store.clients.filter((c) => c.status === 'active').length,
        monthlyRevenue: store.payments
          .filter((p) => p.date.startsWith(currentMonthPrefix()))
          .reduce((s, p) => s + p.amount, 0),
        weeklySessions: store.events.length,
        unreadMessages: store.messages.filter((m) => m.sender === 'client' && !m.read).length,
      }
    },
    revenue() {
      return mockRevenueData
    },
    retention() {
      return mockRetentionData
    },
    attendance() {
      return mockAttendanceData
    },
    weekday() {
      return mockWeekdayActivity
    },
    subscriptions() {
      return mockSubscriptionMix
    },
  },

  admin: {
    stats(): AdminStats {
      return {
        trainers: 3,
        clients: store.clients.length,
        paymentsTotal: store.payments.reduce((s, p) => s + p.amount, 0),
        exercises: store.exercises.length,
      }
    },
    users(): AdminUser[] {
      const blocked = (id: string) => store.blockedUserIds.includes(id)
      return [
        { id: 't1', email: 'trainer@trenerka.ru', name: 'Алексей Тренеров', role: 'trainer', blocked: blocked('t1') },
        { id: 'cl1', email: 'client@trenerka.ru', name: 'Анна Смирнова', role: 'client', blocked: blocked('cl1') },
        { id: 'a1', email: 'admin@trenerka.ru', name: 'Админ Trenerka', role: 'admin', blocked: blocked('a1') },
      ]
    },
    patchUser(id: string, blocked: boolean) {
      if (blocked) {
        if (!store.blockedUserIds.includes(id)) store.blockedUserIds.push(id)
      } else {
        store.blockedUserIds = store.blockedUserIds.filter((x) => x !== id)
      }
      save(store)
    },
  },

  news: {
    list(): NewsItem[] {
      return [...store.news]
    },
    save(item: NewsItem) {
      const i = store.news.findIndex((n) => n.id === item.id)
      if (i >= 0) store.news[i] = item
      else store.news.unshift({ ...item, id: item.id || uid('news') })
      save(store)
    },
    remove(id: string) {
      store.news = store.news.filter((n) => n.id !== id)
      save(store)
    },
  },

  achievements: () => mockAchievements,
  mealPlan: () => mockMealPlan,

  files: {
    byClient(clientId: string) {
      return mockClientFiles.filter((f) => f.clientId === clientId)
    },
  },
}
