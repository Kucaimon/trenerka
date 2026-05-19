import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { registerTrainer } from '@/features/api/auth-service'
import { Mail } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Введите имя'),
  email: z.string().email(),
  password: z.string().min(8, 'Минимум 8 символов'),
})

type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const [step, setStep] = useState<'form' | 'confirm'>('form')
  const [email, setEmail] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await registerTrainer(data)
      setEmail(data.email)
      setStep('confirm')
      toast.success('Проверьте почту')
    } catch {
      toast.error('Ошибка регистрации')
    }
  }

  if (step === 'confirm') {
    return (
      <CardContent className="py-12 text-center">
        <Mail className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
        <h2 className="mt-4 text-lg font-semibold">Подтвердите email</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Ссылка отправлена на <strong className="text-[var(--text-primary)]">{email}</strong>
        </p>
        <Button className="mt-6" variant="secondary" asChild>
          <Link to="/login/trainer">Ко входу</Link>
        </Button>
      </CardContent>
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Регистрация тренера</CardTitle>
        <CardDescription>14 дней бесплатно</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Имя</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Пароль</Label>
            <Input type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full">
            Создать аккаунт
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
          Уже есть аккаунт?{' '}
          <Link to="/login/trainer" className="text-[var(--text-primary)] hover:underline">
            Войти
          </Link>
        </p>
      </CardContent>
    </>
  )
}
