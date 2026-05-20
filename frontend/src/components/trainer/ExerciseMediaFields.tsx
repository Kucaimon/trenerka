import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, ImagePlus, Link2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export type ExerciseMediaValues = {
  description?: string
  technique?: string
  videoUrl?: string
  imageUrl?: string
  pdfUrl?: string
}

type ExerciseMediaFieldsProps = {
  values: ExerciseMediaValues
  onChange: (patch: Partial<ExerciseMediaValues>) => void
  onImageFile?: (file: File | undefined) => void
  onPdfFile?: (file: File | undefined) => void
  imageFileName?: string
  pdfFileName?: string
  disabled?: boolean
  compact?: boolean
}

export function ExerciseMediaFields({
  values,
  onChange,
  onImageFile,
  onPdfFile,
  imageFileName,
  pdfFileName,
  disabled,
  compact,
}: ExerciseMediaFieldsProps) {
  const { t } = useTranslation('trainer')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const clearImage = () => {
    onChange({ imageUrl: '' })
    onImageFile?.(undefined)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const clearPdf = () => {
    onChange({ pdfUrl: '' })
    onPdfFile?.(undefined)
    if (pdfInputRef.current) pdfInputRef.current.value = ''
  }

  return (
    <div className={compact ? 'space-y-2.5' : 'space-y-3'}>
      <div className="space-y-1.5">
        <Label>{t('exerciseMedia.technique')}</Label>
        <Textarea
          rows={compact ? 2 : 3}
          disabled={disabled}
          value={values.technique ?? ''}
          onChange={(e) => onChange({ technique: e.target.value })}
          placeholder={t('exerciseMedia.techniquePlaceholder')}
        />
      </div>
      {!compact ? (
        <div className="space-y-1.5">
          <Label>{t('exerciseMedia.description')}</Label>
          <Textarea
            rows={2}
            disabled={disabled}
            value={values.description ?? ''}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder={t('exerciseMedia.descriptionPlaceholder')}
          />
        </div>
      ) : null}
      <div className="space-y-1.5">
        <Label className="inline-flex items-center gap-1.5">
          <Link2 className="h-3.5 w-3.5" />
          {t('exerciseMedia.videoUrl')}
        </Label>
        <Input
          type="url"
          disabled={disabled}
          value={values.videoUrl ?? ''}
          onChange={(e) => onChange({ videoUrl: e.target.value })}
          placeholder={t('exerciseMedia.videoPlaceholder')}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="inline-flex items-center gap-1.5">
          <ImagePlus className="h-3.5 w-3.5" />
          {t('exerciseMedia.photo')}
        </Label>
        {values.imageUrl ? (
          <div className="flex items-start gap-3">
            <img
              src={values.imageUrl}
              alt=""
              className="h-16 w-16 shrink-0 rounded-lg border border-[var(--border)] object-cover"
            />
            <Button type="button" variant="ghost" size="sm" className="h-8 gap-1" onClick={clearImage} disabled={disabled}>
              <X className="h-3.5 w-3.5" />
              {t('exerciseMedia.removePhoto')}
            </Button>
          </div>
        ) : null}
        <Input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          disabled={disabled}
          className="text-[13px]"
          onChange={(e) => {
            const file = e.target.files?.[0]
            onImageFile?.(file)
          }}
        />
        {imageFileName ? (
          <p className="text-[11px] text-[var(--text-muted)]">{t('exerciseMedia.selectedFile', { name: imageFileName })}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label className="inline-flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          {t('exerciseMedia.attachment')}
        </Label>
        {values.pdfUrl ? (
          <div className="flex items-center gap-2">
            <a
              href={values.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-[13px] text-[var(--accent)] hover:underline"
            >
              {t('exerciseMedia.viewAttachment')}
            </a>
            <Button type="button" variant="ghost" size="sm" className="h-8 gap-1" onClick={clearPdf} disabled={disabled}>
              <X className="h-3.5 w-3.5" />
              {t('exerciseMedia.removeAttachment')}
            </Button>
          </div>
        ) : null}
        <Input
          ref={pdfInputRef}
          type="file"
          accept=".pdf,application/pdf,image/*"
          disabled={disabled}
          className="text-[13px]"
          onChange={(e) => {
            const file = e.target.files?.[0]
            onPdfFile?.(file)
          }}
        />
        {pdfFileName ? (
          <p className="text-[11px] text-[var(--text-muted)]">{t('exerciseMedia.selectedFile', { name: pdfFileName })}</p>
        ) : null}
      </div>
    </div>
  )
}
