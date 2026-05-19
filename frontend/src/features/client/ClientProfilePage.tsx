import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { SkillsButton } from '@/components/shared/SkillsButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function ClientProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps">Профиль</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{user?.name ?? 'Клиент'}</h1>
        <p className="mt-2 text-base text-[var(--text-secondary)]">{user?.email}</p>
      </div>
      <div className="glass-panel space-y-4 p-5">
        <p className="label-caps">Файлы и ресурсы</p>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          Документы тренера и обучающие материалы.
        </p>
        <SkillsButton fullWidth />
        <Badge variant="accent">Premium client</Badge>
        <Button
          variant="outline"
          className="mt-4 w-full gap-2"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}
