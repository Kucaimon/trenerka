import i18n from '@/i18n'
import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { Client, CreateClientResult, ProgressMeasurement, Program } from '@/types'

export async function getClients(): Promise<Client[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.clients.list()
  return wpFetch<Client[]>(wpEndpoints.clients)
}

export async function getClient(id: string): Promise<Client | undefined> {
  await apiDelay()
  if (config.useMockData) return mockApi.clients.get(id)
  return wpFetch<Client>(`${wpEndpoints.clients}/${id}`)
}

export async function createClient(data: Omit<Client, 'id' | 'joinedAt'>): Promise<CreateClientResult> {
  await apiDelay(400)
  if (config.useMockData) {
    const { client, temporaryPassword } = mockApi.clients.create(data)
    return { client, temporaryPassword }
  }
  const res = await wpFetch<Client & { temporary_password?: string }>(wpEndpoints.clients, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return { client: res, temporaryPassword: res.temporary_password }
}

export async function updateClient(id: string, data: Partial<Client>): Promise<Client | undefined> {
  await apiDelay()
  if (config.useMockData) return mockApi.clients.update(id, data)
  return wpFetch<Client>(`${wpEndpoints.clients}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteClient(id: string): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.clients.remove(id)
    return
  }
  await wpFetch(`${wpEndpoints.clients}/${id}`, { method: 'DELETE' })
}

export async function getClientProgress(clientId: string): Promise<ProgressMeasurement[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.progress.byClient(clientId)
  const res = await wpFetch<{ measurements: ProgressMeasurement[] }>(wpEndpoints.clientProgress(clientId))
  return res.measurements
}

export async function getClientWorkoutCompletions(clientId: string): Promise<string[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.client.workoutCompletions(clientId)
  const res = await wpFetch<{ workoutIds: string[] }>(wpEndpoints.clientWorkoutCompletions(clientId))
  return res.workoutIds
}

export async function getClientAssignedProgram(
  clientId: string,
): Promise<{ program: Program | null; startDate?: string } | null> {
  await apiDelay()
  if (config.useMockData) {
    const a = mockApi.programs.getAssignment(clientId)
    if (!a) return null
    return { program: a.program, startDate: a.assignment.startDate }
  }
  const res = await wpFetch<{ program: Program | null; startDate?: string }>(
    `${wpEndpoints.clientPrograms}?clientId=${clientId}`,
  )
  return res
}

export function exportClientsCsv(clients: Client[]): void {
  const header = i18n.t('common:export.clientsHeader')
  const rows = clients.map(
    (c) => `"${c.name}","${c.email}","${c.phone}",${c.status},${c.packageBalance},"${c.goal ?? ''}"`,
  )
  const blob = new Blob([`\uFEFF${[header, ...rows].join('\n')}`], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'clients.csv'
  a.click()
}

/** XLSX не подключён — экспорт в CSV (открывается в Excel). См. docs/API.md */
export function exportClientsSpreadsheet(clients: Client[]): void {
  exportClientsCsv(clients)
}
