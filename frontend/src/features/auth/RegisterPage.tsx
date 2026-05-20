import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import { registerClient, registerTrainer } from '@/features/api/auth-service'
import { config } from '@/lib/config'
import type { UserRole } from '@/types'
import { Mail, UserPlus } from 'lucide-react'

type TrainerFormData = { fullName: string; email: string; password: string; confirmPassword: string }
type ClientFormData = { email: string; password: string; confirmPassword: string }
type FormData = TrainerFormData | ClientFormData

export function RegisterPage({ role }: { role: UserRole }) {
  const { t } = useTranslation(['auth', 'common'])
  const isTrainer = role === 'trainer'
  const canSelfRegister = isTrainer || config.useMockData
  const loginPath = isTrainer ? '/login/trainer' : '/login/client'

  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [email, setEmail] = useState('')
  const [verifyLink, setVerifyLink] = useState<string | null>(null)

  const trainerSchema = z
    .object({
      fullName: z.string().min(2, t('common:validation.nameMin2')),
      email: z.string().email(t('validation.email')),
      password: z.string().min(8, t('validation.passwordMin8')),
      confirmPassword: z.string().min(8, t('validation.passwordMin8')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    })

  const clientSchema = z
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
  } = useForm<TrainerFormData | ClientFormData>({
    resolver: zodResolver(isTrainer ? trainerSchema : clientSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (isTrainer) {
        const result = await registerTrainer({
          email: data.email,
          password: data.password,
          fullName: 'fullName' in data ? data.fullName : undefined,
        })
        setEmail(data.email)
        if (config.useMockData && result.verifyToken) {
          setVerifyLink(`/verify-email?token=${encodeURIComponent(result.verifyToken)}`)
        } else {
          setVerifyLink(null)
        }
        setStep('confirm')
        toast.success(t('register.checkEmail'))
        return
      }

      await registerClient({ email: data.email, password: data.password })
      setEmail(data.email)
      setVerifyLink(null)
      setStep('confirm')
      toast.success(t('register.clientSuccess'))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('register.error'))
    }
  }

  if (!canSelfRegister) {
    return (
      <CardContent className="py-12 text-center">
        <UserPlus className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <h2 className="mt-4 text-lg font-semibold">{t('register.clientInviteTitle')}</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{t('register.clientInviteText')}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to={loginPath}>{t('register.clientGoLogin')}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/reset-password">{t('login.forgot')}</Link>
          </Button>
        </div>
      </CardContent>
    )
  }

  if (step === 'confirm') {
    return (
      <CardContent className="py-12 text-center">
        <Mail className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <h2 className="mt-4 text-lg font-semibold">
          {isTrainer ? t('register.confirmTitle') : t('register.clientConfirmTitle')}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {isTrainer ? (
            <>
              {t('register.confirmText')}{' '}
              <strong className="text-[var(--text-primary)]">{email}</strong>
            </>
          ) : (
            t('register.clientConfirmText', { email })
          )}
        </p>
        {verifyLink && config.useMockData && isTrainer && (
          <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-xs text-[var(--text-secondary)]">
            {t('register.mockVerifyHint')}{' '}
            <Link to={verifyLink} className="font-medium text-[var(--accent)] hover:underline">
              {t('register.mockVerifyLink')}
            </Link>
          </p>
        )}
        <Button className="mt-6" variant="secondary" asChild>
          <Link to={loginPath}>{t('register.backToLogin')}</Link>
        </Button>
      </CardContent>
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{isTrainer ? t('register.title') : t('register.clientTitle')}</CardTitle>
        <CardDescription>
          {isTrainer ? t('register.subtitle') : t('register.clientSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isTrainer ? (
            <div className="space-y-1.5">
              <Label htmlFor="fullName">{t('register.fullName')}</Label>
              <Input id="fullName" autoComplete="name" {...register('fullName')} />
              {'fullName' in errors && errors.fullName && (
                <p className="text-xs text-red-400">{errors.fullName.message}</p>
              )}
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('login.email')}</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t('login.password')}</Label>
            <PasswordInput id="password" autoComplete="new-password" {...register('password')} />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
            <PasswordInput
              id="confirmPassword"
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
          <Link to={loginPath} className="text-[var(--text-primary)] hover:underline">
            {t('common:actions.login')}
          </Link>
        </p>
      </CardContent>
    </>
  )
}
