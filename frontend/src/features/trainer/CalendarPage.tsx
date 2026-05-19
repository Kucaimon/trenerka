import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { formatDateTime } from '@/lib/i18n-format'
import type { CalendarEvent } from '@/types'

export function CalendarPage() {
  const { t, i18n } = useTranslation(['trainer', 'common'])
  const isMobile = useIsMobile()
  const { data: apiEvents = [], isLoading } = useEvents()
  const saveEvent = useSaveEvent()
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const fcLocale = i18n.language === 'ru' ? 'ru' : i18n.language.startsWith('zh') ? 'zh-cn' : i18n.language.split('-')[0]

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
      toast.success(t('calendar.toast.updated'))
    } catch {
      info.revert()
      toast.error(t('calendar.toast.saveFailed'))
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
      toast.success(t('calendar.toast.created'))
      setCreateOpen(false)
    } catch {
      toast.error(t('calendar.toast.createError'))
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title={t('calendar.title')}
        description={t('calendar.description')}
        actions={<span className="text-sm text-[var(--text-muted)]">{t('calendar.eventCount', { count: apiEvents.length })}</span>}
      />
      <Card className="premium-panel calendar-mobile-wrap">
        <CardContent className="p-3 md:p-4 [&_.fc]:text-[var(--text-primary)]">
          {isLoading ? (
            <p className="py-12 text-center text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
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
              locale={fcLocale}
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
            {formatDateTime(selectedEvent.start, i18n.language)} — {formatDateTime(selectedEvent.end, i18n.language)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await completeEvent(selectedEvent.id)
                toast.success(t('calendar.toast.completed'))
                setSelectedEvent(null)
              }}
            >
              {t('calendar.detail.complete')}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await copyRecurringEvent(selectedEvent.id)
                toast.success(t('calendar.toast.copied'))
                setSelectedEvent(null)
              }}
            >
              {t('calendar.detail.copyWeek')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedEvent(null)}>
              {t('common:actions.close')}
            </Button>
          </div>
        </Card>
      ) : null}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('calendar.create.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{t('calendar.create.name')}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <Button className="w-full" onClick={submitNew}>
              {t('common:actions.create')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
