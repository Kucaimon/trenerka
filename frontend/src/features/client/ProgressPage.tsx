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
import { Camera, Download, Menu, Ruler, Scale, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CHART } from '@/lib/chart-theme'
import { useClientProgress, useClientDashboard, useSaveClientProgress } from '@/features/api/hooks'
import { toast } from 'sonner'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'

export function ProgressPage() {
  const { data: measurements = [] } = useClientProgress()
  const { data: dashboard } = useClientDashboard()
  const saveProgress = useSaveClientProgress()
  const userName = useAuthStore((s) => s.user?.name) ?? dashboard?.profile?.name ?? 'Клиент'
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [chest, setChest] = useState('')
  const [notes, setNotes] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const latest = measurements[measurements.length - 1]
  const start = measurements[0]
  const targetWeight = 65
  const progressPct = start?.weight
    ? Math.min(100, Math.round(((start.weight - (latest?.weight ?? start.weight)) / (start.weight - targetWeight)) * 100))
    : 0

  const donutData = [
    { name: 'Выполнено', value: Math.max(progressPct, 8) },
    { name: 'Осталось', value: Math.max(100 - progressPct, 8) },
  ]

  const statPills = [
    { label: 'Стартовый вес', value: start ? `${start.weight} кг` : '—' },
    { label: 'Цель', value: `${targetWeight} кг` },
    { label: 'Текущий', value: latest ? `${latest.weight} кг` : '—' },
  ]

  return (
    <div className="space-y-7">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="label-caps">Дневник прогресса</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight">Состав тела</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Замеры, динамика и отчёт тренеру.</p>
        </div>
        <button
          type="button"
          className="touch-target flex shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface2)] text-[var(--text-secondary)]"
          aria-label="Меню"
        >
          <Menu className="h-5 w-5" />
        </button>
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
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">Запись активности</p>
            <p className="mt-2 font-display text-2xl font-extrabold text-[var(--accent)]">{progressPct}%</p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-display text-lg font-bold">Отличная работа!</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {latest && start
              ? `−${(start.weight - latest.weight).toFixed(1)} кг с начала программы`
              : 'Добавьте первый замер, чтобы отслеживать прогресс'}
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

      <section className="rounded-[22px] border border-[var(--border)] bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Scale className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-sm font-semibold">Вес, кг</p>
        </div>
        <div className="chart-mobile h-52 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
            <AreaChart data={measurements}>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="date" stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v} кг`, 'Вес']} />
              <Area type="monotone" dataKey="weight" stroke={CHART.accent} fill="rgba(217,245,0,0.12)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Ruler className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-sm font-semibold">Талия, см</p>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={measurements}>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="date" stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v} см`, 'Талия']} />
              <Line type="monotone" dataKey="waist" stroke={CHART.emerald} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-[var(--accent)]" />
            <p className="text-sm font-semibold">Новый замер</p>
          </div>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Вес</Label>
            <Input inputMode="decimal" placeholder="67.4" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Талия</Label>
            <Input inputMode="numeric" placeholder="72" value={waist} onChange={(e) => setWaist(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Бёдра</Label>
            <Input inputMode="numeric" placeholder="96" value={hips} onChange={(e) => setHips(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Грудь</Label>
            <Input inputMode="numeric" placeholder="88" value={chest} onChange={(e) => setChest(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <Label>Самочувствие</Label>
          <Textarea placeholder="Как прошла неделя…" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="mt-3 space-y-1.5">
          <Label>URL фото (опционально)</Label>
          <Input placeholder="https://…" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
        </div>
        <Button
          className="mt-4 w-full"
          disabled={saveProgress.isPending || !weight}
          onClick={async () => {
            await saveProgress.mutateAsync({
              date: new Date().toISOString().slice(0, 10),
              weight: Number(weight),
              waist: waist ? Number(waist) : undefined,
              hips: hips ? Number(hips) : undefined,
              chest: chest ? Number(chest) : undefined,
              notes,
              photos: photoUrl ? [photoUrl] : undefined,
              clientId: 'c1',
            })
            toast.success('Замер сохранён')
            setWeight('')
            setWaist('')
            setHips('')
            setChest('')
            setNotes('')
            setPhotoUrl('')
          }}
        >
          Сохранить замер
        </Button>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-white/[0.03] p-5">
        <div className="mb-3 flex items-center gap-2">
          <Camera className="h-4 w-4 text-[var(--accent)]" />
          <p className="text-sm font-semibold">Фото прогресса</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['До', 'Неделя 2', 'После'].map((label) => (
            <div key={label} className="flex aspect-[3/4] items-end rounded-2xl border border-dashed border-[var(--border-strong)] bg-black/20 p-2">
              <span className="text-xs text-[var(--text-muted)]">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
