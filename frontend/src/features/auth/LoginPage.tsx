import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { login } from '@/features/api/auth-service'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole } from '@/types'

type FormData = { email: string; password: string }

export function LoginPage({ role }: { role: UserRole }) {
  const { t } = useTranslation(['auth', 'common'])
  const navigate = useNavigate()
  const authLogin = useAuthStore((s) => s.login)
  const [loading, setLoading] = useState(false)

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

      if (role === 'trainer') {
        const complete = useAuthStore.getState().isTrainerProfileComplete()
        toast.success(t('login.welcome'))
        navigate(complete ? '/trainer' : '/trainer/profile?setup=1')
        return
      }

      toast.success(t('login.welcome'))
      navigate(role === 'client' ? '/client' : '/admin')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  const title =
    role === 'trainer' ? t('login.trainer') : role === 'client' ? t('login.client') : t('login.admin')

  const subtitle =
    role === 'trainer'
      ? t('login.subtitleTrainer')
      : role === 'client'
        ? t('login.subtitleClient')
        : t('login.subtitleAdmin')

  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('login.email')}</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t('login.password')}</Label>
            <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('login.submitting') : t('common:actions.login')}
          </Button>
        </form>
        <div className="mt-4 space-y-2 text-center text-sm text-[var(--text-secondary)]">
          <Link to="/reset-password" className="block hover:text-[var(--text-primary)]">
            {t('login.forgot')}
          </Link>
          {role === 'trainer' && (
            <Link to="/register/trainer" className="block hover:text-[var(--text-primary)]">
              {t('login.registerTrainer')}
            </Link>
          )}
        </div>
      </CardContent>
    </>
  )
}
