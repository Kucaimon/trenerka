import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Loader2, Paperclip, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  deleteClientAttachment,
  listClientAttachments,
  uploadClientAttachmentFile,
} from '@/features/api/attachments-service'
import type { MaterialCategory } from '@/types'

const CATEGORIES: MaterialCategory[] = [
  'program',
  'presentation',
  'meal_plan',
  'certificate',
  'document',
  'other',
]

export function ClientAttachmentsPanel({ clientId }: { clientId: string }) {
  const { t } = useTranslation(['trainer', 'common'])
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<MaterialCategory>('document')
  const [uploading, setUploading] = useState(false)

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['client-attachments', clientId],
    queryFn: () => listClientAttachments(clientId),
  })

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      await uploadClientAttachmentFile(clientId, file, category)
      void qc.invalidateQueries({ queryKey: ['client-attachments', clientId] })
      toast.success(t('clients.attachments.uploaded'))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('clients.attachments.uploadError'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onDelete = async (id: string) => {
    try {
      await deleteClientAttachment(clientId, id)
      void qc.invalidateQueries({ queryKey: ['client-attachments', clientId] })
    } catch {
      toast.error(t('clients.attachments.deleteError'))
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-semibold">{t('clients.attachments.title')}</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="space-y-1">
            <Label className="sr-only">{t('clients.attachments.category')}</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as MaterialCategory)}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {t(`clients.materialCategory.${c}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
            {t('clients.attachments.upload')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="divide-y divide-[var(--border)] p-0">
        {isLoading ? (
          <p className="px-4 py-6 text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
        ) : attachments.length === 0 ? (
          <p className="px-4 py-6 text-sm text-[var(--text-muted)]">
            {category === 'meal_plan' ? t('clients.attachments.emptyMealPlan') : t('clients.attachments.empty')}
          </p>
        ) : (
          attachments.map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3">
              <FileText className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              <div className="min-w-0 flex-1">
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium hover:text-[var(--accent)]">
                  {a.name}
                </a>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {t(`clients.materialCategory.${a.category}`)} · {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => void onDelete(a.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
