import { config } from '@/lib/config'
import { apiDelay } from '@/lib/api/delay'
import { mockApi } from '@/lib/mock-api/store'
import { wpFetch } from '@/lib/wordpress/client'
import { wpEndpoints } from '@/lib/wordpress/endpoints'
import type { Payment, PaymentProviderConfig } from '@/types'

export async function getPayments(): Promise<Payment[]> {
  await apiDelay()
  if (config.useMockData) return mockApi.payments.list()
  return wpFetch<Payment[]>(wpEndpoints.payments)
}

export async function createPayment(data: Omit<Payment, 'id'>): Promise<Payment> {
  await apiDelay()
  if (config.useMockData) return mockApi.payments.create(data)
  return wpFetch<Payment>(wpEndpoints.payments, { method: 'POST', body: JSON.stringify(data) })
}

export async function updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined> {
  await apiDelay()
  if (config.useMockData) return mockApi.payments.update(id, data)
  return wpFetch<Payment>(`${wpEndpoints.payments}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deletePayment(id: string): Promise<void> {
  await apiDelay()
  if (config.useMockData) {
    mockApi.payments.remove(id)
    return
  }
  await wpFetch(`${wpEndpoints.payments}/${id}`, { method: 'DELETE' })
}

export async function getPaymentReport(from: string, to: string): Promise<{ total: number }> {
  await apiDelay()
  if (config.useMockData) return mockApi.payments.report(from, to)
  return wpFetch(`${wpEndpoints.paymentReports}?from=${from}&to=${to}`)
}

export function exportPaymentsCsv(payments: Payment[], clientNames: Map<string, string>): void {
  const header = 'Клиент,Сумма,Дата,Способ,Комментарий'
  const rows = payments.map(
    (p) => `"${clientNames.get(p.clientId) ?? p.clientId}",${p.amount},${p.date},${p.method},"${p.note ?? ''}"`,
  )
  const blob = new Blob([`\uFEFF${[header, ...rows].join('\n')}`], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'payments.csv'
  a.click()
}

export function getPaymentProviderConfig(): PaymentProviderConfig {
  return {
    provider: config.useMockData ? 'mock' : 'stripe',
    enabled: false,
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  }
}
