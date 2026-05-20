export type ClientFile = {
  id: string
  clientId: string
  name: string
  size: string
  type: 'pdf' | 'image' | 'doc'
  uploadedAt: string
}

export const mockClientFiles: ClientFile[] = [
  { id: 'f1', clientId: 'c1', name: 'Анкета_здоровья.pdf', size: '240 КБ', type: 'pdf', uploadedAt: '2026-05-10' },
  { id: 'f2', clientId: 'c1', name: 'Прогресс_май.jpg', size: '1.2 МБ', type: 'image', uploadedAt: '2026-05-15' },
  { id: 'f3', clientId: 'c2', name: 'Договор_тренировок.pdf', size: '180 КБ', type: 'pdf', uploadedAt: '2026-04-28' },
  { id: 'f4', clientId: 'c4', name: 'План_силовой.doc', size: '96 КБ', type: 'doc', uploadedAt: '2026-05-01' },
  { id: 'f5', clientId: 'c10', name: 'Соревнования_план.pdf', size: '320 КБ', type: 'pdf', uploadedAt: '2026-05-12' },
]
