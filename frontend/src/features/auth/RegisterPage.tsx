import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
import { registerClient, registerTrainer, resendVerificationEmail } from '@/features/api/auth-service'
import { validateInviteToken } from '@/features/api/invites-service'
import { config } from '@/lib/config'
import type { MemberType, UserRole } from '@/types'
import { Link2, Mail, MessageCircle, UserPlus } from 'lucide-react'
import { RoleLoginShell } from '@/features/auth/RoleLoginShell'
import type { LoginEntry } from '@/lib/auth/role-session'

type TrainerFormData = { fullName: string; email: string; password: string; confirmPassword: string }
type ClientFormData = { email: string; password: string; confirmPassword: string }
type FormData = TrainerFormData | ClientFormData

export function RegisterPage({ role }: { role: UserRole }) {
  const { t } = useTranslation(['auth', 'common'])
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get('invite') ?? ''
  const isTrainer = role === 'trainer'
  const canSelfRegister = isTrainer || config.useMockData || Boolean(inviteToken)
  const loginPath = isTrainer ? '/login/trainer' : '/login/client'
  const shellEntry: LoginEntry = isTrainer ? 'smart-fitness' : 'client'

  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [email, setEmail] = useState('')
  const [verifyLink, setVerifyLink] = useState<string | null>(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [inviteValid, setInviteValid] = useState<boolean | null>(null)
  const [inviteMemberType, setInviteMemberType] = useState<MemberType>('client')

  useEffect(() => {
    if (!inviteToken || isTrainer) return
    void validateInviteToken(inviteToken).then((res) => {
      setInviteValid(res.valid)
      if (res.memberType) setInviteMemberType(res.memberType)
    })
  }, [inviteToken, isTrainer])

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

      if (inviteToken && inviteValid === false) {
        toast.error(t('register.clientInviteInvalid'))
        return
      }

      await registerClient({
        email: data.email,
        password: data.password,
        inviteToken: inviteToken || undefined,
        memberType: inviteMemberType,
      })
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
      <RoleLoginShell entry="client">
        <CardContent className="px-5 py-8 sm:px-6 sm:py-10">
          <div className="text-center">
            <UserPlus className="mx-auto h-10 w-10 text-[var(--blue)]" strokeWidth={1.5} />
            <h2 className="mt-4 text-lg font-semibold">{t('register.clientAccessTitle')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {t('register.clientAccessIntro')}
            </p>
          </div>
          <ol className="mt-6 space-y-3 text-sm">
            <li className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface2)]/60 px-3 py-3">
              <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--blue)]" aria-hidden />
              <span className="text-[var(--text-secondary)]">{t('register.clientAccessPathInvite')}</span>
            </li>
            <li className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface2)]/60 px-3 py-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
              <span className="text-[var(--text-secondary)]">{t('register.clientAccessPathTrainer')}</span>
            </li>
            <li className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface2)]/60 px-3 py-3">
              <UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
              <span className="text-[var(--text-secondary)]">{t('register.clientAccessPathCrm')}</span>
            </li>
          </ol>
          <div className="mt-6 flex flex-col gap-2">
            <Button className="touch-target h-11 w-full" asChild>
              <Link to={loginPath}>{t('register.clientGoLogin')}</Link>
            </Button>
            <Button variant="secondary" className="touch-target h-11 w-full" asChild>
              <Link to="/login">{t('hub.changeRole')}</Link>
            </Button>
          </div>
        </CardContent>
      </RoleLoginShell>
    )
  }

  if (step === 'confirm') {
    return (
      <RoleLoginShell entry={shellEntry}>
      <CardContent className="px-5 py-12 text-center sm:px-6">
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
        {!isTrainer ? (
          <p className="mt-3 text-xs text-[var(--text-muted)]">{t('register.clientOnboardingHint')}</p>
        ) : null}
        {verifyLink && config.useMockData && isTrainer && (
          <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-xs text-[var(--text-secondary)]">
            {t('register.mockVerifyHint')}{' '}
            <Link to={verifyLink} className="font-medium text-[var(--accent)] hover:underline">
              {t('register.mockVerifyLink')}
            </Link>
          </p>
        )}
        {isTrainer ? (
          <Button
            className="touch-target mt-4 h-11 w-full"
            variant="outline"
            disabled={resendLoading}
            onClick={async () => {
              setResendLoading(true)
              try {
                const res = await resendVerificationEmail(email)
                if (res.alreadyVerified) {
                  toast.info(t('register.alreadyVerified'))
                } else {
                  toast.success(t('register.resendSent'))
                }
              } catch (e) {
                toast.error(e instanceof Error ? e.message : t('register.resendError'))
              } finally {
                setResendLoading(false)
              }
            }}
          >
            {resendLoading ? t('register.resending') : t('register.resendVerification')}
          </Button>
        ) : null}
        <Button className="touch-target mt-3 h-11 w-full" variant="secondary" asChild>
          <Link to={!isTrainer && inviteToken ? `${loginPath}?onboarding=profile` : loginPath}>
            {t('register.backToLogin')}
          </Link>
        </Button>
      </CardContent>
      </RoleLoginShell>
    )
  }

  if (!isTrainer && inviteToken && inviteValid === false) {
    return (
      <RoleLoginShell entry="client">
      <CardContent className="px-5 py-12 text-center sm:px-6">
        <h2 className="text-lg font-semibold">{t('register.clientInviteInvalid')}</h2>
        <Button className="touch-target mt-6 h-11" variant="secondary" asChild>
          <Link to={loginPath}>{t('register.clientGoLogin')}</Link>
        </Button>
      </CardContent>
      </RoleLoginShell>
    )
  }

  return (
    <RoleLoginShell entry={shellEntry}>
      <CardHeader className="px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
        <CardTitle>{isTrainer ? t('register.title') : t('register.clientTitle')}</CardTitle>
        <CardDescription>
          {isTrainer
            ? t('register.subtitle')
            : inviteToken
              ? t('register.clientInviteSubtitle')
              : t('register.clientSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
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
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || (!isTrainer && Boolean(inviteToken) && inviteValid === null)}
          >
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
    </RoleLoginShell>
  )
}
