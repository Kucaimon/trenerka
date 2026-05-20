import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { TrainerLayout } from '@/components/layout/trainer-layout'
import { ClientShell } from '@/components/layout/client-shell'
import { AdminLayout } from '@/components/layout/admin-layout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { RouteErrorFallback } from '@/components/shared/RouteErrorFallback'
import {
  AdminDashboardPage,
  AnalyticsPage,
  CalendarPage,
  ChatPage,
  ClientDetailPage,
  ClientHomePage,
  ClientPaymentsPage,
  ClientProfilePage,
  ClientWorkoutsPage,
  ClientsPage,
  ExerciseDetailPage,
  ExercisesAdminPage,
  ExercisesPage,
  FilesPage,
  FinancePage,
  LandingPage,
  LoginPage,
  MessagesPage,
  NewsAdminPage,
  NotificationsPage,
  PrivacyPage,
  ProfilePage,
  ProgramsPage,
  ProgressPage,
  ResetPasswordPage,
  SettingsPage,
  SupportPage,
  TrainerDashboardPage,
  UsersAdminPage,
  VerifyEmailPage,
  WorkoutBuilderPage,
  WorkoutSessionPage,
} from '@/app/lazy-pages'

const devRoutes =
  import.meta.env.DEV
    ? [
        {
          path: '/dev/design-system',
          lazy: async () => {
            const { DesignSystemPage } = await import('@/features/dev/DesignSystemPage')
            return { Component: DesignSystemPage }
          },
        },
      ]
    : []

export const router = createBrowserRouter([
  { path: '/', lazy: async () => ({ Component: LandingPage }) },
  { path: '/privacy', lazy: async () => ({ Component: PrivacyPage }) },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login/trainer', lazy: async () => ({ Component: () => <LoginPage role="trainer" /> }) },
      { path: '/login/client', lazy: async () => ({ Component: () => <LoginPage role="client" /> }) },
      { path: '/login/admin', lazy: async () => ({ Component: () => <LoginPage role="admin" /> }) },
      {
        path: '/register/trainer',
        lazy: async () => {
          const { RegisterPage } = await import('@/features/auth/RegisterPage')
          return { Component: () => <RegisterPage role="trainer" /> }
        },
      },
      {
        path: '/register/client',
        lazy: async () => {
          const { RegisterPage } = await import('@/features/auth/RegisterPage')
          return { Component: () => <RegisterPage role="client" /> }
        },
      },
      { path: '/verify-email', lazy: async () => ({ Component: VerifyEmailPage }) },
      { path: '/reset-password', lazy: async () => ({ Component: ResetPasswordPage }) },
    ],
  },
  {
    path: '/trainer',
    errorElement: <RouteErrorFallback />,
    element: (
      <ProtectedRoute role="trainer">
        <TrainerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, lazy: async () => ({ Component: TrainerDashboardPage }) },
      { path: 'clients', lazy: async () => ({ Component: ClientsPage }) },
      { path: 'clients/:id', lazy: async () => ({ Component: ClientDetailPage }) },
      { path: 'workouts/builder', lazy: async () => ({ Component: WorkoutBuilderPage }) },
      { path: 'exercises', lazy: async () => ({ Component: ExercisesPage }) },
      { path: 'exercises/:id', lazy: async () => ({ Component: ExerciseDetailPage }) },
      { path: 'programs', lazy: async () => ({ Component: ProgramsPage }) },
      { path: 'calendar', lazy: async () => ({ Component: CalendarPage }) },
      { path: 'analytics', lazy: async () => ({ Component: AnalyticsPage }) },
      { path: 'finance', lazy: async () => ({ Component: FinancePage }) },
      { path: 'messages', lazy: async () => ({ Component: MessagesPage }) },
      { path: 'files', lazy: async () => ({ Component: FilesPage }) },
      { path: 'settings', lazy: async () => ({ Component: SettingsPage }) },
      { path: 'notifications', lazy: async () => ({ Component: NotificationsPage }) },
      { path: 'support', lazy: async () => ({ Component: SupportPage }) },
      { path: 'profile', lazy: async () => ({ Component: ProfilePage }) },
    ],
  },
  {
    path: '/client',
    errorElement: <RouteErrorFallback />,
    element: (
      <ProtectedRoute role="client">
        <ClientShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, lazy: async () => ({ Component: ClientHomePage }) },
      { path: 'workouts', lazy: async () => ({ Component: ClientWorkoutsPage }) },
      { path: 'workouts/:id/session', lazy: async () => ({ Component: WorkoutSessionPage }) },
      { path: 'progress', lazy: async () => ({ Component: ProgressPage }) },
      { path: 'payments', lazy: async () => ({ Component: ClientPaymentsPage }) },
      { path: 'chat', lazy: async () => ({ Component: ChatPage }) },
      { path: 'profile', lazy: async () => ({ Component: ClientProfilePage }) },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, lazy: async () => ({ Component: AdminDashboardPage }) },
      { path: 'exercises', lazy: async () => ({ Component: ExercisesAdminPage }) },
      { path: 'users', lazy: async () => ({ Component: UsersAdminPage }) },
      { path: 'news', lazy: async () => ({ Component: NewsAdminPage }) },
    ],
  },
  ...devRoutes,
  { path: '*', element: <Navigate to="/" replace /> },
])
