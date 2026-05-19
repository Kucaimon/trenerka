import { config } from '@/lib/config'

export async function apiDelay(ms = 200): Promise<void> {
  if (config.useMockData) {
    await new Promise((r) => setTimeout(r, ms))
  }
}
