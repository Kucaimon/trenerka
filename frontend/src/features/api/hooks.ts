import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import * as clientsApi from './clients-service'
import * as exercisesApi from './exercises-service'
import type { ExerciseListParams } from './exercise-list'
import { EXERCISE_PAGE_SIZE } from './exercise-list'
import { displayExercise } from '@/lib/exercise-i18n'
import * as programsApi from './programs-service'
import { saveClientProgress } from './client-cabinet-service'
import * as calendarApi from './calendar-service'
import * as paymentsApi from './payments-service'
import * as messagesApi from './messages-service'
import { getUnreadCountsByClient, isGroupThread } from './messages-service'

function messageThreadKey(clientId: string, thread?: 'group'): string {
  return isGroupThread(clientId) || thread === 'group' ? 'group' : clientId || 'self'
}
import * as notificationsApi from './notifications-service'
import * as clientApi from './client-cabinet-service'
import * as analyticsApi from './analytics-service'
import * as adminApi from './admin-service'
import type { CalendarEvent, Client, Exercise, Message, NewsItem, Payment, Program, ProgressMeasurement } from '@/types'

export const queryKeys = {
  clients: ['clients'] as const,
  client: (id: string) => ['clients', id] as const,
  exercises: ['exercises'] as const,
  exercisesList: (params: ExerciseListParams) => ['exercises', 'list', params] as const,
  programs: ['programs'] as const,
  program: (id: string) => ['programs', id] as const,
  events: ['events'] as const,
  payments: ['payments'] as const,
  messages: (clientId: string) => ['messages', clientId] as const,
  messageUnreadCounts: ['messages', 'unread'] as const,
  notifications: ['notifications'] as const,
  clientDashboard: ['client', 'dashboard'] as const,
  clientWorkouts: ['client', 'workouts'] as const,
  clientProgress: ['client', 'progress'] as const,
  clientPayments: ['client', 'payments'] as const,
  clientAttachments: ['client', 'attachments'] as const,
  clientProfile: ['client', 'profile'] as const,
  trainerAnalytics: ['analytics', 'trainer'] as const,
  adminStats: ['admin', 'stats'] as const,
  adminUsers: ['admin', 'users'] as const,
  news: ['news'] as const,
  clientProgram: (id: string) => ['client-program', id] as const,
  clientProgressReports: (id: string) => ['client-progress-reports', id] as const,
  clientWorkoutCompletions: (id: string) => ['client-workout-completions', id] as const,
}

export function useClients() {
  return useQuery({ queryKey: queryKeys.clients, queryFn: clientsApi.getClients })
}

export function useClient(id: string) {
  return useQuery({ queryKey: queryKeys.client(id), queryFn: () => clientsApi.getClient(id), enabled: !!id })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clients }),
  })
}

export function useUpdateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => clientsApi.updateClient(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.clients })
      qc.invalidateQueries({ queryKey: queryKeys.client(id) })
    },
  })
}

export function useExercisesAll() {
  return useQuery({ queryKey: queryKeys.exercises, queryFn: exercisesApi.getExercises })
}

export function useExercises(filters: ExerciseListParams = {}) {
  const { t } = useTranslation('trainer')
  const params: ExerciseListParams = {
    page: 1,
    limit: EXERCISE_PAGE_SIZE,
    ...filters,
  }

  return useQuery({
    queryKey: queryKeys.exercisesList(params),
    queryFn: async () => {
      const { search, ...apiParams } = params
      if (search?.trim()) {
        const all = await exercisesApi.getExercises()
        const q = search.trim().toLowerCase()
        return exercisesApi.applyExerciseListFilters(all, params, (ex) =>
          displayExercise(ex, t).name.toLowerCase().includes(q),
        )
      }
      return exercisesApi.listExercises(apiParams)
    },
  })
}

export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.exercises, id],
    queryFn: () => exercisesApi.getExercise(id!),
    enabled: Boolean(id),
  })
}

export function usePrograms() {
  return useQuery({ queryKey: queryKeys.programs, queryFn: programsApi.getPrograms })
}

export function useEvents() {
  return useQuery({ queryKey: queryKeys.events, queryFn: calendarApi.getEvents })
}

export function useSaveEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: calendarApi.saveEvent,
    onMutate: async (event: CalendarEvent) => {
      await qc.cancelQueries({ queryKey: queryKeys.events })
      const prev = qc.getQueryData<CalendarEvent[]>(queryKeys.events)
      if (prev) {
        const exists = prev.some((e) => e.id === event.id)
        qc.setQueryData(
          queryKeys.events,
          exists ? prev.map((e) => (e.id === event.id ? event : e)) : [...prev, event],
        )
      }
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.events, ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.events }),
  })
}

export function usePayments() {
  return useQuery({ queryKey: queryKeys.payments, queryFn: paymentsApi.getPayments })
}

export function useMessages(clientId: string, options?: { enabled?: boolean; thread?: 'group' }) {
  const group = isGroupThread(clientId) || options?.thread === 'group'
  const threadKey = messageThreadKey(clientId, options?.thread)
  return useQuery({
    queryKey: queryKeys.messages(threadKey),
    queryFn: () => messagesApi.getMessages(clientId, { thread: group ? 'group' : options?.thread }),
    enabled: options?.enabled ?? (group || !!clientId),
  })
}

