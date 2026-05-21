import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Paperclip } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SaasPageHeader } from '@/components/saas'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth-store'
import { useClients, useMessageUnreadCounts, useMessages, useSendMessage, queryKeys } from '@/features/api/hooks'
import { isGroupThread } from '@/features/api/messages-service'
import { markMessageRead, uploadAttachment } from '@/features/api/messages-service'
import { useIsMobile } from '@/components/mobile'
import { cn } from '@/lib/utils'

const TEMPLATE_KEYS = ['workoutReminder', 'greatSession', 'hydration', 'programUpdated'] as const

export function MessagesPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const isMobile = useIsMobile()
  const { data: clients = [] } = useClients()
  const { data: unreadCounts = {} } = useMessageUnreadCounts()
  const groupTitle = useAuthStore((s) => s.trainerProfile?.groupChatTitle?.trim()) || t('messages.groupThread')
  const GROUP_ID = '0'
  const [selectedClient, setSelectedClient] = useState<string | null>(GROUP_ID)
  const activeClient = selectedClient ?? GROUP_ID
  const isGroup = isGroupThread(activeClient)
  const [showList, setShowList] = useState(true)
  const qc = useQueryClient()
  const { data: msgs = [] } = useMessages(activeClient, { thread: isGroup ? 'group' : undefined, enabled: isGroup || !!activeClient })
  const sendMessage = useSendMessage()
  const [text, setText] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>()
  const client = clients.find((c) => c.id === activeClient)

  useEffect(() => {
    const unread = msgs.filter((m) => m.sender === 'client' && !m.read)
    if (!unread.length || !activeClient) return
    let cancelled = false
    void (async () => {
      try {
        await Promise.all(unread.map((m) => markMessageRead(m.id)))
        if (cancelled) return
        const threadKey = isGroupThread(activeClient) ? 'group' : activeClient
        void qc.invalidateQueries({ queryKey: queryKeys.messages(threadKey) })
        void qc.invalidateQueries({ queryKey: queryKeys.messageUnreadCounts })
        void qc.invalidateQueries({ queryKey: queryKeys.trainerAnalytics })
      } catch {
        /* non-blocking */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [msgs, activeClient, qc])

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
      await sendMessage.mutateAsync({
        clientId: activeClient,
        sender: 'trainer',
        text,
        attachmentUrl,
        ...(isGroup ? { thread: 'group' as const } : {}),
      })
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
      <SaasPageHeader
        title={t('messages.title')}
        breadcrumbs={[
          { label: t('dashboard.breadcrumb.app'), href: '/trainer' },
          { label: t('messages.title') },
        ]}
      />
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-3">
        <Card className={cn('flex flex-col overflow-hidden p-0', isMobile && !showMobileList && 'hidden', isMobile && showMobileList && 'flex-1')}>
          <ScrollArea className="flex-1">
            <button
              type="button"
              onClick={() => {
                setSelectedClient(GROUP_ID)
                if (isMobile) setShowList(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-left transition-colors hover:bg-white/[0.03]',
                activeClient === GROUP_ID && 'border-l-2 border-l-[var(--accent)] bg-white/[0.03]',
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{groupTitle}</p>
                <p className="truncate text-xs text-[var(--text-muted)]">{t('messages.groupHint')}</p>
              </div>
              {(unreadCounts[GROUP_ID] ?? 0) > 0 ? (
                <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-[#111]">
                  {unreadCounts[GROUP_ID]}
                </span>
              ) : null}
            </button>
            {clients.map((c) => {
              const unread = unreadCounts[c.id] ?? 0
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedClient(c.id)
                    if (isMobile) setShowList(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-left transition-colors hover:bg-white/[0.03]',
                    activeClient === c.id && 'border-l-2 border-l-[var(--accent)] bg-white/[0.03]',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-[var(--text-muted)]">{c.email}</p>
                  </div>
                  {unread > 0 ? (
                    <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-[#111]">
                      {unread}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </ScrollArea>
        </Card>

        <Card className={cn('flex flex-col overflow-hidden p-0 lg:col-span-2', isMobile && !showMobileChat && 'hidden', isMobile && showMobileChat && 'flex-1')}>
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
            {isMobile ? (
              <button type="button" className="touch-target flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/5" onClick={() => setShowList(true)} aria-label={t('common:actions.backToList')}>
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : null}
            <p className="text-sm font-medium">
              {isGroup ? groupTitle : (client?.name ?? t('messages.selectClient'))}
            </p>
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
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </label>
              <Input placeholder={t('messages.placeholder')} className="flex-1" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
              <Button onClick={handleSend} disabled={sendMessage.isPending || !activeClient}>{t('common:actions.send')}</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
