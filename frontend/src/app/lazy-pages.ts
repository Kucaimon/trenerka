import { lazy } from 'react'

export const LandingPage = lazy(() =>
  import('@/features/landing/LandingPage').then((m) => ({ default: m.LandingPage })),
)
export const PrivacyPage = lazy(() =>
  import('@/features/legal/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
)
export const TermsPage = lazy(() =>
  import('@/features/legal/TermsPage').then((m) => ({ default: m.TermsPage })),
)
export const LoginPage = lazy(() => import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
export const RegisterPage = lazy(() =>
  import('@/features/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
export const ResetPasswordPage = lazy(() =>
  import('@/features/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)
export const VerifyEmailPage = lazy(() =>
  import('@/features/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })),
)
export const TrainerDashboardPage = lazy(() =>
  import('@/features/trainer/TrainerDashboardPage').then((m) => ({ default: m.TrainerDashboardPage })),
)
export const ClientsPage = lazy(() =>
  import('@/features/trainer/ClientsPage').then((m) => ({ default: m.ClientsPage })),
)
export const ClientDetailPage = lazy(() =>
  import('@/features/trainer/ClientDetailPage').then((m) => ({ default: m.ClientDetailPage })),
)
export const WorkoutBuilderPage = lazy(() =>
  import('@/features/trainer/WorkoutBuilderPage').then((m) => ({ default: m.WorkoutBuilderPage })),
)
export const ExercisesPage = lazy(() =>
  import('@/features/trainer/ExercisesPage').then((m) => ({ default: m.ExercisesPage })),
)
export const ExerciseDetailPage = lazy(() =>
  import('@/features/trainer/ExerciseDetailPage').then((m) => ({ default: m.ExerciseDetailPage })),
)
export const ProgramsPage = lazy(() =>
  import('@/features/trainer/ProgramsPage').then((m) => ({ default: m.ProgramsPage })),
)
export const CalendarPage = lazy(() =>
  import('@/features/trainer/CalendarPage').then((m) => ({ default: m.CalendarPage })),
)
export const AnalyticsPage = lazy(() =>
  import('@/features/trainer/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
)
export const FinancePage = lazy(() =>
  import('@/features/trainer/FinancePage').then((m) => ({ default: m.FinancePage })),
)
export const MessagesPage = lazy(() =>
  import('@/features/trainer/MessagesPage').then((m) => ({ default: m.MessagesPage })),
)
export const FilesPage = lazy(() =>
  import('@/features/trainer/FilesPage').then((m) => ({ default: m.FilesPage })),
)
export const SettingsPage = lazy(() =>
  import('@/features/trainer/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
export const NotificationsPage = lazy(() =>
  import('@/features/trainer/NotificationsPage').then((m) => ({ default: m.NotificationsPage })),
)
export const SupportPage = lazy(() =>
  import('@/features/trainer/SupportPage').then((m) => ({ default: m.SupportPage })),
)
export const ProfilePage = lazy(() =>
  import('@/features/trainer/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
export const ClientHomePage = lazy(() =>
  import('@/features/client/ClientHomePage').then((m) => ({ default: m.ClientHomePage })),
)
export const ClientWorkoutsPage = lazy(() =>
  import('@/features/client/ClientWorkoutsPage').then((m) => ({ default: m.ClientWorkoutsPage })),
)
export const WorkoutSessionPage = lazy(() =>
  import('@/features/client/WorkoutSessionPage').then((m) => ({ default: m.WorkoutSessionPage })),
)
export const ProgressPage = lazy(() =>
  import('@/features/client/ProgressPage').then((m) => ({ default: m.ProgressPage })),
)
export const ChatPage = lazy(() => import('@/features/client/ChatPage').then((m) => ({ default: m.ChatPage })))
export const ClientPaymentsPage = lazy(() =>
  import('@/features/client/ClientPaymentsPage').then((m) => ({ default: m.ClientPaymentsPage })),
)
export const ClientProfilePage = lazy(() =>
  import('@/features/client/ClientProfilePage').then((m) => ({ default: m.ClientProfilePage })),
)
export const ClientNutritionPage = lazy(() =>
  import('@/features/client/NutritionPage').then((m) => ({ default: m.NutritionPage })),
)
export const ClientAchievementsPage = lazy(() =>
  import('@/features/client/AchievementsPage').then((m) => ({ default: m.AchievementsPage })),
)
export const AdminDashboardPage = lazy(() =>
  import('@/features/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)
export const ExercisesAdminPage = lazy(() =>
  import('@/features/admin/ExercisesAdminPage').then((m) => ({ default: m.ExercisesAdminPage })),
)
export const UsersAdminPage = lazy(() =>
  import('@/features/admin/UsersAdminPage').then((m) => ({ default: m.UsersAdminPage })),
)
export const NewsAdminPage = lazy(() =>
  import('@/features/admin/NewsAdminPage').then((m) => ({ default: m.NewsAdminPage })),
)
export const SubscriptionsAdminPage = lazy(() =>
  import('@/features/admin/SubscriptionsAdminPage').then((m) => ({ default: m.SubscriptionsAdminPage })),
)
