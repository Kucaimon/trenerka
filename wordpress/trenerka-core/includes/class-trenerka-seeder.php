<?php
if (!defined('ABSPATH')) {
    exit;
}

class Trenerka_Seeder {
    public static function maybe_seed_exercises(): void {
        if (get_option('trenerka_seeded_exercises')) {
            return;
        }
        global $wpdb;
        $table = Trenerka_Database::table('exercises');
        $count = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");
        if ($count >= 30) {
            update_option('trenerka_seeded_exercises', 1);
            return;
        }

        $names = [
            'Жим лёжа', 'Приседания со штангой', 'Становая тяга', 'Подтягивания', 'Жим стоя',
            'Тяга штанги в наклоне', 'Выпады с гантелями', 'Жим гантелей на наклонной',
            'Разгибания на трицепс', 'Сгибания на бицепс', 'Планка', 'Берпи',
            'Румынская тяга', 'Жим ногами', 'Тяга верхнего блока', 'Отжимания на брусьях',
            'Махи гантелями в стороны', 'Скручивания', 'Гиперэкстензия', 'Беговая дорожка',
            'Эллипс', 'Велосипед', 'Боковые выпады', 'Ягодичный мост', 'Тяга гантели одной рукой',
            'Жим Арнольда', 'Французский жим', 'Молотки', 'Подъём на носки', 'Сгибание ног',
            'Разгибание ног', 'Пуловер', 'Рывок гири', 'Трастеры', 'Фермерская прогулка',
            'Боковая планка', 'Скалолаз', 'Прыжки на скакалке',
        ];
        $muscles = ['Грудь', 'Спина', 'Ноги', 'Плечи', 'Руки', 'Кор', 'Кардио'];
        $equipment = ['Штанга', 'Гантели', 'Тренажёр', 'Собственный вес', 'Кабель', 'Резина'];
        $difficulties = ['beginner', 'intermediate', 'advanced'];

        foreach ($names as $i => $name) {
            $wpdb->insert($table, [
                'trainer_user_id' => null,
                'name' => $name,
                'description' => 'Базовое упражнение каталога Trenerka.',
                'technique' => 'Соблюдайте технику и контролируйте амплитуду.',
                'muscle_group' => $muscles[$i % count($muscles)],
                'equipment' => $equipment[$i % count($equipment)],
                'difficulty' => $difficulties[$i % count($difficulties)],
                'is_public' => 1,
            ]);
        }

        update_option('trenerka_seeded_exercises', 1);
    }
}
