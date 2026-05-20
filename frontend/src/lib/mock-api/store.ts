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
  mockClientFiles,
} from '@/lib/mock-data'
import { currentMonthPrefix } from '@/lib/mock-data/dates'
import { listExercisesFrom } from '@/lib/mock-data/exercise-list'
import type { ExerciseListParams } from '@/features/api/exercise-list'
import { getTrainerDisplayName, registerMockClientUser } from '@/lib/mock-api/users'
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
  PaymentState,
  Program,
  ProgressMeasurement,
  TrainerAnalytics,
  AdminStats,
  AdminUser,
  RevenueReportPoint,
} from '@/types'

const STORAGE_KEY = 'trenerka_mock_store_v5'

interface ClientFile {
  id: string
  clientId: string
  name: string
  url: string
  mimeType?: string
  createdAt: string
}

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
  clientFiles: ClientFile[]
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
          {
            id: 'w2',
            weekNumber: 1,
            dayLabel: 'Ср',
            title: 'Силовая B',
            exercises: [
              { id: 'we3', exerciseId: 'ex-3', name: 'Тяга в наклоне', muscleGroup: 'Спина', sets: 4, reps: '10', restSeconds: 90, technique: 'Спина прямая.' },
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
    clientFiles: mockClientFiles.map((f) => ({
      id: f.id,
      clientId: f.clientId,
      name: f.name,
      url: `data:text/plain;charset=utf-8,${encodeURIComponent(f.name)}`,
      mimeType: f.type,
      createdAt: `${f.uploadedAt}T12:00:00.000Z`,
    })),
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

function monthKey(date: string): string {
  return date.slice(0, 7)
}

function computePaymentState(client: Client): PaymentState {
  if (client.paymentState && client.status !== 'archive') return client.paymentState
  if (client.packageBalance <= 0) return 'overdue'
  if (client.packageBalance <= 3) return 'pending'
  return 'paid'
}

function computeWorkoutCompletionPct(clientId: string): number {
  const cp = store.clientPrograms.find((x) => x.clientId === clientId && x.status === 'active')
  if (!cp) return 0
  const program = store.programs.find((p) => p.id === cp.programId)
  const workouts = program?.workouts ?? []
  if (!workouts.length) return 0
  const done = workouts.filter((w) => store.workoutCompletions.includes(w.id)).length
  return Math.round((done / workouts.length) * 100)
}

function computeSessionsThisWeek(clientId: string): number {
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  weekStart.setHours(0, 0, 0, 0)
  return store.events.filter((e) => {
    if (e.clientId !== clientId) return false
    const d = new Date(e.start)
    return d >= weekStart
  }).length
}

function computeLastActivityMinutes(clientId: string): number | undefined {
  const times: number[] = []
  for (const m of store.messages.filter((msg) => msg.clientId === clientId)) {
    times.push(new Date(m.createdAt).getTime())
  }
  for (const p of store.payments.filter((pay) => pay.clientId === clientId)) {
    times.push(new Date(`${p.date}T12:00:00`).getTime())
  }
  if (!times.length) return undefined
  const latest = Math.max(...times)
  return Math.max(1, Math.floor((Date.now() - latest) / 60_000))
}

function enrichClientRecord(client: Client): Client {
  const upcoming = store.events
    .filter((e) => e.clientId === client.id && new Date(e.start) > new Date())
    .sort((a, b) => a.start.localeCompare(b.start))[0]
  const lastEvent = store.events
    .filter((e) => e.clientId === client.id)
    .sort((a, b) => b.start.localeCompare(a.start))[0]
  return {
    ...client,
    paymentState: computePaymentState(client),
    workoutCompletionPct: computeWorkoutCompletionPct(client.id),
    sessionsThisWeek: computeSessionsThisWeek(client.id),
    lastActivityMinutesAgo: computeLastActivityMinutes(client.id),
    upcomingSessionAt: upcoming?.start,
    lastSession: lastEvent?.start.slice(0, 10),
  }
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
      return store.clients.map(enrichClientRecord)
    },
    get(id: string) {
      const c = store.clients.find((x) => x.id === id)
      return c ? enrichClientRecord(c) : undefined
    },
    create(data: Omit<Client, 'id' | 'joinedAt'>, options?: { loginPassword?: string }) {
      const client: Client = { ...data, id: uid('c'), joinedAt: new Date().toISOString().slice(0, 10) }
      const temporaryPassword = options?.loginPassword ?? `tmp${Math.random().toString(36).slice(2, 8)}`
      store.clients.push(client)
      save(store)
      registerMockClientUser({
        email: client.email,
        password: temporaryPassword,
        name: client.name,
        clientProfileId: client.id,
      })
      return { client: enrichClientRecord(client), temporaryPassword }
    },
    update(id: string, data: Partial<Client>) {
      const i = store.clients.findIndex((c) => c.id === id)
      if (i >= 0) store.clients[i] = { ...store.clients[i]!, ...data }
      save(store)
      const c = store.clients[i]
      return c ? enrichClientRecord(c) : undefined
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
      if (data.attachmentUrl) {
        store.clientFiles.unshift({
          id: uid('file'),
          clientId: data.clientId,
          name: data.text.trim() || 'Вложение из чата',
          url: data.attachmentUrl,
          mimeType: 'attachment',
          createdAt: new Date().toISOString(),
        })
      }
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
    dashboard(clientId: string): ClientDashboard {
      const profile = store.clients.find((c) => c.id === clientId)
      const cp = store.clientPrograms.find((x) => x.clientId === clientId && x.status === 'active')
      const program = cp ? store.programs.find((p) => p.id === cp.programId) : null
      const next = store.events
        .filter((e) => e.clientId === clientId && new Date(e.start) >= new Date())
        .sort((a, b) => a.start.localeCompare(b.start))[0]
      const programWorkouts = program?.workouts ?? []
      const doneCount = programWorkouts.filter((w) => store.workoutCompletions.includes(w.id)).length
      return {
        clientProfileId: clientId,
        profile: {
          name: profile?.name.split(' ')[0] ?? 'Клиент',
          trainer: getTrainerDisplayName(),
          packageBalance: profile?.packageBalance ?? 0,
        },
        currentProgram: program?.name ?? 'Не назначена',
        nextSession: next ?? null,
        streakDays: doneCount > 0 ? Math.min(doneCount, 7) : 0,
        notifications: store.notifications.slice(0, 5),
      }
    },
    workouts(clientId: string): ClientWorkoutDay[] {
      const cp = store.clientPrograms.find((x) => x.clientId === clientId && x.status === 'active')
      if (!cp) return []
      const program = store.programs.find((p) => p.id === cp.programId)
      return (program?.workouts ?? []).map((w) => ({
        id: w.id,
        day: w.dayLabel,
        title: w.title,
        duration: 45 + w.exercises.length * 5,
        status: store.workoutCompletions.includes(w.id) ? 'done' : 'planned',
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
    progress(clientId: string): ProgressMeasurement[] {
      return store.progress.filter((p) => p.clientId === clientId)
    },
    saveProgress(data: ProgressMeasurement) {
      store.progress.push({ ...data })
      save(store)
    },
    completeWorkout(workoutId: string) {
      if (!store.workoutCompletions.includes(workoutId)) {
        store.workoutCompletions.push(workoutId)
        save(store)
      }
    },
    payments(clientId: string): Payment[] {
      return store.payments.filter((p) => p.clientId === clientId)
    },
    workoutCompletions(clientId: string): string[] {
      const cp = store.clientPrograms.find((x) => x.clientId === clientId && x.status === 'active')
      if (!cp) return []
      const program = store.programs.find((p) => p.id === cp.programId)
      const ids = new Set(program?.workouts?.map((w) => w.id) ?? [])
      return store.workoutCompletions.filter((id) => ids.has(id))
    },
  },

  analytics: {
    trainer(): TrainerAnalytics {
      return {
        activeClients: store.clients.filter((c) => c.status === 'active').length,
        monthlyRevenue: store.payments
          .filter((p) => p.date.startsWith(currentMonthPrefix()))
          .reduce((s, p) => s + p.amount, 0),
        weeklySessions: store.events.filter((e) => {
          const d = new Date(e.start)
          const now = new Date()
          const diff = (now.getTime() - d.getTime()) / 86_400_000
          return diff >= 0 && diff < 7
        }).length,
        unreadMessages: store.messages.filter((m) => m.sender === 'client' && !m.read).length,
      }
    },
    revenue(): RevenueReportPoint[] {
      const byMonth = new Map<string, { revenue: number; clients: Set<string> }>()
      for (const p of store.payments) {
        const month = monthKey(p.date)
        const entry = byMonth.get(month) ?? { revenue: 0, clients: new Set<string>() }
        entry.revenue += p.amount
        entry.clients.add(p.clientId)
        byMonth.set(month, entry)
      }
      return [...byMonth.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, v]) => ({
          month,
          revenue: v.revenue,
          clients: v.clients.size,
        }))
    },
    retention() {
      const active = store.clients.filter((c) => c.status === 'active').length
      const total = store.clients.length || 1
      const rate = Math.round((active / total) * 100)
      const now = new Date()
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        const label = d.toLocaleDateString('ru-RU', { month: 'short' })
        return { month: label, rate: Math.max(0, Math.min(100, rate - (5 - i) * 2)) }
      })
    },
    attendance() {
      const byWeek = new Map<string, number>()
      for (const e of store.events) {
        const d = new Date(e.start)
        const weekStart = new Date(d)
        weekStart.setDate(d.getDate() - d.getDay())
        const key = weekStart.toISOString().slice(0, 10)
        byWeek.set(key, (byWeek.get(key) ?? 0) + 1)
      }
      return [...byWeek.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-8)
        .map(([week, sessions]) => ({ week, sessions }))
    },
    weekday() {
      const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      const counts = [0, 0, 0, 0, 0, 0, 0]
      for (const e of store.events) {
        const day = (new Date(e.start).getDay() + 6) % 7
        counts[day] += 1
      }
      return labels.map((day, i) => ({ day, sessions: counts[i]! }))
    },
    subscriptions() {
      const tiers = [
        { name: '0 занятий', min: 0, max: 0 },
        { name: '1–5', min: 1, max: 5 },
        { name: '6–10', min: 6, max: 10 },
        { name: '11+', min: 11, max: 999 },
      ]
      const colors = ['#64748b', '#94a3b8', '#d9f500', '#22c55e']
      return tiers.map((tier, i) => ({
        name: tier.name,
        value: store.clients.filter(
          (c) => c.packageBalance >= tier.min && c.packageBalance <= tier.max,
        ).length,
        color: colors[i],
      }))
    },
  },

  admin: {
    stats(): AdminStats {
      return {
        trainers: 1,
        clients: store.clients.length,
        paymentsTotal: store.payments.reduce((s, p) => s + p.amount, 0),
        exercises: store.exercises.length,
      }
    },
    users(): AdminUser[] {
      const blocked = (id: string) => store.blockedUserIds.includes(id)
      return [
        { id: 't1', email: 'trainer@trenerka.ru', name: getTrainerDisplayName(), role: 'trainer', blocked: blocked('t1') },
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
      return store.clientFiles.filter((f) => f.clientId === clientId)
    },
    add(clientId: string, file: { name: string; url: string; mimeType?: string }) {
      const entry: ClientFile = {
        id: uid('file'),
        clientId,
        name: file.name,
        url: file.url,
        mimeType: file.mimeType,
        createdAt: new Date().toISOString(),
      }
      store.clientFiles.unshift(entry)
      save(store)
      return entry
    },
  },
}
