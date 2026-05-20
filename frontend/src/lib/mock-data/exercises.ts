import type { Exercise } from '@/types'

/** Showcase exercise with full infographic-style detail (Samat sample). */
export const romanianDeadliftSample: Exercise = {
  id: 'ex-rdl',
  name: 'Румынская становая тяга',
  muscleGroup: 'Ноги',
  equipment: 'Штанга',
  difficulty: 'beginner',
  level: 'Правильная техника для новичков',
  trainerName: 'Самат Назиров',
  imageUrl: '',
  isPublic: true,
  steps: [
    'Исходное положение: стоя, ноги на ширине плеч, штанга в опущенных руках. Спина прямая, плечи расправлены.',
    'Движение: отводите таз назад, сгибаясь в тазобедренных суставах. Колени слегка согнуты.',
    'Опускание: опускайте штангу до середины голени, чувствуя растяжение в бицепсах бедра. Спина всегда прямая!',
    'Подъём: возвращайтесь в исходное положение, мощно разгибая таз и сжимая ягодицы.',
  ],
  breathingTip: 'Выдох на усилии (при подъёме), вдох при опускании. Начните с малого веса!',
  description: 'Базовое упражнение для задней поверхности бедра и ягодиц.',
  technique: 'Держите спину прямой на всей амплитуде.',
}

type MuscleGroup = 'Грудь' | 'Спина' | 'Ноги' | 'Плечи' | 'Руки' | 'Кор' | 'Кардио'
type Equipment = 'Штанга' | 'Гантели' | 'Тренажёр' | 'Собственный вес' | 'Кабель' | 'Резина'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'

type Seed = {
  slug: string
  name: string
  muscle: MuscleGroup
  equipment: Equipment
  difficulty: Difficulty
  isPublic?: boolean
}

