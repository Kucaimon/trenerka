import { config } from '@/lib/config'
import { getAuthToken } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'

export async function uploadMedia(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large')
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
    throw new Error('Upload failed')
  }
  const data = (await res.json()) as { url: string }
  return data.url
}
