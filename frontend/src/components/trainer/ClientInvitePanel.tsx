import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Link2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createInviteLink } from '@/features/api/invites-service'
import type { MemberType } from '@/types'

const MEMBER_TYPES: MemberType[] = ['client', 'student', 'academy_member', 'course_buyer', 'online_trainee']

export function ClientInvitePanel() {
  const { t } = useTranslation('trainer')
  const [memberType, setMemberType] = useState<MemberType>('client')
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const link = await createInviteLink(memberType)
      setInviteUrl(link.url)
      toast.success(t('clients.invite.generated'))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('clients.invite.error'))
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async () => {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    toast.success(t('clients.invite.copied'))
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface2)] p-4">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-[var(--accent)]" />
        <p className="text-sm font-semibold">{t('clients.invite.title')}</p>
      </div>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{t('clients.invite.hint')}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">{t('clients.invite.memberType')}</Label>
          <Select value={memberType} onValueChange={(v) => setMemberType(v as MemberType)}>
            <SelectTrigger className="h-9 bg-[var(--surface3)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEMBER_TYPES.map((m) => (
                <SelectItem key={m} value={m}>
                  {t(`clients.memberType.${m}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="button" size="sm" className="w-full" disabled={loading} onClick={() => void handleGenerate()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('clients.invite.generate')}
          </Button>
        </div>
      </div>
      {inviteUrl ? (
        <div className="mt-3 flex gap-2">
          <input
            readOnly
            value={inviteUrl}
            className="h-9 min-w-0 flex-1 truncate rounded-md border border-[var(--border)] bg-[var(--surface3)] px-2 text-xs"
          />
          <Button type="button" variant="secondary" size="icon" className="h-9 w-9 shrink-0" onClick={() => void copyLink()}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
