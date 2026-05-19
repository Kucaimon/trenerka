<?php
if (!defined('ABSPATH')) {
    exit;
}

class Trenerka_Roles {
    public const ROLE_TRAINER = 'trenerka_trainer';
    public const ROLE_CLIENT = 'trenerka_client';
    public const META_ROLE = 'trenerka_role';
    public const META_TRAINER_ID = 'trenerka_trainer_user_id';
    public const META_CLIENT_PROFILE_ID = 'trenerka_client_profile_id';

    public static function register(): void {
        add_role(self::ROLE_TRAINER, 'Тренер Trenerka', ['read' => true]);
        add_role(self::ROLE_CLIENT, 'Клиент Trenerka', ['read' => true]);

        $admin = get_role('administrator');
        if ($admin && !$admin->has_cap('trenerka_manage_platform')) {
            $admin->add_cap('trenerka_manage_platform');
        }
    }

    public static function set_user_role(int $user_id, string $role): void {
        update_user_meta($user_id, self::META_ROLE, $role);
        $user = get_user_by('id', $user_id);
        if (!$user) {
            return;
        }
        $user->set_role($role === 'admin' ? 'administrator' : $role);
    }

    public static function get_user_role(int $user_id): string {
        $meta = get_user_meta($user_id, self::META_ROLE, true);
        if ($meta) {
            return (string) $meta;
        }
        $user = get_user_by('id', $user_id);
        if ($user && in_array('administrator', $user->roles, true)) {
            return 'admin';
        }
        if ($user && in_array(self::ROLE_TRAINER, $user->roles, true)) {
            return 'trainer';
        }
        if ($user && in_array(self::ROLE_CLIENT, $user->roles, true)) {
            return 'client';
        }
        return 'client';
    }
}