export function useMessageUnreadCounts() {
  return useQuery({
    queryKey: queryKeys.messageUnreadCounts,
    queryFn: getUnreadCountsByClient,
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: (_, vars) => {
      const threadKey = messageThreadKey(vars.clientId, vars.thread)
      qc.invalidateQueries({ queryKey: queryKeys.messages(threadKey) })
      qc.invalidateQueries({ queryKey: queryKeys.messageUnreadCounts })
      qc.invalidateQueries({ queryKey: queryKeys.trainerAnalytics })
    },
  })
}

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications, queryFn: notificationsApi.getNotifications })
}

export function useClientDashboard() {
  return useQuery({ queryKey: queryKeys.clientDashboard, queryFn: clientApi.getClientDashboard })
}

export function useClientWorkouts() {
  return useQuery({ queryKey: queryKeys.clientWorkouts, queryFn: clientApi.getClientWorkouts })
}

export function useClientProgress() {
  return useQuery({ queryKey: queryKeys.clientProgress, queryFn: clientApi.getClientProgress })
}

export function useClientPayments() {
  return useQuery({ queryKey: queryKeys.clientPayments, queryFn: clientApi.getClientPayments })
}

export function useClientAttachments() {
  return useQuery({ queryKey: queryKeys.clientAttachments, queryFn: clientApi.getClientAttachments })
}

export function useClientProfile() {
  return useQuery({ queryKey: queryKeys.clientProfile, queryFn: clientApi.getClientProfile })
}

export function useUpdateClientProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clientApi.updateClientProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.clientProfile })
      qc.invalidateQueries({ queryKey: queryKeys.clientDashboard })
    },
  })
}

export function useTrainerAnalytics() {
  return useQuery({ queryKey: queryKeys.trainerAnalytics, queryFn: analyticsApi.getTrainerAnalytics })
}

export function useAdminStats() {
  return useQuery({ queryKey: queryKeys.adminStats, queryFn: adminApi.getAdminStats })
}

export function useAdminUsers() {
  return useQuery({ queryKey: queryKeys.adminUsers, queryFn: adminApi.getAdminUsers })
}

export function useNews() {
  return useQuery({ queryKey: queryKeys.news, queryFn: adminApi.getNews })
}

export function useClientAssignedProgram(clientId: string) {
  return useQuery({
    queryKey: queryKeys.clientProgram(clientId),
    queryFn: () => clientsApi.getClientAssignedProgram(clientId),
    enabled: !!clientId,
  })
}

export function useClientProgressReports(clientId: string) {
  return useQuery({
    queryKey: queryKeys.clientProgressReports(clientId),
    queryFn: () => clientsApi.getClientProgress(clientId),
    enabled: !!clientId,
  })
}

export function useClientWorkoutCompletions(clientId: string) {
  return useQuery({
    queryKey: queryKeys.clientWorkoutCompletions(clientId),
    queryFn: () => clientsApi.getClientWorkoutCompletions(clientId),
    enabled: !!clientId,
  })
}

export function useProgram(id: string) {
  return useQuery({
    queryKey: queryKeys.program(id),
    queryFn: () => programsApi.getProgram(id),
    enabled: !!id,
  })
}

export function useSaveProgram() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: programsApi.saveProgram,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.programs })
    },
  })
}

export function useAssignProgram() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ clientId, programId, startDate }: { clientId: string; programId: string; startDate: string }) =>
      programsApi.assignProgram(clientId, programId, startDate),
    onSuccess: (_, { clientId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.clientProgram(clientId) })
    },
  })
}

function invalidateExercises(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: queryKeys.exercises })
  qc.invalidateQueries({ queryKey: ['exercises', 'list'] })
}

export function useCreateExercise() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: exercisesApi.createExercise,
    onSuccess: () => invalidateExercises(qc),
  })
}

export function useUpdateExercise() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Exercise> }) => exercisesApi.updateExercise(id, data),
    onSuccess: () => invalidateExercises(qc),
  })
}

export function useDeleteExercise() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: exercisesApi.deleteExercise,
    onSuccess: () => invalidateExercises(qc),
  })
}

export function useSaveClientProgress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProgressMeasurement) => saveClientProgress(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.clientProgress })
      qc.invalidateQueries({ queryKey: queryKeys.clientDashboard })
      qc.invalidateQueries({ queryKey: ['client-progress-reports'] })
    },
  })
}

export function useCompleteClientWorkout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clientApi.completeClientWorkout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.clientWorkouts })
      qc.invalidateQueries({ queryKey: queryKeys.clientDashboard })
    },
  })
}

export function useSetUserBlocked() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => adminApi.setUserBlocked(id, blocked),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminUsers }),
  })
}

export function useSetUserEmailVerified() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, emailVerified }: { id: string; emailVerified: boolean }) =>
      adminApi.setUserEmailVerified(id, emailVerified),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminUsers }),
  })
}

export function useSaveNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminApi.saveNews,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.news }),
  })
}

export function useDeleteNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminApi.deleteNews,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.news }),
  })
}

export type { Exercise, Program, Payment, Message, NewsItem }
