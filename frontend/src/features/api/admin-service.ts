import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { AdminStats, AdminUser, NewsItem, PlatformPlan } from '@/types'

export async function getAdminStats(): Promise<AdminStats> {
  await apiDelay()
  if (config.useMockData) return mockApi.admin.stats()
  return wpFetch<AdminStats>(wpEndpoints.admin.stats)
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.admin.users()
  return wpFetch<AdminUser[]>(wpEndpoints.admin.users)
}

export async function setUserBlocked(id: string, blocked: boolean): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.admin.patchUser(id, blocked)
    return
  }
  await wpFetch(wpEndpoints.admin.user(id), {
    method: 'PATCH',
    body: JSON.stringify({ blocked }),
  })
}

export async function setUserEmailVerified(id: string, emailVerified: boolean): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.admin.patchUserVerified(id, emailVerified)
    return
  }
  await wpFetch(wpEndpoints.admin.user(id), {
    method: 'PATCH',
    body: JSON.stringify({ emailVerified }),
  })
}

export async function getNews(): Promise<NewsItem[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.news.list()
  return wpFetch<NewsItem[]>(wpEndpoints.news)
}

export async function saveNews(item: NewsItem): Promise<NewsItem> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.news.save(item)
    return item
  }
  const method = item.id ? 'PUT' : 'POST'
  const path = item.id ? `${wpEndpoints.news}/${item.id}` : wpEndpoints.news
  const res = await wpFetch<{ id: string }>(path, { method, body: JSON.stringify(item) })
  return { ...item, id: res.id ?? item.id }
}

const MOCK_PLANS: PlatformPlan[] = [
  { id: 'basic', name: 'Базовый', priceRub: 0, clientLimit: 10, active: true },
  { id: 'pro', name: 'Pro', priceRub: 1990, clientLimit: 50, active: true },
  { id: 'vip', name: 'VIP', priceRub: 4990, clientLimit: 200, active: true },
]

export async function getPlatformPlans(): Promise<{ plans: PlatformPlan[]; billingNote?: string }> {
  await apiDelay()
  if (config.useMockData) {
    return { plans: MOCK_PLANS, billingNote: 'Mock: billing Stage 2' }
  }
  return wpFetch(wpEndpoints.admin.platformPlans)
}

export async function savePlatformPlans(plans: PlatformPlan[]): Promise<PlatformPlan[]> {
  await apiDelay()
  if (config.useMockData) return plans
  const res = await wpFetch<{ plans: PlatformPlan[] }>(wpEndpoints.admin.platformPlans, {
    method: 'PUT',
    body: JSON.stringify({ plans }),
  })
  return res.plans
}

export async function deleteNews(id: string): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.news.remove(id)
    return
  }
  await wpFetch(`${wpEndpoints.news}/${id}`, { method: 'DELETE' })
}
