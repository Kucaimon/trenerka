/** @deprecated Используйте hooks из `@/features/api` (client-cabinet-service). */
export const clientProfile = {
  name: 'Анна',
  trainer: 'Алексей Тренеров',
  nextSession: 'Завтра, 10:00',
  currentProgram: 'Силовая A',
  programPeriod: 'Неделя 2 из 4',
  packageBalance: 8,
  compliance: 86,
}

export const weeklyWorkouts = [
  {
    id: 'mon',
    day: 'Пн',
    title: 'Силовая A',
    date: '19 мая',
    duration: 56,
    status: 'today',
    exercises: [
      { name: 'Жим лёжа', muscle: 'Грудь', sets: 4, reps: '8', rest: 90, technique: 'Лопатки сведены, стопы плотно на полу, штанга идёт к нижней части груди.' },
      { name: 'Приседания со штангой', muscle: 'Ноги', sets: 5, reps: '5', rest: 120, technique: 'Колени направлены по линии носков, корпус стабилен, глубина контролируемая.' },
      { name: 'Тяга штанги в наклоне', muscle: 'Спина', sets: 4, reps: '10', rest: 90, technique: 'Спина нейтральная, тяга локтями назад, без рывка корпусом.' },
      { name: 'Планка', muscle: 'Кор', sets: 3, reps: '45 сек', rest: 60, technique: 'Таз не провисает, дыхание ровное, шея продолжает линию позвоночника.' },
    ],
  },
  {
    id: 'wed',
    day: 'Ср',
    title: 'Кардио + мобилити',
    date: '21 мая',
    duration: 42,
    status: 'planned',
    exercises: [
      { name: 'Беговая дорожка', muscle: 'Кардио', sets: 1, reps: '20 мин', rest: 0, technique: 'Пульс держать в зоне 2, без ускорений в первые 10 минут.' },
      { name: 'Разгибание грудного отдела', muscle: 'Мобилити', sets: 3, reps: '12', rest: 45, technique: 'Движение плавное, без боли в пояснице.' },
      { name: 'Ягодичный мост', muscle: 'Ягодицы', sets: 4, reps: '12', rest: 60, technique: 'Пауза в верхней точке 1 секунду, не переразгибать поясницу.' },
    ],
  },
  {
    id: 'fri',
    day: 'Пт',
    title: 'Силовая B',
    date: '23 мая',
    duration: 62,
    status: 'planned',
    exercises: [
      { name: 'Становая тяга', muscle: 'Ноги/спина', sets: 4, reps: '6', rest: 150, technique: 'Штанга близко к ногам, старт с напряжённой спиной, без округления.' },
      { name: 'Жим стоя', muscle: 'Плечи', sets: 4, reps: '8', rest: 90, technique: 'Рёбра вниз, ягодицы напряжены, траектория близко к лицу.' },
      { name: 'Подтягивания', muscle: 'Спина', sets: 4, reps: 'макс.', rest: 90, technique: 'Старт из полного виса, подбородок выше перекладины, без раскачки.' },
    ],
  },
]

export const progressMetrics = [
  { label: 'Вес', value: '67.4 кг', change: '-4.6 кг' },
  { label: 'Талия', value: '72 см', change: '-6 см' },
  { label: 'Выполнение', value: '86%', change: '+12%' },
]

export const measurements = [
  { date: 'Янв', weight: 72, waist: 78 },
  { date: 'Фев', weight: 70.5, waist: 76 },
  { date: 'Мар', weight: 69.2, waist: 74 },
  { date: 'Апр', weight: 68.1, waist: 73 },
  { date: 'Май', weight: 67.4, waist: 72 },
]

export const clientPayments = [
  { id: 'pay-1', date: '10 мая', amount: '15 000 ₽', method: 'Карта', note: 'Пакет 8 занятий' },
  { id: 'pay-2', date: '12 апр', amount: '15 000 ₽', method: 'СБП', note: 'Пакет 8 занятий' },
]

export const clientCoachMessages = [
  { id: 'm1', sender: 'trainer', text: 'Анна, завтра силовая A. По приседу держим тот же вес, цель — техника.', time: '18:20' },
  { id: 'm2', sender: 'client', text: 'Хорошо! Колено уже не беспокоит, готова добавить объём.', time: '18:24' },
  { id: 'm3', sender: 'trainer', text: 'Отлично. После тренировки пришлите фото дневника и самочувствие по 10-балльной шкале.', time: '18:25' },
]

export const weekProgress = {
  completed: 2,
  planned: 3,
  streakDays: 4,
}

export const completedWorkouts = [
  { id: 'done-1', title: 'Силовая A', date: '17 мая', duration: 54 },
  { id: 'done-2', title: 'Кардио + мобилити', date: '14 мая', duration: 41 },
  { id: 'done-3', title: 'Силовая B', date: '12 мая', duration: 58 },
  { id: 'done-4', title: 'Силовая A', date: '10 мая', duration: 52 },
  { id: 'done-5', title: 'Мобилити', date: '8 мая', duration: 35 },
]

export const clientCalendarMini = [
  { day: 'Ср', date: '21', hasEvent: true, label: '10:00 · Силовая' },
  { day: 'Чт', date: '22', hasEvent: false, label: '' },
  { day: 'Пт', date: '23', hasEvent: true, label: '10:00 · Силовая B' },
]
