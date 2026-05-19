import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { resetPassword } from '@/features/api/auth-service'

const schema = z.object({ email: z.string().email() })

export function ResetPasswordPage() {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await resetPassword(data.email)
    toast.success('Инструкции отправлены на email')
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Сброс пароля</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" {...register('email')} />
          </div>
          <Button type="submit" className="w-full">
            Отправить ссылку
          </Button>
        </form>
        <Link to="/login/trainer" className="mt-4 block text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          Назад
        </Link>
      </CardContent>
    </>
  )
}
