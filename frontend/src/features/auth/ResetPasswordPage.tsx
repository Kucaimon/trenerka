import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { confirmResetPassword, resetPassword } from '@/features/api/auth-service'
import { config } from '@/lib/config'

type RequestForm = { email: string }
type ResetForm = { password: string; confirmPassword: string }

export function ResetPasswordPage() {
  const { t } = useTranslation(['auth', 'common'])
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')
  const isResetStep = Boolean(token)

  const requestSchema = useMemo(
    () => z.object({ email: z.string().email(t('validation.email')) }),
    [t],
  )

  const resetSchema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(8, t('validation.passwordMin8')),
          confirmPassword: z.string().min(8, t('validation.passwordMin8')),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('validation.passwordMismatch'),
          path: ['confirmPassword'],
        }),
    [t],
  )

  const requestForm = useForm<RequestForm>({ resolver: zodResolver(requestSchema) })
  const resetForm = useForm<ResetForm>({ resolver: zodResolver(resetSchema) })

  const onRequest = async (data: RequestForm) => {
    try {
      const result = await resetPassword(data.email)
      toast.success(t('reset.toastSent'))
      if (config.useMockData && result.resetToken) {
        const path = `/reset-password?token=${encodeURIComponent(result.resetToken)}`
        toast.info(`${t('reset.mockLinkHint')} ${path}`, { duration: 12_000 })
      }
    } catch {
      toast.error(t('reset.error'))
    }
  }

  const onReset = async (data: ResetForm) => {
    if (!token) return
    try {
      await confirmResetPassword(token, data.password)
      toast.success(t('reset.successToast'))
      resetForm.reset()
      navigate('/login/trainer', { replace: true })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('reset.error'))
    }
  }

  if (isResetStep) {
    return (
      <>
        <CardHeader>
          <CardTitle>{t('reset.newPasswordTitle')}</CardTitle>
          <CardDescription>{t('reset.newPasswordSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">{t('reset.newPassword')}</Label>
              <Input id="password" type="password" autoComplete="new-password" {...resetForm.register('password')} />
              {resetForm.formState.errors.password && (
                <p className="text-xs text-red-400">{resetForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...resetForm.register('confirmPassword')}
              />
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-xs text-red-400">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={resetForm.formState.isSubmitting}>
              {resetForm.formState.isSubmitting ? t('reset.saving') : t('reset.savePassword')}
            </Button>
          </form>
          <Link
            to="/login/trainer"
            className="mt-4 block text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            {t('reset.back')}
          </Link>
        </CardContent>
      </>
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{t('reset.title')}</CardTitle>
        <CardDescription>{t('reset.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('login.email')}</Label>
            <Input id="email" type="email" autoComplete="email" {...requestForm.register('email')} />
            {requestForm.formState.errors.email && (
              <p className="text-xs text-red-400">{requestForm.formState.errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={requestForm.formState.isSubmitting}>
            {requestForm.formState.isSubmitting ? t('reset.submitting') : t('reset.submit')}
          </Button>
        </form>
        <Link
          to="/login/trainer"
          className="mt-4 block text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          {t('reset.back')}
        </Link>
      </CardContent>
    </>
  )
}
