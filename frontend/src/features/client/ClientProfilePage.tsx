import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, ChevronRight, LogOut, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth-store'
import { useLogout } from '@/lib/auth/logout'
import { useClientDashboard, useClientProfile, useUpdateClientProfile } from '@/features/api/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { config } from '@/lib/config'
import { uploadMedia } from '@/lib/wordpress/upload'

type FormData = { name: string; phone: string }

export function ClientProfilePage() {
  const { t } = useTranslation(['client', 'common'])
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const login = useAuthStore((s) => s.login)
  const handleLogout = useLogout('client')
  const { data: dashboard } = useClientDashboard()
  const { data: profile } = useClientProfile()
  const updateProfile = useUpdateClientProfile()
  const balance = dashboard?.profile?.packageBalance ?? 0
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarOverride, setAvatarOverride] = useState<string | undefined>()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const avatarPreview = avatarOverride ?? profile?.avatarUrl ?? user?.avatar

  const schema = z.object({
    name: z.string().min(2, t('common:validation.nameMin2')),
    phone: z.string().min(5, t('profile.validation.phone')),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const name = profile?.name ?? user?.name ?? ''
    const phone = profile?.phone ?? dashboard?.profile?.phone ?? ''
    reset({ name, phone })
  }, [profile, user, dashboard, reset])

  const onSubmit = async (data: FormData) => {
    try {
      let avatarUrl: string | undefined
      if (avatarFile) {
        avatarUrl = config.useMockData ? URL.createObjectURL(avatarFile) : await uploadMedia(avatarFile)
      }
      const updated = await updateProfile.mutateAsync({
        name: data.name,
        phone: data.phone,
        ...(avatarUrl ? { avatarUrl } : {}),
      })
      if (user && token) {
        login({ ...user, name: updated.name, avatar: avatarUrl ?? user.avatar }, token)
      }
      toast.success(t('common:actions.saved'))
      setAvatarFile(null)
    } catch {
      toast.error(t('profile.saveError'))
    }
  }

  const displayName = profile?.name ?? user?.name ?? t('profile.defaultName')
  const initial = displayName.slice(0, 1).toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative"
          onClick={() => fileRef.current?.click()}
          aria-label={t('profile.changeAvatar')}
        >
          <Avatar className="h-16 w-16 border border-[var(--border-strong)]">
            {avatarPreview ? <AvatarImage src={avatarPreview} alt="" /> : null}
            <AvatarFallback className="bg-[var(--accent)] text-lg font-bold text-[#111]">{initial}</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface2)]">
            <Camera className="h-3.5 w-3.5" />
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setAvatarFile(file)
            setAvatarOverride(URL.createObjectURL(file))
          }}
        />
        <div>
          <p className="label-caps">{t('profile.title')}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{displayName}</h1>
          <p className="text-sm text-[var(--text-secondary)]">{profile?.email ?? user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mobile-card space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t('profile.fields.name')}</Label>
          <Input id="name" {...register('name')} className="bg-[var(--surface2)]" />
          {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t('profile.fields.phone')}</Label>
          <Input id="phone" {...register('phone')} className="bg-[var(--surface2)]" />
          {errors.phone ? <p className="text-xs text-red-400">{errors.phone.message}</p> : null}
        </div>
        <Button type="submit" disabled={isSubmitting || updateProfile.isPending}>
          {t('common:actions.save')}
        </Button>
      </form>

      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          to="/client/nutrition"
          className="mobile-card flex items-center justify-between transition-colors hover:bg-white/[0.04]"
        >
          <span className="text-sm font-semibold">{t('nutrition.title')}</span>
          <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
        </Link>
        <Link
          to="/client/achievements"
          className="mobile-card flex items-center justify-between transition-colors hover:bg-white/[0.04]"
        >
          <span className="text-sm font-semibold">{t('achievements.title')}</span>
          <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
        </Link>
      </div>

      <Link
        to="/client/payments"
        className="mobile-card flex items-center justify-between transition-colors hover:bg-white/[0.04]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--accent-dim)]">
            <Wallet className="h-5 w-5 text-[var(--accent)]" />
          </span>
          <div>
            <p className="text-sm font-semibold">{t('profile.paymentsLink')}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {balance} {t('common:units.sessionsShort')}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
      </Link>

      <Button type="button" variant="outline" className="w-full gap-2" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        {t('common:actions.logout')}
      </Button>
    </div>
  )
}
