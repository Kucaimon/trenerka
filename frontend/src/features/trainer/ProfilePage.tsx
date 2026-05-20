import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Camera, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useLogout } from '@/lib/auth/logout'
import { fetchTrainerProfile, updateTrainerProfile } from '@/features/api/auth-service'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { config } from '@/lib/config'
import { uploadMedia } from '@/lib/wordpress/upload'

type FormData = {
  fullName: string
  specialization: string
  experience: string
  phone: string
}

export function ProfilePage() {
  const { t } = useTranslation(['trainer', 'common'])
  const user = useAuthStore((s) => s.user)
  const trainerProfile = useAuthStore((s) => s.trainerProfile)
  const setTrainerProfile = useAuthStore((s) => s.setTrainerProfile)
  const handleLogout = useLogout('trainer')
  const [params] = useSearchParams()
  const setupMode = params.get('setup') === '1'
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(trainerProfile?.avatarUrl)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const schema = z.object({
    fullName: z.string().min(2, t('common:validation.nameMin2')),
    specialization: z.string().min(2, t('profile.validation.specialization')),
    experience: z.string().min(1, t('profile.validation.experience')),
    phone: z.string().min(5, t('profile.validation.phone')),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    const load = async () => {
      try {
        const profile = await fetchTrainerProfile(user.id)
        if (cancelled) return
        if (profile && profile.userId === user.id) {
          setTrainerProfile(profile)
          reset({
            fullName: profile.fullName ?? '',
            specialization: profile.specialization ?? '',
            experience: profile.experience ?? '',
            phone: profile.phone ?? '',
          })
          setAvatarPreview(profile.avatarUrl)
          return
        }
        setTrainerProfile(null)
        reset({
          fullName: user.name ?? '',
          specialization: '',
          experience: '',
          phone: '',
        })
        setAvatarPreview(undefined)
      } catch {
        if (cancelled) return
        const cached = useAuthStore.getState().trainerProfile
        if (cached?.userId === user.id) {
          reset({
            fullName: cached.fullName ?? '',
            specialization: cached.specialization ?? '',
            experience: cached.experience ?? '',
            phone: cached.phone ?? '',
          })
          setAvatarPreview(cached.avatarUrl)
        } else {
          setTrainerProfile(null)
          reset({
            fullName: user.name ?? '',
            specialization: '',
            experience: '',
            phone: '',
          })
          setAvatarPreview(undefined)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [user?.id, user?.name, setTrainerProfile, reset])

  const onAvatarChange = (file: File | undefined) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('profile.avatarTooLarge'))
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return
    try {
      let avatarUrl = trainerProfile?.avatarUrl
      if (avatarFile) {
        if (config.useMockData) {
          avatarUrl = avatarPreview
        } else {
          avatarUrl = await uploadMedia(avatarFile)
        }
      }
      const saved = await updateTrainerProfile(user.id, { ...data, avatarUrl })
      setTrainerProfile(saved)
      toast.success(t('profile.saved'))
    } catch {
      toast.error(t('common:saveError'))
    }
  }

  const initials =
    (trainerProfile?.fullName || user?.name || 'T')
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'T'

  return (
    <div className="page-container">
      <PageHeader
        title={t('profile.title')}
        description={setupMode ? t('profile.setupDescription') : t('profile.description')}
        actions={<Badge variant="accent">{t('profile.badgePro')}</Badge>}
      />

      {setupMode && (
        <div className="mb-6 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 text-sm text-[var(--text-secondary)]">
          {t('profile.setupBanner')}
        </div>
      )}

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t('profile.cardTitle')}</CardTitle>
          <CardDescription>{t('profile.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar className="h-20 w-20 border border-[var(--border-strong)]">
                {avatarPreview ? <AvatarImage src={avatarPreview} alt="" /> : null}
                <AvatarFallback className="bg-[var(--surface2)] text-lg font-semibold text-[var(--accent)]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onAvatarChange(e.target.files?.[0])}
                />
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileRef.current?.click()}>
                  <Camera className="h-4 w-4" />
                  {t('profile.uploadAvatar')}
                </Button>
                <p className="text-xs text-[var(--text-muted)]">{t('profile.avatarHint')}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="fullName">{t('profile.fields.fullName')}</Label>
                <Input id="fullName" {...register('fullName')} />
                {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="specialization">{t('profile.fields.specialization')}</Label>
                <Input
                  id="specialization"
                  placeholder={t('profile.specializationPlaceholder')}
                  {...register('specialization')}
                />
                {errors.specialization && (
                  <p className="text-xs text-red-400">{errors.specialization.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="experience">{t('profile.fields.experience')}</Label>
                <Input
                  id="experience"
                  placeholder={t('profile.experiencePlaceholder')}
                  {...register('experience')}
                />
                {errors.experience && (
                  <p className="text-xs text-red-400">{errors.experience.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">{t('profile.fields.phone')}</Label>
                <Input id="phone" type="tel" autoComplete="tel" {...register('phone')} />
                {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">{t('profile.fields.email')}</Label>
                <Input id="email" type="email" value={user?.email ?? ''} disabled />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common:actions.saving') : t('common:actions.save')}
              </Button>
              <Button type="button" variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                {t('common:actions.logout')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
