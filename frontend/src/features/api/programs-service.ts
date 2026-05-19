import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { Program } from '@/types'

export async function getPrograms(): Promise<Program[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.programs.list()
  return wpFetch<Program[]>(wpEndpoints.programs)
}

export async function getProgram(id: string): Promise<Program | undefined> {
  await apiDelay()
  if (config.useMockData) return mockApi.programs.get(id)
  return wpFetch<Program>(`${wpEndpoints.programs}/${id}`)
}

export async function saveProgram(program: Program): Promise<Program> {
  await apiDelay()
  if (config.useMockData) return mockApi.programs.save(program)
  const method = program.id ? 'PUT' : 'POST'
  const path = program.id ? `${wpEndpoints.programs}/${program.id}` : wpEndpoints.programs
  return wpFetch<Program>(path, { method, body: JSON.stringify(program) })
}

export async function deleteProgram(id: string): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.programs.remove(id)
    return
  }
  await wpFetch(`${wpEndpoints.programs}/${id}`, { method: 'DELETE' })
}

export async function assignProgram(clientId: string, programId: string, startDate: string): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.programs.assign(clientId, programId, startDate)
    return
  }
  await wpFetch(wpEndpoints.clientPrograms, {
    method: 'POST',
    body: JSON.stringify({ clientId, programId, startDate }),
  })
}
