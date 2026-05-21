import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { login } from '@/features/api/auth-service'
import { RoleLoginShell } from '@/features/auth/RoleLoginShell'
import { useAuthStorageReady } from '@/hooks/use-auth-ready'
import { useAuthStore } from '@/store/auth-store'
import {
  getDashboardPath,
  persistIntendedEntry,
  persistIntendedRole,
  type LoginEntry,
} from '@/lib/auth/role-session'
import type { UserRole } from '@/types'

type FormData = { email: string; password: string }

const TITLE_KEYS: Record<LoginEntry, string> = {
  client: 'login.client',
  trainer: 'login.trainer',
  'smart-fitness': 'login.smartFitness',
  admin: 'login.admin',
}

const SUBTITLE_KEYS: Record<LoginEntry, string> = {
  client: 'login.subtitleClient',
  trainer: 'login.subtitleTrainerShort',
  'smart-fitness': 'login.subtitleSmartFitness',
  admin: 'login.subtitleAdmin',
}

export function LoginPage({ role, entry }: { role: UserRole; entry: LoginEntry }) {
  const { t } = useTranslation(['auth', 'common'])
  const navigate = useNavigate()
  const authLogin = useAuthStore((s) => s.login)
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const storageReady = useAuthStorageReady()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    persistIntendedRole(role)
    persistIntendedEntry(entry)
  }, [role, entry])

  useEffect(() => {
    if (!storageReady || !user || !token) return
    if (user.role === role) {
      navigate(getDashboardPath(role), { replace: true })
      return
    }
    navigate(getDashboardPath(user.role), { replace: true })
  }, [storageReady, user, token, role, navigate])

  const schema = z.object({
    email: z.string().email(t('validation.email')),
    password: z.string().min(6, t('validation.passwordMin6')),
  })

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const result = await login(data.email, data.password, role)
      authLogin(result.user, result.token, result.trainerProfile ?? null)
      persistIntendedRole(role)
      persistIntendedEntry(entry)

      if (role === 'trainer') {
        const complete = useAuthStore.getState().isTrainerProfileComplete()
        toast.success(t('login.welcome'))
        navigate(complete ? '/trainer' : '/trainer/profile?setup=1')
        return
      }

      toast.success(t('login.welcome'))
      navigate(getDashboardPath(role))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleLoginShell entry={entry}>
      <CardHeader className="space-y-1 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-lg font-bold tracking-tight">{t(TITLE_KEYS[entry])}</CardTitle>
        <CardDescription className="text-sm">{t(SUBTITLE_KEYS[entry])}</CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('login.email')}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              className="h-11 text-base sm:text-sm"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t('login.password')}</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              className="h-11 text-base sm:text-sm"
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="touch-target h-11 w-full text-base font-semibold sm:text-sm" disabled={loading}>
            {loading ? t('login.submitting') : t('common:actions.login')}
          </Button>
        </form>
        <div className="mt-4 space-y-2 text-center text-sm text-[var(--text-secondary)]">
          <Link to="/reset-password" className="block min-h-11 py-2 leading-none hover:text-[var(--text-primary)]">
            {t('login.forgot')}
          </Link>
          {(entry === 'trainer' || entry === 'smart-fitness') && (
            <Link to="/register/trainer" className="block min-h-11 py-2 leading-none hover:text-[var(--text-primary)]">
              {t('login.registerTrainer')}
            </Link>
          )}
          {entry === 'client' && (
            <Link to="/register/client" className="block min-h-11 py-2 leading-none hover:text-[var(--text-primary)]">
              {t('login.clientAccess')}
            </Link>
          )}
        </div>
      </CardContent>
    </RoleLoginShell>
  )
}
