import type { Client } from '@/types'

export const mockClients: Client[] = [
  { id: 'c1', name: 'Анна Смирнова', email: 'anna@mail.ru', phone: '+7 916 111-22-33', status: 'active', joinedAt: '2024-08-12', packageBalance: 8, lastSession: '2025-05-16', goal: 'Снижение веса' },
  { id: 'c2', name: 'Дмитрий Козлов', email: 'dmitry@mail.ru', phone: '+7 903 222-33-44', status: 'active', joinedAt: '2024-09-01', packageBalance: 4, lastSession: '2025-05-17', goal: 'Набор массы' },
  { id: 'c3', name: 'Елена Волкова', email: 'elena@mail.ru', phone: '+7 925 333-44-55', status: 'pause', joinedAt: '2024-06-20', packageBalance: 2, lastSession: '2025-04-28', goal: 'Тонус' },
  { id: 'c4', name: 'Игорь Петров', email: 'igor@mail.ru', phone: '+7 977 444-55-66', status: 'active', joinedAt: '2025-01-15', packageBalance: 12, lastSession: '2025-05-15', goal: 'Сила' },
  { id: 'c5', name: 'Мария Новикова', email: 'maria@mail.ru', phone: '+7 915 555-66-77', status: 'active', joinedAt: '2024-11-03', packageBalance: 6, lastSession: '2025-05-14', goal: 'Рельеф' },
  { id: 'c6', name: 'Сергей Орлов', email: 'sergey@mail.ru', phone: '+7 926 666-77-88', status: 'archive', joinedAt: '2023-12-01', packageBalance: 0, lastSession: '2025-02-10', goal: 'Здоровье' },
  { id: 'c7', name: 'Ольга Морозова', email: 'olga@mail.ru', phone: '+7 903 777-88-99', status: 'active', joinedAt: '2025-02-20', packageBalance: 10, lastSession: '2025-05-17', goal: 'Подготовка к марафону' },
  { id: 'c8', name: 'Алексей Соколов', email: 'alex@mail.ru', phone: '+7 916 888-99-00', status: 'active', joinedAt: '2024-10-05', packageBalance: 3, lastSession: '2025-05-12', goal: 'Коррекция осанки' },
  { id: 'c9', name: 'Наталья Белова', email: 'natalia@mail.ru', phone: '+7 925 999-00-11', status: 'pause', joinedAt: '2024-07-18', packageBalance: 1, lastSession: '2025-03-22', goal: 'Похудение' },
  { id: 'c10', name: 'Павел Кузнецов', email: 'pavel@mail.ru', phone: '+7 977 000-11-22', status: 'active', joinedAt: '2025-03-01', packageBalance: 16, lastSession: '2025-05-17', goal: 'Пауэрлифтинг' },
  { id: 'c11', name: 'Виктория Лебедева', email: 'vika@mail.ru', phone: '+7 915 111-22-44', status: 'active', joinedAt: '2024-12-10', packageBalance: 5, lastSession: '2025-05-16', goal: 'Функциональный тренинг' },
]
