import { useMemo, useState } from 'react'
import { useIsMobile } from '@/components/mobile'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PageHeader } from '@/components/shared/page-header'
import { useEvents, useSaveEvent } from '@/features/api/hooks'
import { completeEvent, copyRecurringEvent } from '@/features/api/calendar-service'
import type { CalendarEvent } from '@/types'

export function CalendarPage() {
  const isMobile = useIsMobile()
  const { data: apiEvents = [], isLoading } = useEvents()
  const saveEvent = useSaveEvent()
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const events: EventInput[] = useMemo(
    () =>
      apiEvents.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        borderColor: 'transparent',
        backgroundColor: e.color || 'var(--bg-muted)',
      })),
    [apiEvents],
  )

  const handleDrop = async (info: EventDropArg) => {
    const existing = apiEvents.find((e) => e.id === info.event.id)
    if (!existing) return
    const updated: CalendarEvent = {
      ...existing,
      start: info.event.start?.toISOString() ?? existing.start,
      end: info.event.end?.toISOString() ?? existing.end,
    }
    try {
      await saveEvent.mutateAsync(updated)
      toast.success('Расписание обновлено')
    } catch {
      info.revert()
      toast.error('Не удалось сохранить')
    }
  }

  const onDateSelect = (info: DateSelectArg) => {
    setTitle('')
    setStart(info.startStr)
    setEnd(info.endStr)
    setSelectedEvent(null)
    setCreateOpen(true)
  }

  const onEventClick = (info: EventClickArg) => {
    const existing = apiEvents.find((e) => e.id === info.event.id)
    if (existing) setSelectedEvent(existing)
  }

  const submitNew = async () => {
    if (!title.trim()) return
    try {
      await saveEvent.mutateAsync({
        id: `e-new-${Date.now()}`,
        title,
        start,
        end,
        type: 'training',
      })
      toast.success('Событие создано')
      setCreateOpen(false)
    } catch {
      toast.error('Ошибка создания')
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Календарь"
        description="Перетаскивайте события или выделите слот для нового."
        actions={<span className="text-sm text-[var(--text-muted)]">{apiEvents.length} событий</span>}
      />
      <Card className="premium-panel calendar-mobile-wrap">
        <CardContent className="p-3 md:p-4 [&_.fc]:text-[var(--text-primary)]">
          {isLoading ? (
            <p className="py-12 text-center text-sm text-[var(--text-muted)]">Загрузка…</p>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: isMobile ? 'timeGridDay,dayGridMonth' : 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={events}
              editable
              selectable
              select={onDateSelect}
              eventClick={onEventClick}
              eventDrop={handleDrop}
              locale="ru"
              height={isMobile ? 'auto' : 640}
              contentHeight={isMobile ? 480 : undefined}
              slotMinTime="07:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
            />
          )}
        </CardContent>
      </Card>

      {selectedEvent ? (
        <Card className="mt-4 p-4">
          <p className="font-medium">{selectedEvent.title}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {new Date(selectedEvent.start).toLocaleString('ru')} — {new Date(selectedEvent.end).toLocaleString('ru')}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await completeEvent(selectedEvent.id)
                toast.success('Отмечено выполненным')
                setSelectedEvent(null)
              }}
            >
              Выполнено
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await copyRecurringEvent(selectedEvent.id)
                toast.success('Копия на следующую неделю')
                setSelectedEvent(null)
              }}
            >
              Копировать +7 дней
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedEvent(null)}>
              Закрыть
            </Button>
          </div>
        </Card>
      ) : null}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новое событие</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Название</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <Button className="w-full" onClick={submitNew}>
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
