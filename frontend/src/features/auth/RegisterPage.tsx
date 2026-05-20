import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { registerTrainer } from '@/features/api/auth-service'
import { config } from '@/lib/config'
import { Mail } from 'lucide-react'

type FormData = { email: string; password: string; confirmPassword: string }

export function RegisterPage() {
  const { t } = useTranslation(['auth', 'common'])
  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [email, setEmail] = useState('')
  const [verifyLink, setVerifyLink] = useState<string | null>(null)

  const schema = z
    .object({
      email: z.string().email(t('validation.email')),
      password: z.string().min(8, t('validation.passwordMin8')),
      confirmPassword: z.string().min(8, t('validation.passwordMin8')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const result = await registerTrainer({ email: data.email, password: data.password })
      setEmail(data.email)
      if (config.useMockData && result.verifyToken) {
        setVerifyLink(`/verify-email?token=${encodeURIComponent(result.verifyToken)}`)
      } else {
        setVerifyLink(null)
      }
      setStep('confirm')
      toast.success(t('register.checkEmail'))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('register.error'))
    }
  }

  if (step === 'confirm') {
    return (
      <CardContent className="py-12 text-center">
        <Mail className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <h2 className="mt-4 text-lg font-semibold">{t('register.confirmTitle')}</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {t('register.confirmText')}{' '}
          <strong className="text-[var(--text-primary)]">{email}</strong>
        </p>
        {verifyLink && config.useMockData && (
          <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-xs text-[var(--text-secondary)]">
            {t('register.mockVerifyHint')}{' '}
            <Link to={verifyLink} className="font-medium text-[var(--accent)] hover:underline">
              {t('register.mockVerifyLink')}
            </Link>
          </p>
        )}
        <Button className="mt-6" variant="secondary" asChild>
          <Link to="/login/trainer">{t('register.backToLogin')}</Link>
        </Button>
      </CardContent>
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{t('register.title')}</CardTitle>
        <CardDescription>{t('register.subtitle')}</CardDescription>
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
            <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('register.submitting') : t('register.create')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
          {t('register.hasAccount')}{' '}
          <Link to="/login/trainer" className="text-[var(--text-primary)] hover:underline">
            {t('common:actions.login')}
          </Link>
        </p>
      </CardContent>
    </>
  )
}
