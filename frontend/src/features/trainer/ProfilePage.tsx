import { useAuthStore } from '@/store/auth-store'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="page-container">
      <PageHeader
        title="Профиль"
        description="Аккаунт тренера и отображаемое имя в CRM и чатах."
        actions={<Badge variant="accent">Pro</Badge>}
      />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>{user?.name ?? 'Тренер'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Имя</Label>
            <Input defaultValue={user?.name} />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue={user?.email} disabled />
          </div>
          <div>
            <Label>Специализация</Label>
            <Input placeholder="Силовой тренинг, похудение…" />
          </div>
          <Button>Сохранить</Button>
        </CardContent>
      </Card>
    </div>
  )
}