const catalog: Seed[] = [
  { slug: 'bench-press', name: 'Жим лёжа', muscle: 'Грудь', equipment: 'Штанга', difficulty: 'intermediate' },
  { slug: 'squat', name: 'Приседания со штангой', muscle: 'Ноги', equipment: 'Штанга', difficulty: 'intermediate' },
  { slug: 'deadlift', name: 'Становая тяга', muscle: 'Спина', equipment: 'Штанга', difficulty: 'advanced' },
  { slug: 'pull-ups', name: 'Подтягивания', muscle: 'Спина', equipment: 'Собственный вес', difficulty: 'intermediate' },
  { slug: 'ohp', name: 'Жим стоя', muscle: 'Плечи', equipment: 'Штанга', difficulty: 'intermediate' },
  { slug: 'barbell-row', name: 'Тяга штанги в наклоне', muscle: 'Спина', equipment: 'Штанга', difficulty: 'intermediate' },
  { slug: 'lunges-db', name: 'Выпады с гантелями', muscle: 'Ноги', equipment: 'Гантели', difficulty: 'beginner' },
  { slug: 'incline-db-press', name: 'Жим гантелей на наклонной', muscle: 'Грудь', equipment: 'Гантели', difficulty: 'beginner' },
  { slug: 'tricep-ext', name: 'Разгибания на трицепс', muscle: 'Руки', equipment: 'Кабель', difficulty: 'beginner' },
  { slug: 'bicep-curl', name: 'Сгибания на бицепс', muscle: 'Руки', equipment: 'Гантели', difficulty: 'beginner' },
  { slug: 'plank', name: 'Планка', muscle: 'Кор', equipment: 'Собственный вес', difficulty: 'beginner' },
  { slug: 'burpee', name: 'Берпи', muscle: 'Кардио', equipment: 'Собственный вес', difficulty: 'advanced' },
  { slug: 'leg-press', name: 'Жим ногами', muscle: 'Ноги', equipment: 'Тренажёр', difficulty: 'beginner' },
  { slug: 'lat-pulldown', name: 'Тяга верхнего блока', muscle: 'Спина', equipment: 'Кабель', difficulty: 'beginner' },
  { slug: 'dips', name: 'Отжимания на брусьях', muscle: 'Грудь', equipment: 'Собственный вес', difficulty: 'intermediate' },
  { slug: 'lateral-raise', name: 'Махи гантелями в стороны', muscle: 'Плечи', equipment: 'Гантели', difficulty: 'beginner' },
  { slug: 'crunch', name: 'Скручивания', muscle: 'Кор', equipment: 'Собственный вес', difficulty: 'beginner' },
  { slug: 'hyperextension', name: 'Гиперэкстензия', muscle: 'Спина', equipment: 'Тренажёр', difficulty: 'beginner' },
  { slug: 'treadmill', name: 'Беговая дорожка', muscle: 'Кардио', equipment: 'Тренажёр', difficulty: 'beginner' },
  { slug: 'elliptical', name: 'Эллипс', muscle: 'Кардио', equipment: 'Тренажёр', difficulty: 'beginner' },
  { slug: 'bike', name: 'Велосипед', muscle: 'Кардио', equipment: 'Тренажёр', difficulty: 'beginner' },
  { slug: 'lateral-lunge', name: 'Боковые выпады', muscle: 'Ноги', equipment: 'Гантели', difficulty: 'beginner' },
  { slug: 'glute-bridge', name: 'Ягодичный мост', muscle: 'Ноги', equipment: 'Собственный вес', difficulty: 'beginner' },
  { slug: 'one-arm-row', name: 'Тяга гантели одной рукой', muscle: 'Спина', equipment: 'Гантели', difficulty: 'intermediate' },
  { slug: 'arnold-press', name: 'Жим Арнольда', muscle: 'Плечи', equipment: 'Гантели', difficulty: 'intermediate' },
  { slug: 'skull-crusher', name: 'Французский жим', muscle: 'Руки', equipment: 'Штанга', difficulty: 'intermediate' },
  { slug: 'hammer-curl', name: 'Молотки', muscle: 'Руки', equipment: 'Гантели', difficulty: 'beginner' },
  { slug: 'calf-raise', name: 'Подъём на носки', muscle: 'Ноги', equipment: 'Тренажёр', difficulty: 'beginner' },
  { slug: 'leg-curl', name: 'Сгибание ног', muscle: 'Ноги', equipment: 'Тренажёр', difficulty: 'beginner' },
  { slug: 'leg-extension', name: 'Разгибание ног', muscle: 'Ноги', equipment: 'Тренажёр', difficulty: 'beginner' },
  { slug: 'pullover', name: 'Пуловер', muscle: 'Грудь', equipment: 'Гантели', difficulty: 'intermediate' },
  { slug: 'kettlebell-swing', name: 'Мах гири', muscle: 'Кор', equipment: 'Гантели', difficulty: 'intermediate' },
  { slug: 'thruster', name: 'Трастеры', muscle: 'Ноги', equipment: 'Штанга', difficulty: 'advanced' },
  { slug: 'farmers-walk', name: 'Фермерская прогулка', muscle: 'Кор', equipment: 'Гантели', difficulty: 'intermediate' },
  { slug: 'side-plank', name: 'Боковая планка', muscle: 'Кор', equipment: 'Собственный вес', difficulty: 'beginner' },
  { slug: 'mountain-climber', name: 'Скалолаз', muscle: 'Кардио', equipment: 'Собственный вес', difficulty: 'intermediate' },
  { slug: 'jump-rope', name: 'Прыжки на скакалке', muscle: 'Кардио', equipment: 'Собственный вес', difficulty: 'beginner' },
  { slug: 'push-up', name: 'Отжимания от пола', muscle: 'Грудь', equipment: 'Собственный вес', difficulty: 'beginner' },
  { slug: 'cable-fly', name: 'Сведение в кроссовере', muscle: 'Грудь', equipment: 'Кабель', difficulty: 'intermediate' },
  { slug: 'face-pull', name: 'Тяга к лицу', muscle: 'Плечи', equipment: 'Кабель', difficulty: 'beginner' },
  { slug: 'hip-thrust', name: 'Ягодичный мост со штангой', muscle: 'Ноги', equipment: 'Штанга', difficulty: 'intermediate' },
  { slug: 'bulgarian-split', name: 'Болгарские выпады', muscle: 'Ноги', equipment: 'Гантели', difficulty: 'intermediate' },
  { slug: 'seated-row', name: 'Тяга горизонтального блока', muscle: 'Спина', equipment: 'Кабель', difficulty: 'beginner' },
  { slug: 'pec-deck', name: 'Бабочка', muscle: 'Грудь', equipment: 'Тренажёр', difficulty: 'beginner' },
  { slug: 'reverse-fly', name: 'Разведение в наклоне', muscle: 'Плечи', equipment: 'Гантели', difficulty: 'beginner' },
  { slug: 'preacher-curl', name: 'Сгибания на скамье Скотта', muscle: 'Руки', equipment: 'Штанга', difficulty: 'intermediate' },
  { slug: 'cable-kickback', name: 'Отведение ноги в кроссовере', muscle: 'Ноги', equipment: 'Кабель', difficulty: 'beginner' },
  { slug: 'band-pull-apart', name: 'Разведение резинки', muscle: 'Плечи', equipment: 'Резина', difficulty: 'beginner' },
  { slug: 'band-squat', name: 'Присед с резинкой', muscle: 'Ноги', equipment: 'Резина', difficulty: 'beginner' },
  { slug: 'box-jump', name: 'Прыжки на тумбу', muscle: 'Кардио', equipment: 'Собственный вес', difficulty: 'advanced' },
  { slug: 'battle-rope', name: 'Канаты', muscle: 'Кардио', equipment: 'Кабель', difficulty: 'intermediate' },
  { slug: 'ab-wheel', name: 'Ролик для пресса', muscle: 'Кор', equipment: 'Собственный вес', difficulty: 'advanced' },
  { slug: 'hanging-leg-raise', name: 'Подъём ног в висе', muscle: 'Кор', equipment: 'Собственный вес', difficulty: 'advanced' },
  { slug: 'chin-up', name: 'Подтягивания обратным хватом', muscle: 'Руки', equipment: 'Собственный вес', difficulty: 'intermediate' },
  { slug: 'close-grip-bench', name: 'Жим узким хватом', muscle: 'Руки', equipment: 'Штанга', difficulty: 'intermediate' },
  { slug: 'sumo-deadlift', name: 'Становая сумо', muscle: 'Ноги', equipment: 'Штанга', difficulty: 'advanced' },
  { slug: 'front-squat', name: 'Фронтальные приседания', muscle: 'Ноги', equipment: 'Штанга', difficulty: 'advanced' },
  { slug: 'incline-barbell', name: 'Жим штанги на наклонной', muscle: 'Грудь', equipment: 'Штанга', difficulty: 'intermediate' },
  { slug: 'cable-crunch', name: 'Скручивания в блоке', muscle: 'Кор', equipment: 'Кабель', difficulty: 'beginner' },
  { slug: 'walking-lunge', name: 'Шагающие выпады', muscle: 'Ноги', equipment: 'Гантели', difficulty: 'intermediate' },
  { slug: 'rower', name: 'Гребной тренажёр', muscle: 'Кардио', equipment: 'Тренажёр', difficulty: 'intermediate' },
  { slug: 'stair-climber', name: 'Степпер', muscle: 'Кардио', equipment: 'Тренажёр', difficulty: 'beginner' },
]

const generated: Exercise[] = catalog.map((item) => ({
  id: `ex-${item.slug}`,
  name: item.name,
  muscleGroup: item.muscle,
  equipment: item.equipment,
  difficulty: item.difficulty,
  isPublic: item.isPublic ?? true,
}))

export const mockExercises: Exercise[] = [
  ...generated.filter((e) => e.id !== 'ex-rdl'),
  romanianDeadliftSample,
]
