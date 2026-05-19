import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Paperclip } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageHeader } from '@/components/shared/page-header'
import { useClients, useMessages, useSendMessage } from '@/features/api/hooks'
import { uploadAttachment } from '@/features/api/messages-service'
import { useIsMobile } from '@/components/mobile'
import { cn } from '@/lib/utils'

const TEMPLATE_KEYS = ['workoutReminder', 'greatSession', 'hydration', 'programUpdated'] as const

export function MessagesPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const isMobile = useIsMobile()
  const { data: clients = [] } = useClients()
  const [activeClient, setActiveClient] = useState(clients[0]?.id ?? '')
  const [showList, setShowList] = useState(true)
  const { data: msgs = [] } = useMessages(activeClient)
  const sendMessage = useSendMessage()
  const [text, setText] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>()
  const client = clients.find((c) => c.id === activeClient)

  const templates = useMemo(
    () =>
      TEMPLATE_KEYS.map((key) => ({
        key,
        text: t(`messages.templates.${key}`, { time: '10:00' }),
      })),
    [t],
  )

  const handleSend = async () => {
    if (!text.trim() || !activeClient) return
    try {
      await sendMessage.mutateAsync({ clientId: activeClient, sender: 'trainer', text, attachmentUrl })
      setText('')
      setAttachmentUrl(undefined)
      toast.success(t('messages.toast.sent'))
    } catch {
      toast.error(t('messages.toast.sendError'))
    }
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const url = await uploadAttachment(file)
      setAttachmentUrl(url)
      toast.success(t('messages.toast.fileAttached'))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('messages.toast.uploadError'))
    }
  }

  const showMobileList = !isMobile || showList
  const showMobileChat = !isMobile || !showList

  return (
    <div className="page-container messages-mobile flex flex-col">
      <PageHeader title={t('messages.title')} />
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-3">
        <Card className={cn('flex flex-col overflow-hidden p-0', isMobile && !showMobileList && 'hidden', isMobile && showMobileList && 'flex-1')}>
          <ScrollArea className="flex-1">
            {clients.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveClient(c.id)
                  if (isMobile) setShowList(false)
                }}
                className={cn(
                  'w-full border-b border-[var(--border)] px-4 py-3 text-left transition-colors hover:bg-white/[0.03]',
                  activeClient === c.id && 'border-l-2 border-l-[var(--accent)] bg-white/[0.03]',
                )}
              >
                <p className="text-sm font-medium">{c.name}</p>
                <p className="truncate text-xs text-[var(--text-muted)]">{c.email}</p>
              </button>
            ))}
          </ScrollArea>
        </Card>

        <Card className={cn('flex flex-col overflow-hidden p-0 lg:col-span-2', isMobile && !showMobileChat && 'hidden', isMobile && showMobileChat && 'flex-1')}>
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
            {isMobile ? (
              <button type="button" className="touch-target flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/5" onClick={() => setShowList(true)} aria-label={t('common:actions.backToList')}>
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : null}
            <p className="text-sm font-medium">{client?.name ?? t('messages.selectClient')}</p>
          </div>
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-3">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                    m.sender === 'trainer'
                      ? 'ml-auto border border-[var(--border)] bg-[var(--bg-muted)]'
                      : 'border border-[var(--border)] bg-[var(--bg-elevated)]',
                  )}
                >
                  {m.text}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t border-[var(--border)] p-4">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {templates.map((tpl) => (
                <Button key={tpl.key} variant="secondary" size="sm" className="h-7 text-xs" onClick={() => setText(tpl.text)}>
                  {tpl.text.length > 30 ? `${tpl.text.slice(0, 30)}…` : tpl.text}
                </Button>
              ))}
            </div>
            {attachmentUrl ? (
              <p className="mb-2 truncate text-xs text-[var(--accent)]">{t('messages.attachment', { url: attachmentUrl.slice(0, 48) })}…</p>
            ) : null}
            <div className="flex gap-2">
              <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] hover:bg-white/5">
                <Paperclip className="h-4 w-4" />
                <input type="file" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
              <Input placeholder={t('messages.placeholder')} className="flex-1" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
              <Button onClick={handleSend} disabled={sendMessage.isPending}>{t('common:actions.send')}</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
