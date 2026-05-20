import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  FileText,
  GripVertical,
  ImagePlus,
  Link2,
  Loader2,
  Plus,
  Save,
  Search,
  Timer,
  Trash2,
} from 'lucide-react'
import { getExercises, createExercise } from '@/features/api/exercises-service'
import { getProgram, saveProgram } from '@/features/api/programs-service'
import type { Exercise, Program, ProgramWorkout, WorkoutExerciseItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { displayExercise } from '@/lib/exercise-i18n'
import { uploadMedia } from '@/lib/wordpress/upload'
import { ProgramShareMenu } from '@/features/trainer/ProgramShareMenu'
import { programShareFromProgram } from '@/lib/program-share'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

type BuilderSlot = {
  key: string
  exerciseId: string
  name: string
  muscleGroup: string
  equipment: string
  sets: number
  reps: string
  restSeconds: number
  videoUrl: string
  technique: string
  imageUrl: string
  pdfUrl: string
}

function exerciseToSlot(ex: Exercise, overrides?: Partial<BuilderSlot>): BuilderSlot {
  return {
    key: `${ex.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    exerciseId: ex.id,
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    equipment: ex.equipment,
    sets: 3,
    reps: '10',
    restSeconds: 90,
    videoUrl: ex.videoUrl ?? '',
    technique: ex.technique ?? '',
    imageUrl: ex.imageUrl ?? '',
    pdfUrl: ex.pdfUrl ?? '',
    ...overrides,
  }
}

function workoutItemToSlot(ex: WorkoutExerciseItem): BuilderSlot {
  return {
    key: ex.id || `${ex.exerciseId}-${Math.random().toString(36).slice(2, 7)}`,
    exerciseId: ex.exerciseId,
    name: ex.name ?? '',
    muscleGroup: ex.muscleGroup ?? '',
    equipment: '',
    sets: ex.sets,
    reps: ex.reps,
    restSeconds: ex.restSeconds,
    videoUrl: ex.videoUrl ?? '',
    technique: ex.technique ?? '',
    imageUrl: ex.imageUrl ?? '',
    pdfUrl: ex.pdfUrl ?? '',
  }
}

function SortableExercise({
  slot,
  index,
  onRemove,
  onChange,
  onImageUpload,
  onExercisePdfUpload,
  imageUploading,
  pdfUploading,
}: {
  slot: BuilderSlot
  index: number
  onRemove: () => void
  onChange: (patch: Partial<BuilderSlot>) => void
  onImageUpload: (file: File) => void
  onExercisePdfUpload: (file: File) => void
  imageUploading: boolean
  pdfUploading: boolean
}) {
  const { t } = useTranslation('trainer')
  const imageRef = useRef<HTMLInputElement>(null)
  const pdfRef = useRef<HTMLInputElement>(null)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: slot.key })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] transition-colors hover:border-[var(--border-strong)]"
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-[var(--text-muted)] hover:text-[var(--text-secondary)] active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--surface3)] text-[11px] font-bold text-[var(--text-secondary)]">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{slot.name}</p>
          <p className="text-[11px] text-[var(--text-muted)]">
            {slot.muscleGroup}
            {slot.equipment ? ` · ${slot.equipment}` : ''}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[var(--border)] px-4 py-3">
        <div className="min-w-[70px] flex-1 rounded-lg bg-[var(--surface)] px-3 py-2">
          <Label className="text-[10px] uppercase tracking-[0.05em] text-[var(--text-muted)]">
            {t('builder.metrics.sets')}
          </Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={slot.sets}
            onChange={(e) => onChange({ sets: Math.max(1, Number(e.target.value) || 1) })}
            className="mt-0.5 h-8 border-0 bg-transparent p-0 font-display text-xl font-bold shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="min-w-[70px] flex-1 rounded-lg bg-[var(--surface)] px-3 py-2">
          <Label className="text-[10px] uppercase tracking-[0.05em] text-[var(--text-muted)]">
            {t('builder.metrics.reps')}
          </Label>
          <Input
            value={slot.reps}
            onChange={(e) => onChange({ reps: e.target.value })}
            className="mt-0.5 h-8 border-0 bg-transparent p-0 font-display text-xl font-bold shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="min-w-[70px] flex-1 rounded-lg bg-[var(--surface)] px-3 py-2">
          <Label className="text-[10px] uppercase tracking-[0.05em] text-[var(--text-muted)]">
            {t('builder.metrics.rest')}
          </Label>
          <Input
            type="number"
            min={0}
            max={600}
            value={slot.restSeconds}
            onChange={(e) => onChange({ restSeconds: Math.max(0, Number(e.target.value) || 0) })}
            className="mt-0.5 h-8 border-0 bg-transparent p-0 font-display text-xl font-bold shadow-none focus-visible:ring-0"
          />
          <span className="text-[10px] text-[var(--text-muted)]">{t('common:units.sec')}</span>
        </div>
      </div>

      <div className="space-y-2 border-t border-[var(--border)] px-4 py-3">
        <div className="space-y-1">
          <Label className="text-[11px] text-[var(--text-muted)]">{t('builder.fields.videoUrl')}</Label>
          <div className="relative">
            <Link2 className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
            <Input
              value={slot.videoUrl}
              onChange={(e) => onChange({ videoUrl: e.target.value })}
              placeholder={t('builder.fields.videoUrlPlaceholder')}
              className="h-9 pl-8 text-[13px]"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-[var(--text-muted)]">{t('builder.fields.technique')}</Label>
          <Textarea
            value={slot.technique}
            onChange={(e) => onChange({ technique: e.target.value })}
            placeholder={t('builder.fields.techniquePlaceholder')}
            rows={2}
            className="min-h-[60px] resize-y text-[13px]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onImageUpload(file)
              e.target.value = ''
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-[12px]"
            disabled={imageUploading}
            onClick={() => imageRef.current?.click()}
          >
            {imageUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {slot.imageUrl ? t('builder.fields.changePhoto') : t('builder.fields.addPhoto')}
          </Button>
          <input
            ref={pdfRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onExercisePdfUpload(file)
              e.target.value = ''
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-[12px]"
            disabled={pdfUploading}
            onClick={() => pdfRef.current?.click()}
          >
            {pdfUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
            {slot.pdfUrl ? t('builder.fields.changePdf') : t('builder.fields.addPdf')}
          </Button>
          {slot.imageUrl ? (
            <img src={slot.imageUrl} alt="" className="h-10 w-10 rounded-md border border-[var(--border)] object-cover" />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function WorkoutBuilderPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const [params] = useSearchParams()
  const programId = params.get('id')
  const qc = useQueryClient()
  const { data: library = [] } = useQuery({ queryKey: ['exercises'], queryFn: getExercises })
  const [programName, setProgramName] = useState(() => t('builder.defaultProgramName'))
  const [programDbId, setProgramDbId] = useState<string | undefined>(programId ?? undefined)
  const [programPdfUrl, setProgramPdfUrl] = useState('')
  const [programPdfUploading, setProgramPdfUploading] = useState(false)
  const [selected, setSelected] = useState<BuilderSlot[]>([])
  const [week, setWeek] = useState<(typeof DAYS)[number]>('mon')
  const [libSearch, setLibSearch] = useState('')
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customMuscle, setCustomMuscle] = useState('')
  const [customEquipment, setCustomEquipment] = useState('')
  const [customSaving, setCustomSaving] = useState(false)
  const [uploadingImageKey, setUploadingImageKey] = useState<string | null>(null)
  const [uploadingPdfKey, setUploadingPdfKey] = useState<string | null>(null)

  const dayLabels = DAYS.map((d) => t(`common:days.${d}`))

  useEffect(() => {
    if (!programId) return
    getProgram(programId).then((p) => {
      if (!p) return
      setProgramName(p.name)
      setProgramDbId(p.id)
      setProgramPdfUrl(p.pdfUrl ?? '')
      const w = p.workouts?.[0]
      if (w?.exercises?.length) {
        setSelected(w.exercises.map(workoutItemToSlot))
      }
    })
  }, [programId])

  const filteredLib = library.filter((ex) => {
    const label = displayExercise(ex, t).name
    return label.toLowerCase().includes(libSearch.toLowerCase())
  })

  const updateSlot = (key: string, patch: Partial<BuilderSlot>) => {
    setSelected((prev) => prev.map((s) => (s.key === key ? { ...s, ...patch } : s)))
  }

  const add = (ex: Exercise) => {
    if (selected.some((s) => s.exerciseId === ex.id)) return
    setSelected((prev) => [...prev, exerciseToSlot(ex)])
  }

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      const oldIndex = selected.findIndex((s) => s.key === active.id)
      const newIndex = selected.findIndex((s) => s.key === over.id)
      setSelected(arrayMove(selected, oldIndex, newIndex))
    }
  }

  const totalSets = selected.reduce((sum, s) => sum + s.sets, 0)
  const duration = selected.length ? selected.length * 9 + 12 : 0
  const weekIdx = DAYS.indexOf(week)

  const handleSave = async () => {
    setSaving(true)
    try {
      const workoutExercises: WorkoutExerciseItem[] = selected.map((slot) => ({
        id: slot.key,
        exerciseId: slot.exerciseId,
        name: slot.name,
        muscleGroup: slot.muscleGroup,
        sets: slot.sets,
        reps: slot.reps,
        restSeconds: slot.restSeconds,
        videoUrl: slot.videoUrl || undefined,
        technique: slot.technique || undefined,
        imageUrl: slot.imageUrl || undefined,
        pdfUrl: slot.pdfUrl || undefined,
      }))
      const workout: ProgramWorkout = {
        id: 'w1',
        weekNumber: 1,
        dayLabel: dayLabels[weekIdx] ?? dayLabels[0],
        title: programName,
        exercises: workoutExercises,
      }
      const program: Program = {
        id: programDbId ?? '',
        name: programName,
        description: '',
        pdfUrl: programPdfUrl || undefined,
        weeks: 4,
        workouts: [workout],
      }
      const saved = await saveProgram(program)
      setProgramDbId(saved.id)
      toast.success(t('builder.toast.saved'))
    } catch {
      toast.error(t('common:saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleProgramPdf = async (file: File) => {
    setProgramPdfUploading(true)
    try {
      const url = await uploadMedia(file)
      setProgramPdfUrl(url)
      toast.success(t('builder.toast.fileUploaded'))
    } catch {
      toast.error(t('common:saveError'))
    } finally {
      setProgramPdfUploading(false)
    }
  }

  const handleSlotImage = async (key: string, file: File) => {
    setUploadingImageKey(key)
    try {
      const url = await uploadMedia(file)
      updateSlot(key, { imageUrl: url })
      toast.success(t('builder.toast.fileUploaded'))
    } catch {
      toast.error(t('common:saveError'))
    } finally {
      setUploadingImageKey(null)
    }
  }

  const handleSlotPdf = async (key: string, file: File) => {
    setUploadingPdfKey(key)
    try {
      const url = await uploadMedia(file)
      updateSlot(key, { pdfUrl: url })
      toast.success(t('builder.toast.fileUploaded'))
    } catch {
      toast.error(t('common:saveError'))
    } finally {
      setUploadingPdfKey(null)
    }
  }

  const handleCreateCustom = async () => {
    if (!customName.trim()) return
    setCustomSaving(true)
    try {
      const created = await createExercise({
        name: customName.trim(),
        muscleGroup: customMuscle.trim() || t('builder.custom.defaultMuscle'),
        equipment: customEquipment.trim() || t('builder.custom.defaultEquipment'),
        difficulty: 'intermediate',
        isPublic: false,
      })
      await qc.invalidateQueries({ queryKey: ['exercises'] })
      add(created)
      setCustomOpen(false)
      setCustomName('')
      setCustomMuscle('')
      setCustomEquipment('')
      toast.success(t('exercisesPage.added'))
    } catch {
      toast.error(t('common:saveError'))
    } finally {
      setCustomSaving(false)
    }
  }

  const shareInput = programShareFromProgram(
    {
      id: programDbId ?? '',
      name: programName,
      weeks: 4,
      workouts: [
        {
          id: 'w1',
          weekNumber: 1,
          dayLabel: dayLabels[weekIdx] ?? dayLabels[0],
          title: programName,
          exercises: selected.map((slot) => ({
            id: slot.key,
            exerciseId: slot.exerciseId,
            sets: slot.sets,
            reps: slot.reps,
            restSeconds: slot.restSeconds,
          })),
        },
      ],
    },
    dayLabels[weekIdx],
  )

  const renderCatalogItem = (ex: Exercise) => {
    const displayed = displayExercise(ex, t)
    return (
      <button
        key={ex.id}
        type="button"
        onClick={() => add(ex)}
        className="mb-0.5 flex w-full min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2.5 text-left hover:bg-[var(--surface2)]"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{displayed.name}</p>
          <p className="truncate text-[11px] text-[var(--text-muted)]">{displayed.muscleGroup}</p>
        </div>
        <Plus className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
      </button>
    )
  }

  const catalogFooter = (
    <div className="border-t border-[var(--border)] p-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-1.5 text-[13px]"
        onClick={() => setCustomOpen(true)}
      >
        <Plus className="h-3.5 w-3.5" />
        {t('builder.customExercise')}
      </Button>
    </div>
  )

  const summaryPanel = (
    <>
      <div className="rounded-[10px] bg-[var(--surface2)] p-3.5">
        {[
          [t('builder.summary.exercises'), String(selected.length)],
          [t('builder.summary.estimatedTime'), duration ? `${duration} ${t('common:units.min')}` : '—'],
          [t('builder.summary.day'), dayLabels[weekIdx]],
          [
            t('builder.summary.volume'),
            selected.length ? t('builder.summary.volumeSets', { count: totalSets }) : '—',
          ],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0">
            <span className="text-xs text-[var(--text-muted)]">{label}</span>
            <span className="text-[13px] font-semibold">{value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] text-[var(--text-muted)]">{t('builder.fields.programPdf')}</Label>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          id="program-pdf-input"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleProgramPdf(file)
            e.target.value = ''
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
          disabled={programPdfUploading}
          onClick={() => document.getElementById('program-pdf-input')?.click()}
        >
          {programPdfUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
          {programPdfUrl ? t('builder.fields.changePdf') : t('builder.fields.addProgramPdf')}
        </Button>
        {programPdfUrl ? (
          <a
            href={programPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-[11px] text-[var(--accent)] hover:underline"
          >
            {t('builder.fields.viewPdf')}
          </a>
        ) : null}
      </div>

      <Button className="w-full" onClick={handleSave} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? t('common:actions.saving') : t('builder.save')}
      </Button>

      <ProgramShareMenu className="w-full" input={shareInput} />
    </>
  )

  return (
    <div className="builder-mobile-stack -mx-4 -my-7 flex min-h-[calc(100dvh-var(--header-height)-var(--app-content-pad-bottom))] flex-col lg:-mx-8">
      <div className="builder-catalog-mobile border-b border-[var(--border)] bg-[var(--surface)] lg:hidden">
        <button
          type="button"
          className="flex w-full min-h-[48px] items-center justify-between px-4 py-3 text-sm font-semibold"
          onClick={() => setCatalogOpen((o) => !o)}
        >
          {t('builder.catalog.mobile')}
          <Plus className={cn('h-4 w-4 text-[var(--accent)] transition-transform', catalogOpen && 'rotate-45')} />
        </button>
        {catalogOpen ? (
          <>
            <div className="border-b border-[var(--border)] px-3.5 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
                <Input
                  className="h-9 border-[var(--border)] bg-[var(--surface2)] pl-9 text-[13px]"
                  placeholder={t('builder.searchPlaceholder')}
                  value={libSearch}
                  onChange={(e) => setLibSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[30dvh] overflow-y-auto p-2">{filteredLib.map(renderCatalogItem)}</div>
            {catalogFooter}
          </>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="builder-catalog-desktop hidden w-[260px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
          <div className="border-b border-[var(--border)] px-[18px] py-4 text-[13px] font-semibold">{t('builder.catalog.desktop')}</div>
          <div className="border-b border-[var(--border)] px-3.5 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                className="h-9 border-[var(--border)] bg-[var(--surface2)] pl-9 text-[13px]"
                placeholder={t('builder.searchPlaceholder')}
                value={libSearch}
                onChange={(e) => setLibSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">{filteredLib.map(renderCatalogItem)}</div>
          {catalogFooter}
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto bg-[var(--bg-base)] p-4 md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <input
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="font-display w-full max-w-md border-none bg-transparent text-[22px] font-extrabold tracking-tight outline-none"
              aria-label={t('builder.aria.programName')}
            />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Timer className="h-4 w-4" />
                {duration ? `${duration} ${t('common:units.min')}` : `0 ${t('common:units.min')}`}
              </div>
              <ProgramShareMenu variant="icon" input={shareInput} />
              <Button className="xl:hidden" size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? t('common:actions.saving') : t('builder.save')}
              </Button>
            </div>
          </div>

          <div className="mb-5 flex gap-1 overflow-x-auto">
            {DAYS.map((d, i) => (
              <button
                key={d}
                type="button"
                onClick={() => setWeek(d)}
                className={cn(
                  'shrink-0 rounded-[8px] border px-3.5 py-1.5 text-xs font-medium transition-colors',
                  week === d
                    ? 'border-[rgba(184,245,61,0.3)] bg-[var(--accent-dim)] text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                )}
              >
                {dayLabels[i]}
              </button>
            ))}
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={selected.map((s) => s.key)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5">
                {selected.map((slot, index) => (
                  <SortableExercise
                    key={slot.key}
                    slot={slot}
                    index={index}
                    onRemove={() => setSelected(selected.filter((s) => s.key !== slot.key))}
                    onChange={(patch) => updateSlot(slot.key, patch)}
                    onImageUpload={(file) => void handleSlotImage(slot.key, file)}
                    onExercisePdfUpload={(file) => void handleSlotPdf(slot.key, file)}
                    imageUploading={uploadingImageKey === slot.key}
                    pdfUploading={uploadingPdfKey === slot.key}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {!selected.length && (
            <div className="rounded-[10px] border border-dashed border-[var(--border-strong)] bg-[var(--surface2)] py-12 text-center">
              <p className="text-sm font-medium text-[var(--text-secondary)]">{t('builder.empty.title')}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t('builder.empty.hint')}</p>
            </div>
          )}
        </main>

        <aside className="hidden w-[280px] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)] xl:flex">
          <div className="border-b border-[var(--border)] px-5 py-4 text-[13px] font-semibold">{t('builder.summary.title')}</div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">{summaryPanel}</div>
        </aside>
      </div>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('builder.customExercise')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{t('exercisesPage.name')}</Label>
              <Input value={customName} onChange={(e) => setCustomName(e.target.value)} autoFocus />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t('exercisesPage.muscleGroup')}</Label>
                <Input value={customMuscle} onChange={(e) => setCustomMuscle(e.target.value)} placeholder={t('builder.custom.defaultMuscle')} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('exercisesPage.equipment')}</Label>
                <Input value={customEquipment} onChange={(e) => setCustomEquipment(e.target.value)} placeholder={t('builder.custom.defaultEquipment')} />
              </div>
            </div>
            <Button className="w-full" disabled={customSaving || !customName.trim()} onClick={() => void handleCreateCustom()}>
              {customSaving ? t('common:actions.saving') : t('builder.custom.addAndInsert')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
