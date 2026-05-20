import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Camera, Loader2, Ruler, Scale, TrendingDown, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CHART } from '@/lib/chart-theme'
import { useClientProgress, useClientDashboard, useSaveClientProgress } from '@/features/api/hooks'
import { collectProgressPhotos } from '@/lib/client-workouts'
import { uploadMedia } from '@/lib/wordpress/upload'
import { config } from '@/lib/config'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'

export function ProgressPage() {
  const { t } = useTranslation(['client', 'common'])
  const { data: measurements = [] } = useClientProgress()
  const { data: dashboard } = useClientDashboard()
  const saveProgress = useSaveClientProgress()
  const userName = useAuthStore((s) => s.user?.name) ?? dashboard?.profile?.name ?? t('progress.defaultClient')
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [chest, setChest] = useState('')
  const [arms, setArms] = useState('')
  const [legs, setLegs] = useState('')
  const [notes, setNotes] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | undefined>()
  const [photoFile, setPhotoFile] = useState<File | undefined>()
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const latest = measurements[measurements.length - 1]
  const start = measurements[0]
  const targetWeight = start?.weight ? Math.max(start.weight - 5, 50) : undefined
  const progressPct =
    start?.weight && targetWeight && latest?.weight
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(((start.weight - latest.weight) / (start.weight - targetWeight)) * 100),
          ),
        )
      : measurements.length
        ? 10
        : 0

  const donutData = [
    { name: t('progress.donut.done'), value: Math.max(progressPct, 8) },
    { name: t('progress.donut.remaining'), value: Math.max(100 - progressPct, 8) },
  ]

  const statPills = [
    { label: t('progress.stats.startWeight'), value: start ? `${start.weight} ${t('common:units.kg')}` : '—' },
    {
      label: t('progress.stats.target'),
      value: targetWeight ? `${targetWeight} ${t('common:units.kg')}` : '—',
    },
    { label: t('progress.stats.current'), value: latest ? `${latest.weight} ${t('common:units.kg')}` : '—' },
  ]

  const galleryPhotos = collectProgressPhotos(measurements)

  const clearPhoto = () => {
    setPhotoPreview(undefined)
    setPhotoFile(undefined)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-7">
      <header>
        <p className="label-caps">{t('progress.eyebrow')}</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{t('progress.title')}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('progress.subtitle')}</p>
      </header>

      <section className="progress-donut-wrap">
        <div className="relative h-52 w-full max-w-[240px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={92}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={false}
              >
                <Cell fill={CHART.accent} />
                <Cell fill="rgba(184, 245, 61, 0.12)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="progress-donut-center">
            <p className="font-display text-lg font-extrabold tracking-tight">{userName.split(' ')[0]}</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{t('progress.donut.activity')}</p>
            <p className="mt-2 font-display text-2xl font-extrabold text-[var(--accent)]">{progressPct}%</p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-display text-lg font-bold">{t('progress.cheer.title')}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {latest && start
              ? t('progress.cheer.delta', { kg: (start.weight - latest.weight).toFixed(1) })
              : t('progress.cheer.empty')}
          </p>
        </div>
      </section>

      <section className="stat-pill-row">
        {statPills.map((pill) => (
          <div key={pill.label} className="stat-pill">
            <span className="stat-pill__value">{pill.value}</span>
            <span className="stat-pill__label">{pill.label}</span>
          </div>
        ))}
      </section>

      {measurements.length > 0 ? (
        <section className="rounded-[22px] border border-[var(--border)] bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Scale className="h-4 w-4 text-[var(--accent)]" />
            <p className="text-sm font-semibold">{t('progress.chart.weight')}</p>
          </div>
          <div className="chart-mobile h-52 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
              <AreaChart data={measurements}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="date" stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={CHART.tooltip}
                  formatter={(v) => [`${v} ${t('common:units.kg')}`, t('progress.form.weight')]}
                />
                <Area type="monotone" dataKey="weight" stroke={CHART.accent} fill="rgba(217,245,0,0.12)" strokeWidth={2} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {measurements.some((m) => m.waist) ? (
        <section className="rounded-[22px] border border-[var(--border)] bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-[var(--accent)]" />
            <p className="text-sm font-semibold">{t('progress.chart.waist')}</p>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={measurements.filter((m) => m.waist)}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="date" stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={CHART.tooltip}
                  formatter={(v) => [`${v} ${t('common:units.cm')}`, t('progress.form.waist')]}
                />
                <Line type="monotone" dataKey="waist" stroke={CHART.emerald} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      <section className="rounded-[22px] border border-[var(--border)] bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-sm font-semibold">{t('progress.form.newMeasurement')}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>{t('progress.form.weight')}</Label>
            <Input inputMode="decimal" placeholder="67.4" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('progress.form.waist')}</Label>
            <Input inputMode="numeric" placeholder="72" value={waist} onChange={(e) => setWaist(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('progress.form.hips')}</Label>
            <Input inputMode="numeric" placeholder="96" value={hips} onChange={(e) => setHips(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('progress.form.chest')}</Label>
            <Input inputMode="numeric" placeholder="88" value={chest} onChange={(e) => setChest(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('progress.form.arms')}</Label>
            <Input inputMode="numeric" placeholder="28" value={arms} onChange={(e) => setArms(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('progress.form.legs')}</Label>
            <Input inputMode="numeric" placeholder="54" value={legs} onChange={(e) => setLegs(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <Label>{t('progress.form.wellbeing')}</Label>
          <Textarea placeholder={t('progress.form.wellbeingPlaceholder')} rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="mt-3 space-y-2">
          <Label>{t('progress.form.photo')}</Label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setPhotoFile(file)
              setPhotoPreview(URL.createObjectURL(file))
            }}
          />
          {photoPreview ? (
            <div className="relative inline-block">
              <img src={photoPreview} alt="" className="h-32 w-24 rounded-xl object-cover" />
              <button
                type="button"
                className="absolute -right-2 -top-2 rounded-full border border-[var(--border)] bg-[var(--surface2)] p-1"
                onClick={clearPhoto}
                aria-label={t('progress.form.removePhoto')}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <Button type="button" variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>
              <Camera className="h-4 w-4" /> {t('progress.form.addPhoto')}
            </Button>
          )}
        </div>
        <Button
          className="mt-4 w-full"
          disabled={saveProgress.isPending || uploadingPhoto || !weight}
          onClick={async () => {
            let photos: string[] | undefined
            if (photoFile) {
              setUploadingPhoto(true)
              try {
                if (config.useMockData) {
                  photos = [URL.createObjectURL(photoFile)]
                } else {
                  photos = [await uploadMedia(photoFile)]
                }
              } catch {
                toast.error(t('progress.toast.uploadError'))
                setUploadingPhoto(false)
                return
              }
              setUploadingPhoto(false)
            }
            try {
              await saveProgress.mutateAsync({
                date: new Date().toISOString().slice(0, 10),
                weight: Number(weight),
                waist: waist ? Number(waist) : undefined,
                hips: hips ? Number(hips) : undefined,
                chest: chest ? Number(chest) : undefined,
                arms: arms ? Number(arms) : undefined,
                legs: legs ? Number(legs) : undefined,
                notes,
                photos,
              })
              toast.success(t('progress.toast.saved'))
              setWeight('')
              setWaist('')
              setHips('')
              setChest('')
              setArms('')
              setLegs('')
              setNotes('')
              clearPhoto()
            } catch {
              toast.error(t('common:saveError'))
            }
          }}
        >
          {saveProgress.isPending || uploadingPhoto ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('progress.form.save')
          )}
        </Button>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white/[0.03] p-5">
        <div className="mb-3 flex items-center gap-2">
          <Camera className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-sm font-semibold">{t('progress.photos.title')}</p>
        </div>
        {galleryPhotos.length ? (
          <div className="grid grid-cols-3 gap-2">
            {galleryPhotos.map((url, i) => (
              <a
                key={`${url}-${i}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-[3/4] overflow-hidden rounded-2xl border border-[var(--border)]"
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">{t('progress.photos.empty')}</p>
        )}
      </section>
    </div>
  )
}
