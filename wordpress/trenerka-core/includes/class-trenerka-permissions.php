<?php
if (!defined('ABSPATH')) {
    exit;
}

class Trenerka_Permissions {
    public static function current_user_id(): int {
        return (int) get_current_user_id();
    }

    public static function require_auth(): bool|WP_Error {
        if (!is_user_logged_in()) {
            return new WP_Error('trenerka_unauthorized', 'Требуется авторизация', ['status' => 401]);
        }
        return true;
    }

    public static function require_role(array $roles): bool|WP_Error {
        $check = self::require_auth();
        if (is_wp_error($check)) {
            return $check;
        }
        $role = Trenerka_Roles::get_user_role(self::current_user_id());
        if (!in_array($role, $roles, true)) {
            return new WP_Error('trenerka_forbidden', 'Недостаточно прав', ['status' => 403]);
        }
        return true;
    }

    public static function client_belongs_to_trainer(int $client_profile_id, int $trainer_user_id): bool {
        global $wpdb;
        $table = Trenerka_Database::table('client_profiles');
        $owner = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT trainer_user_id FROM {$table} WHERE id = %d",
            $client_profile_id
        ));
        return $owner === $trainer_user_id;
    }

    public static function client_profile_for_user(int $user_id): ?int {
        $id = get_user_meta($user_id, Trenerka_Roles::META_CLIENT_PROFILE_ID, true);
        return $id ? (int) $id : null;
    }
}
