import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import { uploadMedia } from '@/lib/wordpress/upload'
import type { ClientAttachment, MaterialCategory } from '@/types'

export async function listClientAttachments(clientId: string): Promise<ClientAttachment[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.attachments.list(clientId)
  return wpFetch<ClientAttachment[]>(wpEndpoints.clientAttachments(clientId))
}

export async function addClientAttachment(
  clientId: string,
  data: { name: string; url: string; category: MaterialCategory; mimeType?: string; sizeBytes?: number },
): Promise<ClientAttachment> {
  await apiDelay(300)
  if (config.useMockData) return mockApi.attachments.add(clientId, data)
  return wpFetch<ClientAttachment>(wpEndpoints.clientAttachments(clientId), {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteClientAttachment(clientId: string, attachmentId: string): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.attachments.remove(clientId, attachmentId)
    return
  }
  await wpFetch(wpEndpoints.clientAttachment(clientId, attachmentId), { method: 'DELETE' })
}

export async function uploadClientAttachmentFile(
  clientId: string,
  file: File,
  category: MaterialCategory = 'document',
): Promise<ClientAttachment> {
  const url = await uploadMedia(file)
  return addClientAttachment(clientId, {
    name: file.name,
    url,
    category,
    mimeType: file.type,
    sizeBytes: file.size,
  })
}
