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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SaasPageHeader } from '@/components/saas'
import { useClients, useEvents, useSaveEvent } from '@/features/api/hooks'
import { completeEvent, copyRecurringEvent } from '@/features/api/calendar-service'
import { formatDateTime } from '@/lib/i18n-format'
import type { CalendarEvent, CalendarEventType } from '@/types'

export function CalendarPage() {
  const { t, i18n } = useTranslation(['trainer', 'common'])
  const isMobile = useIsMobile()
  const { data: apiEvents = [], isLoading } = useEvents()
  const { data: clients = [] } = useClients()
  const saveEvent = useSaveEvent()
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clientId, setClientId] = useState('')
  const [eventType, setEventType] = useState<CalendarEventType>('training')
  const [recurring, setRecurring] = useState(false)

  const fcLocale = i18n.language === 'ru' ? 'ru' : i18n.language.startsWith('zh') ? 'zh-cn' : i18n.language.split('-')[0]

  const events: EventInput[] = useMemo(
    () =>
      apiEvents.map((e) => ({
        id: e.id,
        title: e.recurring ? `${e.title} ↻` : e.title,
        start: e.start,
        end: e.end,
        borderColor: e.recurring ? 'var(--accent)' : 'transparent',
        backgroundColor: e.color || 'var(--bg-muted)',
        extendedProps: { recurring: e.recurring },
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
    setClientId(clients[0]?.id ?? '')
    setEventType('training')
    setRecurring(false)
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
        clientId: clientId || undefined,
        type: eventType,
        recurring: recurring || undefined,
      })
      toast.success(t('calendar.toast.created'))
      setCreateOpen(false)
    } catch {
      toast.error(t('calendar.toast.createError'))
    }
  }

  return (
    <div className="page-container">
      <SaasPageHeader
        title={t('calendar.title')}
        description={t('calendar.description')}
        breadcrumbs={[
          { label: t('dashboard.breadcrumb.app'), href: '/trainer' },
          { label: t('calendar.title') },
        ]}
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
          {selectedEvent.recurring ? (
            <p className="mt-2 inline-flex rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2 py-0.5 text-xs text-[var(--accent)]">
              {t('calendar.detail.recurringBadge')}
            </p>
          ) : null}
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
              className="touch-target"
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
            <div className="space-y-1.5">
              <Label>{t('calendar.create.client')}</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('calendar.create.clientPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('calendar.create.eventType')}</Label>
              <Select value={eventType} onValueChange={(v) => setEventType(v as CalendarEventType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">{t('calendar.eventTypes.training')}</SelectItem>
                  <SelectItem value="consultation">{t('calendar.eventTypes.consultation')}</SelectItem>
                  <SelectItem value="group">{t('calendar.eventTypes.group')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">{t('calendar.create.recurring')}</span>
            </label>
            <Button className="touch-target w-full" onClick={submitNew} disabled={!title.trim() || saveEvent.isPending}>
              {t('common:actions.create')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
