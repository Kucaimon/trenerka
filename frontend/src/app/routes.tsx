import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LandingPage } from '@/features/landing/LandingPage'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { TrainerLayout } from '@/components/layout/trainer-layout'
import { ClientShell } from '@/components/layout/client-shell'
import { AdminLayout } from '@/components/layout/admin-layout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { TrainerDashboardPage } from '@/features/trainer/TrainerDashboardPage'
import { ClientsPage } from '@/features/trainer/ClientsPage'
import { ClientDetailPage } from '@/features/trainer/ClientDetailPage'
import { WorkoutBuilderPage } from '@/features/trainer/WorkoutBuilderPage'
import { ExercisesPage } from '@/features/trainer/ExercisesPage'
import { ExerciseDetailPage } from '@/features/trainer/ExerciseDetailPage'
import { ProgramsPage } from '@/features/trainer/ProgramsPage'
import { CalendarPage } from '@/features/trainer/CalendarPage'
import { AnalyticsPage } from '@/features/trainer/AnalyticsPage'
import { FinancePage } from '@/features/trainer/FinancePage'
import { MessagesPage } from '@/features/trainer/MessagesPage'
import { AICoachPage } from '@/features/trainer/AICoachPage'
import { FilesPage } from '@/features/trainer/FilesPage'
import { SettingsPage } from '@/features/trainer/SettingsPage'
import { NotificationsPage } from '@/features/trainer/NotificationsPage'
import { SupportPage } from '@/features/trainer/SupportPage'
import { ProfilePage } from '@/features/trainer/ProfilePage'
import { ClientHomePage } from '@/features/client/ClientHomePage'
import { ClientWorkoutsPage } from '@/features/client/ClientWorkoutsPage'
import { WorkoutSessionPage } from '@/features/client/WorkoutSessionPage'
import { ProgressPage } from '@/features/client/ProgressPage'
import { NutritionPage } from '@/features/client/NutritionPage'
import { AchievementsPage } from '@/features/client/AchievementsPage'
import { ChatPage } from '@/features/client/ChatPage'
import { ClientProfilePage } from '@/features/client/ClientProfilePage'
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage'
import { ExercisesAdminPage } from '@/features/admin/ExercisesAdminPage'
import { UsersAdminPage } from '@/features/admin/UsersAdminPage'
import { NewsAdminPage } from '@/features/admin/NewsAdminPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login/trainer', element: <LoginPage role="trainer" /> },
      { path: '/login/client', element: <LoginPage role="client" /> },
      { path: '/login/admin', element: <LoginPage role="admin" /> },
      { path: '/register/trainer', element: <RegisterPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    path: '/trainer',
    element: <ProtectedRoute role="trainer"><TrainerLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <TrainerDashboardPage /> },
      { path: 'clients', element: <ClientsPage /> },
      { path: 'clients/:id', element: <ClientDetailPage /> },
      { path: 'workouts/builder', element: <WorkoutBuilderPage /> },
      { path: 'exercises', element: <ExercisesPage /> },
      { path: 'exercises/:id', element: <ExerciseDetailPage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'ai-coach', element: <AICoachPage /> },
      { path: 'files', element: <FilesPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '/client',
    element: <ProtectedRoute role="client"><ClientShell /></ProtectedRoute>,
    children: [
      { index: true, element: <ClientHomePage /> },
      { path: 'workouts', element: <ClientWorkoutsPage /> },
      { path: 'workouts/session', element: <WorkoutSessionPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'nutrition', element: <NutritionPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'profile', element: <ClientProfilePage /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'exercises', element: <ExercisesAdminPage /> },
      { path: 'users', element: <UsersAdminPage /> },
      { path: 'news', element: <NewsAdminPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
