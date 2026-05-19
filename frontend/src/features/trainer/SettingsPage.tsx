import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <Card>
        <CardHeader><CardTitle>Профиль тренера</CardTitle></CardHeader>
        <CardContent className="max-w-md space-y-4">
          <div><Label>Имя</Label><Input defaultValue={user?.name} /></div>
          <div><Label>Email</Label><Input defaultValue={user?.email} disabled /></div>
          <Button>Сохранить</Button>
        </CardContent>
      </Card>
    </div>
  )
}
