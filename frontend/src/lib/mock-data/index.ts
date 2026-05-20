import type {
  AiInsight,
  CalendarEvent,
  MealPlan,
  Message,
  Notification,
  Payment,
  ProgressMeasurement,
  Achievement,
  NewsItem,
} from '@/types'
import { mockClients } from './clients'
import { mockExercises } from './exercises'
import { dateOnlyOffsetDays, isoOffsetDays, isoOffsetHours } from './dates'

export { mockClientFiles } from './client-files'
export type { ClientFile } from './client-files'

export { mockClients, mockExercises }

export const mockRevenueData = [
  { month: 'Дек', revenue: 185000, clients: 8 },
  { month: 'Янв', revenue: 210000, clients: 9 },
  { month: 'Фев', revenue: 198000, clients: 9 },
  { month: 'Мар', revenue: 245000, clients: 10 },
  { month: 'Апр', revenue: 268000, clients: 11 },
  { month: 'Май', revenue: 292000, clients: 11 },
]

export const mockRetentionData = [
  { month: 'Дек', rate: 88 },
  { month: 'Янв', rate: 90 },
  { month: 'Фев', rate: 87 },
  { month: 'Мар', rate: 92 },
  { month: 'Апр', rate: 94 },
  { month: 'Май', rate: 95 },
]

export const mockAttendanceData = [
  { week: 'Н1', sessions: 42 },
  { week: 'Н2', sessions: 48 },
  { week: 'Н3', sessions: 45 },
  { week: 'Н4', sessions: 52 },
]

export const mockWeekdayActivity = [
  { day: 'Пн', sessions: 14 },
  { day: 'Вт', sessions: 11 },
  { day: 'Ср', sessions: 16 },
  { day: 'Чт', sessions: 12 },
  { day: 'Пт', sessions: 18 },
  { day: 'Сб', sessions: 9 },
  { day: 'Вс', sessions: 5 },
]

export const mockSubscriptionMix = [
  { name: 'Базовый', value: 18, color: '#6b7280' },
  { name: 'Pro', value: 58, color: '#b8f53d' },
  { name: 'VIP', value: 24, color: '#95d425' },
]

/** Daily revenue points for dashboard period filters */
export function generateRevenueSeries(days: number) {
  const out: { label: string; revenue: number; date: string }[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const label =
      days <= 14
        ? d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
        : days <= 90
          ? d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
          : d.toLocaleDateString('ru-RU', { month: 'short' })
    const base = 8500 + (d.getDay() % 5) * 1200
    out.push({ label, revenue: base + Math.round(Math.sin(i * 0.4) * 2000), date: iso })
  }
  return out
}

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Анна Смирнова — Силовая', start: isoOffsetDays(0, 10), end: isoOffsetDays(0, 11), clientId: 'c1', color: '#b8f53d', type: 'training' },
  { id: 'e2', title: 'Дмитрий Козлов — Ноги', start: isoOffsetDays(0, 14), end: isoOffsetDays(0, 15), clientId: 'c2', color: '#95d425', type: 'training' },
  { id: 'e3', title: 'Игорь Петров — Спина', start: isoOffsetDays(1, 9), end: isoOffsetDays(1, 10), clientId: 'c4', recurring: true, type: 'training' },
  { id: 'e4', title: 'Мария Новикова — Кардио', start: isoOffsetDays(1, 16), end: isoOffsetDays(1, 16, 45), clientId: 'c5', type: 'training' },
  { id: 'e5', title: 'Ольга Морозова — Бег', start: isoOffsetDays(2, 8), end: isoOffsetDays(2, 9), clientId: 'c7', type: 'training' },
  { id: 'e6', title: 'Павел Кузнецов — Жим', start: isoOffsetDays(3, 11), end: isoOffsetDays(3, 12, 30), clientId: 'c10', type: 'training' },
  { id: 'e7', title: 'Виктория Лебедева — Функционал', start: isoOffsetDays(-1, 12), end: isoOffsetDays(-1, 13), clientId: 'c11', type: 'training' },
]

export const mockPayments: Payment[] = [
  { id: 'p1', clientId: 'c1', amount: 15000, date: dateOnlyOffsetDays(-10), method: 'Карта', note: 'Пакет 8 занятий' },
  { id: 'p2', clientId: 'c2', amount: 8000, date: dateOnlyOffsetDays(-8), method: 'Перевод' },
  { id: 'p3', clientId: 'c4', amount: 22000, date: dateOnlyOffsetDays(-12), method: 'Наличные', note: 'VIP пакет' },
  { id: 'p4', clientId: 'c10', amount: 35000, date: dateOnlyOffsetDays(-5), method: 'Карта' },
  { id: 'p5', clientId: 'c7', amount: 18000, date: dateOnlyOffsetDays(-6), method: 'СБП' },
  { id: 'p6', clientId: 'c5', amount: 12000, date: dateOnlyOffsetDays(-3), method: 'Карта' },
  { id: 'p7', clientId: 'c11', amount: 14000, date: dateOnlyOffsetDays(-2), method: 'СБП' },
]

