import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { login } from '@/features/api/auth-service'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole } from '@/types'

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

type FormData = z.infer<typeof schema>

export function LoginPage({ role }: { role: UserRole }) {
  const navigate = useNavigate()
  const authLogin = useAuthStore((s) => s.login)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email:
        role === 'trainer'
          ? 'trainer@trenerka.ru'
          : role === 'client'
            ? 'client@trenerka.ru'
            : 'admin@trenerka.ru',
      password: 'demo123',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const result = await login(data.email, data.password, role)
      authLogin(result.user, result.token)
      toast.success('Добро пожаловать!')
      navigate(role === 'trainer' ? '/trainer' : role === 'client' ? '/client' : '/admin')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  const title = role === 'trainer' ? 'Вход для тренеров' : role === 'client' ? 'Вход для клиентов' : 'Вход администратора'

  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Демо: {role}@trenerka.ru / demo123</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Вход…' : 'Войти'}
          </Button>
        </form>
        <div className="mt-4 space-y-2 text-center text-sm text-[var(--text-secondary)]">
          <Link to="/reset-password" className="block hover:text-[var(--text-primary)]">
            Забыли пароль?
          </Link>
          {role === 'trainer' && (
            <Link to="/register/trainer" className="block hover:text-[var(--text-primary)]">
              Регистрация тренера
            </Link>
          )}
        </div>
      </CardContent>
    </>
  )
}
