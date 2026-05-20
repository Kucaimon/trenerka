import i18n from '@/i18n'
import { config } from '@/lib/config'
import { getAuthToken } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export async function uploadMedia(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(i18n.t('trainer:messages.errors.fileTooLarge'))
  }
  const form = new FormData()
  form.append('file', file)
  const token = getAuthToken()
  const res = await fetch(`${config.wpApiUrl}${wpEndpoints.upload}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => undefined)
    const message =
      body && typeof body === 'object' && 'message' in body && typeof body.message === 'string'
        ? body.message
        : i18n.t('trainer:messages.errors.uploadFailed')
    throw new Error(message)
  }
  const data = (await res.json()) as { url: string }
  if (!data.url) {
    throw new Error(i18n.t('trainer:messages.errors.uploadFailed'))
  }
  return data.url
}
