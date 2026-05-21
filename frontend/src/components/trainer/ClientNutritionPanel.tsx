import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Loader2, Paperclip, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateClient } from '@/features/api/hooks'
import {
  deleteClientAttachment,
  listClientAttachments,
  uploadClientAttachmentFile,
} from '@/features/api/attachments-service'
import type { Client } from '@/types'

export function ClientNutritionPanel({ client }: { client: Client }) {
  const { t } = useTranslation(['trainer', 'common'])
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [notes, setNotes] = useState(client.notes ?? '')
  const updateClient = useUpdateClient()

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['client-attachments', client.id],
    queryFn: () => listClientAttachments(client.id),
  })
  const mealPlans = attachments.filter((a) => a.category === 'meal_plan')

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      await uploadClientAttachmentFile(client.id, file, 'meal_plan')
      void qc.invalidateQueries({ queryKey: ['client-attachments', client.id] })
      toast.success(t('clients.nutrition.planUploaded'))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('clients.attachments.uploadError'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onDelete = async (id: string) => {
    try {
      await deleteClientAttachment(client.id, id)
      void qc.invalidateQueries({ queryKey: ['client-attachments', client.id] })
    } catch {
      toast.error(t('clients.attachments.deleteError'))
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-semibold">{t('clients.nutrition.mealPlans')}</CardTitle>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,image/*"
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
            {t('clients.nutrition.uploadPlan')}
          </Button>
        </CardHeader>
        <CardContent className="divide-y divide-[var(--border)] p-0">
          {isLoading ? (
            <p className="px-4 py-6 text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
          ) : mealPlans.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[var(--text-muted)]">{t('clients.nutrition.noPlans')}</p>
          ) : (
            mealPlans.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                <FileText className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                <div className="min-w-0 flex-1">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm font-medium hover:text-[var(--accent)]"
                  >
                    {a.name}
                  </a>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {new Date(a.createdAt).toLocaleDateString()}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t('clients.nutrition.coachNotes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-xs text-[var(--text-muted)]">{t('clients.nutrition.coachNotesHint')}</p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('clients.notes.placeholder')}
            rows={5}
            className="bg-[var(--surface3)]"
          />
          <Button
            className="mt-3"
            size="sm"
            disabled={updateClient.isPending}
            onClick={async () => {
              await updateClient.mutateAsync({ id: client.id, data: { notes } })
              toast.success(t('clients.notes.saved'))
            }}
          >
            {t('common:actions.save')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
