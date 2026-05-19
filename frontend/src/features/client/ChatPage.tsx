import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useClientDashboard, useSendMessage } from '@/features/api/hooks'
import { useQuery } from '@tanstack/react-query'
import { getMessages } from '@/features/api/messages-service'
import { cn } from '@/lib/utils'
import { MobileListItem, MobileListStagger } from '@/components/mobile'

export function ChatPage() {
  const { data: dashboard } = useClientDashboard()
  const { data: messages = [] } = useQuery({
    queryKey: ['client-messages', 'c1'],
    queryFn: () => getMessages('c1'),
  })
  const sendMessage = useSendMessage()
  const [text, setText] = useState('')

  const handleSend = async () => {
    if (!text.trim()) return
    try {
      await sendMessage.mutateAsync({ clientId: 'c1', sender: 'client', text })
      setText('')
    } catch {
      toast.error('Не удалось отправить')
    }
  }

  return (
    <MobileListStagger className="flex min-h-[calc(100dvh-var(--tab-bar-height)-var(--safe-area-bottom)-8rem)] flex-col">
      <MobileListItem>
        <header className="mobile-card !py-4">
          <p className="label-caps">Чат</p>
          <h1 className="mt-1 font-display text-xl font-extrabold tracking-tight">
            {dashboard?.profile.trainer ?? 'Тренер'}
          </h1>
        </header>
      </MobileListItem>

      <MobileListItem className="flex min-h-0 flex-1 flex-col">
        <div className="mobile-recent-list flex min-h-[280px] flex-1 flex-col overflow-y-auto">
          <div className="flex flex-1 flex-col gap-3 p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                  m.sender === 'client'
                    ? 'ml-auto border border-[rgba(184,245,61,0.2)] bg-[var(--accent-dim)]'
                    : 'border border-[var(--border)] bg-[var(--surface2)]',
                )}
              >
                {m.text}
              </div>
            ))}
          </div>
        </div>
      </MobileListItem>

      <MobileListItem>
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Сообщение…"
            className="h-12 flex-1 rounded-full border-[var(--border-strong)] bg-[var(--surface2)]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSend()
            }}
          />
          <Button className="h-12 rounded-full px-5" onClick={() => void handleSend()}>
            Отправить
          </Button>
        </div>
      </MobileListItem>
    </MobileListStagger>
  )
}
