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
import { Mail } from 'lucide-react'

type FormData = { name: string; email: string; password: string }

export function RegisterPage() {
  const { t } = useTranslation(['auth', 'common'])
  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [email, setEmail] = useState('')

  const schema = z.object({
    name: z.string().min(2, t('validation.name')),
    email: z.string().email(t('validation.email')),
    password: z.string().min(8, t('validation.passwordMin8')),
  })

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await registerTrainer(data)
      setEmail(data.email)
      setStep('confirm')
      toast.success(t('register.checkEmail'))
    } catch {
      toast.error(t('register.error'))
    }
  }

  if (step === 'confirm') {
    return (
      <CardContent className="py-12 text-center">
        <Mail className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <h2 className="mt-4 text-lg font-semibold">{t('register.confirmTitle')}</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {t('register.confirmText')} <strong className="text-[var(--text-primary)]">{email}</strong>
        </p>
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
            <Label>{t('register.name')}</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>{t('login.password')}</Label>
            <Input type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full">
            {t('register.create')}
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
