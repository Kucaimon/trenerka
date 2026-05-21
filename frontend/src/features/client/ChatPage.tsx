import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Paperclip } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import { useClientDashboard, useMessages, useSendMessage, queryKeys } from '@/features/api/hooks'
import { useClientProfileId } from '@/features/api/client-id'
import { markMessageRead, uploadAttachment } from '@/features/api/messages-service'
import { cn } from '@/lib/utils'
import { MobileListItem, MobileListStagger } from '@/components/mobile'

export function ChatPage() {
  const { t } = useTranslation(['client', 'common'])
  const { data: dashboard } = useClientDashboard()
  const clientId = useClientProfileId()
  const threadKey = clientId || 'self'
  const { data: messages = [], isLoading, isError, refetch } = useMessages(clientId || '', { enabled: !!clientId })
  const sendMessage = useSendMessage()
  const qc = useQueryClient()
  const [text, setText] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>()
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const unreadTrainer = messages.filter((m) => m.sender === 'trainer' && !m.read).length

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, isLoading])

  useEffect(() => {
    const unread = messages.filter((m) => m.sender === 'trainer' && !m.read)
    if (!unread.length) return
    void (async () => {
      await Promise.all(unread.map((m) => markMessageRead(m.id)))
      void qc.invalidateQueries({ queryKey: queryKeys.messages(threadKey) })
    })()
  }, [messages, qc, threadKey])

  const handleSend = async () => {
    if (!text.trim() || sendMessage.isPending || !clientId) return
    try {
      await sendMessage.mutateAsync({
        clientId,
        sender: 'client',
        text,
        attachmentUrl,
      })
      setText('')
      setAttachmentUrl(undefined)
    } catch {
      toast.error(t('chat.toast.sendError'))
    }
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadAttachment(file)
      setAttachmentUrl(url)
      toast.success(t('chat.toast.fileAttached'))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('chat.toast.uploadError'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <MobileListStagger className="flex min-h-[calc(100dvh-var(--tab-bar-height)-var(--safe-area-bottom)-8rem)] flex-col">
      <MobileListItem>
        <header className="mobile-card !py-4">
          <p className="label-caps">{t('chat.label')}</p>
          <h1 className="mt-1 font-display text-xl font-extrabold tracking-tight">
            {dashboard?.profile?.trainer ?? t('chat.defaultTrainer')}
          </h1>
          {unreadTrainer > 0 ? (
            <p className="mt-1 text-xs text-[var(--accent)]">
              {t('chat.unread', { count: unreadTrainer })}
            </p>
          ) : null}
        </header>
      </MobileListItem>

      <MobileListItem className="flex min-h-0 flex-1 flex-col">
        <div ref={scrollRef} className="mobile-recent-list flex min-h-[280px] flex-1 flex-col overflow-y-auto">
          <div className="flex flex-1 flex-col gap-3 p-4 pb-2">
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('common:actions.loading')}
              </div>
            ) : isError ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-[var(--text-muted)]">{t('chat.loadError')}</p>
                <Button variant="secondary" size="sm" onClick={() => void refetch()}>
                  {t('chat.retry')}
                </Button>
              </div>
            ) : messages.length === 0 ? (
              <p className="flex flex-1 items-center justify-center text-sm text-[var(--text-muted)]">
                {t('chat.empty')}
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                    m.sender === 'client'
                      ? 'ml-auto border border-[rgba(184,245,61,0.2)] bg-[var(--accent-dim)]'
                      : 'border border-[var(--border)] bg-[var(--surface2)]',
                    m.sender === 'trainer' && !m.read && 'ring-1 ring-[var(--accent)]/30',
                  )}
                >
                  <p>{m.text}</p>
                  {m.attachmentUrl ? (
                    <a
                      href={m.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-xs text-[var(--accent)] underline"
                    >
                      {t('chat.attachment')}
                    </a>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </MobileListItem>

      <MobileListItem className="client-chat-composer sticky bottom-0 z-10 border-t border-[var(--border)] bg-[var(--bg-base)]/95 pb-[calc(var(--safe-area-bottom,0px)+0.5rem)] pt-2 backdrop-blur-xl">
        {attachmentUrl ? (
          <p className="mb-2 truncate text-xs text-[var(--text-secondary)]">{t('chat.attached')}</p>
        ) : null}
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-full"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            aria-label={t('common:actions.upload')}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
          </Button>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="h-12 flex-1 rounded-full border-[var(--border-strong)] bg-[var(--surface2)]"
            disabled={sendMessage.isPending}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSend()
            }}
          />
          <Button
            className="h-12 rounded-full px-5"
            disabled={sendMessage.isPending || !text.trim() || !clientId}
            onClick={() => void handleSend()}
          >
            {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common:actions.send')}
          </Button>
        </div>
      </MobileListItem>
    </MobileListStagger>
  )
}
