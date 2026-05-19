<?php
if (!defined('ABSPATH')) {
    exit;
}

class Trenerka_CPT {
    public static function register(): void {
        $types = [
            'trenerka_client' => ['singular' => 'Клиент', 'plural' => 'Клиенты'],
            'trenerka_exercise' => ['singular' => 'Упражнение', 'plural' => 'Упражнения'],
            'trenerka_program' => ['singular' => 'Программа', 'plural' => 'Программы'],
            'trenerka_event' => ['singular' => 'Событие', 'plural' => 'События'],
            'trenerka_payment' => ['singular' => 'Оплата', 'plural' => 'Оплаты'],
            'trenerka_message' => ['singular' => 'Сообщение', 'plural' => 'Сообщения'],
        ];

        foreach ($types as $slug => $labels) {
            register_post_type($slug, [
                'labels' => [
                    'name' => $labels['plural'],
                    'singular_name' => $labels['singular'],
                ],
                'public' => true,
                'show_in_rest' => true,
                'supports' => ['title', 'editor', 'custom-fields'],
                'capability_type' => 'post',
                'map_meta_cap' => true,
            ]);
        }

        register_post_meta('trenerka_client', 'email', ['show_in_rest' => true, 'single' => true, 'type' => 'string']);
        register_post_meta('trenerka_client', 'phone', ['show_in_rest' => true, 'single' => true, 'type' => 'string']);
        register_post_meta('trenerka_client', 'status', ['show_in_rest' => true, 'single' => true, 'type' => 'string']);
        register_post_meta('trenerka_client', 'package_balance', ['show_in_rest' => true, 'single' => true, 'type' => 'integer']);
        register_post_meta('trenerka_exercise', 'muscle_group', ['show_in_rest' => true, 'single' => true, 'type' => 'string']);
        register_post_meta('trenerka_exercise', 'equipment', ['show_in_rest' => true, 'single' => true, 'type' => 'string']);
        register_post_meta('trenerka_exercise', 'difficulty', ['show_in_rest' => true, 'single' => true, 'type' => 'string']);
    }
}