export const mockMessages: Message[] = [
  { id: 'm1', clientId: 'c1', sender: 'client', text: 'Здравствуйте! Можно перенести тренировку на четверг?', createdAt: isoOffsetHours(-2), read: false },
  { id: 'm2', clientId: 'c2', sender: 'trainer', text: 'Дмитрий, отличная работа на прошлой неделе. Добавил вес в приседе.', createdAt: isoOffsetHours(-26), read: true },
  { id: 'm3', clientId: 'c4', sender: 'client', text: 'Болит поясница после становой. Что делать?', createdAt: isoOffsetHours(-5), read: false },
  { id: 'm4', clientId: 'c10', sender: 'client', text: 'Готов к соревнованиям через 6 недель!', createdAt: isoOffsetHours(-8), read: true },
  { id: 'm5', clientId: 'c1', sender: 'trainer', text: 'Анна, завтра в 10:00 — силовая. Не забудьте разминку 10 мин.', createdAt: isoOffsetHours(-30), read: true },
  { id: 'm6', clientId: 'c7', sender: 'client', text: 'Пульс на лёгком беге держу 145 — нормально?', createdAt: isoOffsetHours(-4), read: false },
  { id: 'm7', clientId: 'c5', sender: 'client', text: 'Можно заменить кардио на плавание в субботу?', createdAt: isoOffsetHours(-12), read: false },
  { id: 'm8', clientId: 'c11', sender: 'trainer', text: 'Виктория, обновила программу на следующую неделю.', createdAt: isoOffsetHours(-48), read: true },
]

export const mockAiInsights: AiInsight[] = [
  { id: 'ai1', title: 'Риск оттока: Елена Волкова', description: 'Клиент на паузе 3 недели. Рекомендуем персональное предложение.', priority: 'high' },
  { id: 'ai2', title: 'Оптимизация расписания', description: 'Слоты 14:00–16:00 заполнены на 95%. Рассмотрите групповые занятия.', priority: 'medium' },
  { id: 'ai3', title: 'Прогресс Павла', description: 'Жим лёжа +12% за месяц. Предложите программу пикирования.', priority: 'low' },
]

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Новая оплата', body: 'Павел Кузнецов оплатил 35 000 ₽', createdAt: isoOffsetHours(-6), read: false },
  { id: 'n2', title: 'Напоминание', body: 'Сегодня 2 тренировки: 10:00 и 14:00', createdAt: isoOffsetHours(-1), read: false },
  { id: 'n3', title: 'Сообщение', body: 'Анна Смирнова написала в чат', createdAt: isoOffsetHours(-2), read: true },
  { id: 'n4', title: 'Новый клиент', body: 'Алексей Соколов завершил регистрацию', createdAt: isoOffsetHours(-72), read: true },
]

export type ActivityFeedType = 'payment' | 'message' | 'notification'

export type ActivityFeedItem = {
  id: string
  type: ActivityFeedType
  title: string
  body: string
  createdAt: string
}

/** Combined notifications + messages for dashboard activity feed */
export const mockActivityFeed: ActivityFeedItem[] = [
  ...mockNotifications.map((n) => ({
    id: n.id,
    type: n.title.toLowerCase().includes('оплат') ? ('payment' as const) : ('notification' as const),
    title: n.title,
    body: n.body,
    createdAt: n.createdAt,
  })),
  ...mockMessages.map((m) => ({
    id: m.id,
    type: 'message' as const,
    title: m.sender === 'client' ? 'Сообщение от клиента' : 'Исходящее сообщение',
    body: m.text,
    createdAt: m.createdAt,
  })),
].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export const mockProgress: ProgressMeasurement[] = [
  { date: '2026-01-15', weight: 72, bodyFat: 28, clientId: 'c1' },
  { date: '2026-02-15', weight: 70.5, bodyFat: 26, clientId: 'c1' },
  { date: '2026-03-15', weight: 69.2, bodyFat: 24, clientId: 'c1' },
  { date: '2026-04-15', weight: 68.1, bodyFat: 22, clientId: 'c1' },
  { date: '2026-05-10', weight: 67.4, bodyFat: 21, clientId: 'c1' },
]

export const mockAchievements: Achievement[] = [
  { id: 'a1', title: '7 дней подряд', description: 'Тренировки без пропусков', icon: 'flame', unlockedAt: '2025-05-10' },
  { id: 'a2', title: 'Первая 100 кг', description: 'Жим лёжа 100 кг', icon: 'trophy', unlockedAt: '2025-04-22' },
  { id: 'a3', title: 'Марафонец', description: '30 тренировок', icon: 'medal' },
  { id: 'a4', title: 'Ранняя пташка', description: '10 утренних сессий', icon: 'sun', unlockedAt: '2025-03-15' },
]

export const mockMealPlan: MealPlan[] = [
  { id: 'mp1', day: 'Понедельник', meals: [
    { time: '08:00', name: 'Овсянка с ягодами', calories: 380 },
    { time: '13:00', name: 'Куриная грудка с рисом', calories: 520 },
    { time: '19:00', name: 'Рыба с овощами', calories: 450 },
  ]},
  { id: 'mp2', day: 'Вторник', meals: [
    { time: '08:00', name: 'Омлет с авокадо', calories: 420 },
    { time: '13:00', name: 'Индейка с гречкой', calories: 490 },
    { time: '19:00', name: 'Творог с орехами', calories: 380 },
  ]},
]

export const mockNews: NewsItem[] = [
  { id: 'news1', title: 'Обновление Trenerka 2.0', content: 'Новый конструктор тренировок и AI-рекомендации.', publishedAt: '2025-05-01' },
  { id: 'news2', title: 'Интеграция с Apple Health', content: 'Скоро синхронизация активности клиентов.', publishedAt: '2025-04-15' },
]

export const messageTemplates = [
  'Напоминание о тренировке завтра в {time}',
  'Отличная работа на сегодняшней сессии!',
  'Не забудьте выпить достаточно воды',
  'Программа обновлена — проверьте приложение',
]
