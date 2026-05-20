<?php
if (!defined('ABSPATH')) {
    exit;
}

class Trenerka_REST {
    public static function register(): void {
        $ns = 'trenerka/v1';

        register_rest_route($ns, '/auth/me', ['methods' => 'GET', 'callback' => [__CLASS__, 'auth_me'], 'permission_callback' => '__return_true']);
        register_rest_route($ns, '/auth/register-trainer', ['methods' => 'POST', 'callback' => [__CLASS__, 'register_trainer'], 'permission_callback' => '__return_true']);
        register_rest_route($ns, '/auth/verify-email', ['methods' => 'POST', 'callback' => [__CLASS__, 'verify_email'], 'permission_callback' => '__return_true']);
        register_rest_route($ns, '/auth/reset-password', ['methods' => 'POST', 'callback' => [__CLASS__, 'reset_password'], 'permission_callback' => '__return_true']);
        register_rest_route($ns, '/auth/reset-password/confirm', ['methods' => 'POST', 'callback' => [__CLASS__, 'confirm_reset_password'], 'permission_callback' => '__return_true']);

        register_rest_route($ns, '/trainer/profile', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'get_trainer_profile'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'PATCH', 'callback' => [__CLASS__, 'update_trainer_profile'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);

        register_rest_route($ns, '/clients', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'list_clients'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'create_client'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);
        register_rest_route($ns, '/clients/(?P<id>\d+)', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'get_client'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'PUT', 'callback' => [__CLASS__, 'update_client'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'DELETE', 'callback' => [__CLASS__, 'delete_client'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);
        register_rest_route($ns, '/clients/(?P<id>\d+)/progress', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'trainer_client_progress'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'save_client_progress'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);

        register_rest_route($ns, '/messages/unread-counts', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'message_unread_counts'],
            'permission_callback' => [__CLASS__, 'trainer_only'],
        ]);

        register_rest_route($ns, '/exercises', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'list_exercises'], 'permission_callback' => [__CLASS__, 'logged_in']],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'create_exercise'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);
        register_rest_route($ns, '/exercises/(?P<id>\d+)', [
            ['methods' => 'PUT', 'callback' => [__CLASS__, 'update_exercise'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'DELETE', 'callback' => [__CLASS__, 'delete_exercise'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);

        register_rest_route($ns, '/programs', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'list_programs'], 'permission_callback' => [__CLASS__, 'logged_in']],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'save_program'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);
        register_rest_route($ns, '/programs/(?P<id>\d+)', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'get_program'], 'permission_callback' => [__CLASS__, 'logged_in']],
            ['methods' => 'PUT', 'callback' => [__CLASS__, 'save_program'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'DELETE', 'callback' => [__CLASS__, 'delete_program'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);
        register_rest_route($ns, '/client-programs', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'get_client_program'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'assign_program'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);

        register_rest_route($ns, '/events', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'list_events'], 'permission_callback' => [__CLASS__, 'logged_in']],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'save_event'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);
        register_rest_route($ns, '/events/(?P<id>\d+)', [
            ['methods' => 'PUT', 'callback' => [__CLASS__, 'save_event'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'DELETE', 'callback' => [__CLASS__, 'delete_event'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);

        register_rest_route($ns, '/payments', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'list_payments'], 'permission_callback' => [__CLASS__, 'logged_in']],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'create_payment'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);
        register_rest_route($ns, '/payments/(?P<id>\d+)', [
            ['methods' => 'PUT', 'callback' => [__CLASS__, 'update_payment'], 'permission_callback' => [__CLASS__, 'trainer_only']],
            ['methods' => 'DELETE', 'callback' => [__CLASS__, 'delete_payment'], 'permission_callback' => [__CLASS__, 'trainer_only']],
        ]);
        register_rest_route($ns, '/payments/reports', ['methods' => 'GET', 'callback' => [__CLASS__, 'payment_reports'], 'permission_callback' => [__CLASS__, 'trainer_only']]);

        register_rest_route($ns, '/messages', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'list_messages'], 'permission_callback' => [__CLASS__, 'logged_in']],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'create_message'], 'permission_callback' => [__CLASS__, 'logged_in']],
        ]);
        register_rest_route($ns, '/messages/(?P<id>\d+)/read', ['methods' => 'POST', 'callback' => [__CLASS__, 'mark_message_read'], 'permission_callback' => [__CLASS__, 'logged_in']]);

        register_rest_route($ns, '/notifications', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'list_notifications'], 'permission_callback' => [__CLASS__, 'logged_in']],
        ]);
        register_rest_route($ns, '/notifications/(?P<id>\d+)/read', ['methods' => 'POST', 'callback' => [__CLASS__, 'mark_notification_read'], 'permission_callback' => [__CLASS__, 'logged_in']]);

        register_rest_route($ns, '/client/dashboard', ['methods' => 'GET', 'callback' => [__CLASS__, 'client_dashboard'], 'permission_callback' => [__CLASS__, 'client_only']]);
        register_rest_route($ns, '/client/workouts', ['methods' => 'GET', 'callback' => [__CLASS__, 'client_workouts'], 'permission_callback' => [__CLASS__, 'client_only']]);
        register_rest_route($ns, '/client/progress', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'client_progress'], 'permission_callback' => [__CLASS__, 'client_only']],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'save_progress'], 'permission_callback' => [__CLASS__, 'client_only']],
        ]);
        register_rest_route($ns, '/client/workouts/(?P<id>\d+)/complete', ['methods' => 'POST', 'callback' => [__CLASS__, 'complete_workout'], 'permission_callback' => [__CLASS__, 'client_only']]);

        register_rest_route($ns, '/analytics/trainer', ['methods' => 'GET', 'callback' => [__CLASS__, 'trainer_analytics'], 'permission_callback' => [__CLASS__, 'trainer_only']]);
        register_rest_route($ns, '/analytics/client/(?P<id>\d+)/pdf', ['methods' => 'GET', 'callback' => [__CLASS__, 'client_progress_pdf'], 'permission_callback' => [__CLASS__, 'trainer_only']]);

        register_rest_route($ns, '/admin/stats', ['methods' => 'GET', 'callback' => [__CLASS__, 'admin_stats'], 'permission_callback' => [__CLASS__, 'admin_only']]);
        register_rest_route($ns, '/admin/users', ['methods' => 'GET', 'callback' => [__CLASS__, 'admin_users'], 'permission_callback' => [__CLASS__, 'admin_only']]);
        register_rest_route($ns, '/admin/users/(?P<id>\d+)', ['methods' => 'PATCH', 'callback' => [__CLASS__, 'admin_patch_user'], 'permission_callback' => [__CLASS__, 'admin_only']]);
        register_rest_route($ns, '/news', [
            ['methods' => 'GET', 'callback' => [__CLASS__, 'list_news'], 'permission_callback' => '__return_true'],
            ['methods' => 'POST', 'callback' => [__CLASS__, 'save_news'], 'permission_callback' => [__CLASS__, 'admin_only']],
        ]);
        register_rest_route($ns, '/news/(?P<id>\d+)', [
            ['methods' => 'PUT', 'callback' => [__CLASS__, 'save_news'], 'permission_callback' => [__CLASS__, 'admin_only']],
            ['methods' => 'DELETE', 'callback' => [__CLASS__, 'delete_news'], 'permission_callback' => [__CLASS__, 'admin_only']],
        ]);

        register_rest_route($ns, '/upload', ['methods' => 'POST', 'callback' => [__CLASS__, 'upload_file'], 'permission_callback' => [__CLASS__, 'logged_in']]);
    }

    public static function logged_in(): bool {
        return is_user_logged_in();
    }

    public static function trainer_only(): bool|WP_Error {
        return Trenerka_Permissions::require_role(['trainer', 'admin']);
    }

    public static function client_only(): bool|WP_Error {
        return Trenerka_Permissions::require_role(['client']);
    }

    public static function admin_only(): bool|WP_Error {
        return Trenerka_Permissions::require_role(['admin']);
    }

    private static function trainer_id(): int {
        return Trenerka_Permissions::current_user_id();
    }

    public static function auth_me(WP_REST_Request $request): WP_REST_Response|WP_Error {
        if (!is_user_logged_in()) {
            return new WP_Error('trenerka_unauthorized', 'Не авторизован', ['status' => 401]);
        }
        $uid = Trenerka_Permissions::current_user_id();
        $user = get_user_by('id', $uid);
        $role = Trenerka_Roles::get_user_role($uid);
        $payload = [
            'id' => (string) $uid,
            'email' => $user->user_email,
            'name' => $user->display_name,
            'role' => $role,
        ];
        if ($role === 'client') {
            $profile_id = Trenerka_Permissions::client_profile_for_user($uid);
            if ($profile_id) {
                $payload['clientProfileId'] = (string) $profile_id;
            }
        }
        return new WP_REST_Response($payload, 200);
    }

    public static function register_trainer(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $email = sanitize_email($request->get_param('email') ?? '');
        $password = (string) ($request->get_param('password') ?? '');
        $name = sanitize_text_field($request->get_param('name') ?? '');
        if (!$email || strlen($password) < 8) {
            return new WP_Error('trenerka_invalid', 'Укажите email и пароль (мин. 8 символов)', ['status' => 400]);
        }
        if (email_exists($email)) {
            return new WP_Error('trenerka_exists', 'Email уже зарегистрирован', ['status' => 409]);
        }
        if (!$name) {
            $name = strstr($email, '@', true) ?: $email;
        }
        $user_id = wp_create_user($email, $password, $email);
        if (is_wp_error($user_id)) {
            return $user_id;
        }
        wp_update_user(['ID' => $user_id, 'display_name' => $name]);
        Trenerka_Roles::set_user_role($user_id, 'trainer');
        global $wpdb;
        $wpdb->insert(Trenerka_Database::table('trainer_profiles'), [
            'user_id' => $user_id,
            'business_name' => $name,
            'full_name' => $name,
        ]);
        $verify_token = wp_generate_password(32, false);
        update_user_meta($user_id, 'trenerka_verify_token', $verify_token);
        $frontend = self::frontend_base_url();
        if ($frontend) {
            Trenerka_Email::send(
                $user_id,
                'Подтвердите email',
                "Перейдите по ссылке для подтверждения: {$frontend}/verify-email?token={$verify_token}\n\nИли войдите сразу — аккаунт уже создан.",
            );
        }
        return new WP_REST_Response(['success' => true], 201);
    }

    public static function verify_email(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $token = sanitize_text_field($request->get_param('token') ?? '');
        if (!$token) {
            return new WP_Error('trenerka_invalid', 'Неверный токен', ['status' => 400]);
        }
        $users = get_users([
            'meta_key' => 'trenerka_verify_token',
            'meta_value' => $token,
            'number' => 1,
            'fields' => 'ID',
        ]);
        if (!$users) {
            return new WP_Error('trenerka_invalid', 'Неверный или устаревший токен', ['status' => 400]);
        }
        $user_id = (int) $users[0];
        delete_user_meta($user_id, 'trenerka_verify_token');
        update_user_meta($user_id, 'trenerka_email_verified', 1);
        return new WP_REST_Response(['success' => true], 200);
    }

    public static function reset_password(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $email = sanitize_email($request->get_param('email') ?? '');
        $user = get_user_by('email', $email);
        if ($user) {
            $token = wp_generate_password(32, false);
            update_user_meta($user->ID, 'trenerka_reset_token', $token);
            update_user_meta($user->ID, 'trenerka_reset_expires', time() + 3600);
            $frontend = self::frontend_base_url();
            $link = $frontend ? "{$frontend}/reset-password?token={$token}" : '';
            Trenerka_Email::send(
                $user->ID,
                'Сброс пароля',
                $link
                    ? "Откройте ссылку для сброса пароля (действует 1 час):\n{$link}"
                    : 'Запрос на сброс пароля получен. Обратитесь к администратору сайта.',
            );
        }
        return new WP_REST_Response(['success' => true], 200);
    }

    public static function confirm_reset_password(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $token = sanitize_text_field($request->get_param('token') ?? '');
        $password = (string) ($request->get_param('password') ?? '');
        if (!$token || strlen($password) < 8) {
            return new WP_Error('trenerka_invalid', 'Неверные данные', ['status' => 400]);
        }
        $users = get_users([
            'meta_key' => 'trenerka_reset_token',
            'meta_value' => $token,
            'number' => 1,
        ]);
        if (!$users) {
            return new WP_Error('trenerka_invalid', 'Неверный или устаревший токен', ['status' => 400]);
        }
        $user = $users[0];
        $expires = (int) get_user_meta($user->ID, 'trenerka_reset_expires', true);
        if ($expires && $expires < time()) {
            return new WP_Error('trenerka_invalid', 'Срок действия ссылки истёк', ['status' => 400]);
        }
        wp_set_password($password, $user->ID);
        delete_user_meta($user->ID, 'trenerka_reset_token');
        delete_user_meta($user->ID, 'trenerka_reset_expires');
        return new WP_REST_Response(['success' => true], 200);
    }

    private static function frontend_base_url(): string {
        if (defined('TRENERKA_FRONTEND_URL') && TRENERKA_FRONTEND_URL) {
            return rtrim((string) TRENERKA_FRONTEND_URL, '/');
        }
        return rtrim((string) get_option('trenerka_frontend_url', ''), '/');
    }

    public static function get_trainer_profile(): WP_REST_Response|WP_Error {
        $uid = self::trainer_id();
        $profile = self::fetch_trainer_profile_row($uid);
        if (!$profile) {
            return new WP_REST_Response(self::format_trainer_profile($uid, []), 200);
        }
        return new WP_REST_Response(self::format_trainer_profile($uid, $profile), 200);
    }

    public static function update_trainer_profile(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $uid = self::trainer_id();
        $body = $request->get_json_params() ?: [];
        global $wpdb;
        $table = Trenerka_Database::table('trainer_profiles');
        $data = [
            'full_name' => sanitize_text_field($body['fullName'] ?? ''),
            'specialization' => sanitize_text_field($body['specialization'] ?? ''),
            'experience' => sanitize_text_field($body['experience'] ?? ''),
            'phone' => sanitize_text_field($body['phone'] ?? ''),
            'avatar_url' => esc_url_raw($body['avatarUrl'] ?? ''),
        ];
        $exists = self::fetch_trainer_profile_row($uid);
        if ($exists) {
            $wpdb->update($table, $data, ['user_id' => $uid]);
        } else {
            $user = get_user_by('id', $uid);
            $wpdb->insert($table, array_merge($data, [
                'user_id' => $uid,
                'business_name' => $user ? $user->display_name : '',
            ]));
        }
        if (!empty($data['full_name'])) {
            wp_update_user(['ID' => $uid, 'display_name' => $data['full_name']]);
        }
        $row = self::fetch_trainer_profile_row($uid) ?: [];
        return new WP_REST_Response(self::format_trainer_profile($uid, $row), 200);
    }

    private static function fetch_trainer_profile_row(int $user_id): ?array {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('trainer_profiles') . " WHERE user_id = %d",
            $user_id
        ), ARRAY_A);
        return $row ?: null;
    }

    private static function format_trainer_profile(int $user_id, array $row): array {
        $user = get_user_by('id', $user_id);
        $full_name = $row['full_name'] ?? ($user ? $user->display_name : '');
        return [
            'userId' => (string) $user_id,
            'fullName' => $full_name,
            'specialization' => $row['specialization'] ?? '',
            'experience' => $row['experience'] ?? '',
            'phone' => $row['phone'] ?? '',
            'avatarUrl' => $row['avatar_url'] ?? '',
        ];
    }

    public static function list_clients(): WP_REST_Response {
        global $wpdb;
        $table = Trenerka_Database::table('client_profiles');
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$table} WHERE trainer_user_id = %d ORDER BY name ASC",
            self::trainer_id()
        ), ARRAY_A);
        return new WP_REST_Response(array_map([__CLASS__, 'format_client'], $rows ?: []), 200);
    }

    public static function get_client(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $row = self::fetch_client((int) $request['id']);
        if (!$row) {
            return new WP_Error('not_found', 'Клиент не найден', ['status' => 404]);
        }
        return new WP_REST_Response(self::format_client($row), 200);
    }

    public static function create_client(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $data = self::sanitize_client_payload($request);
        if (email_exists($data['email'])) {
            return new WP_Error('trenerka_exists', 'Email уже используется', ['status' => 409]);
        }
        $password = wp_generate_password(12, true);
        $user_id = wp_create_user($data['email'], $password, $data['email']);
        if (is_wp_error($user_id)) {
            return $user_id;
        }
        wp_update_user(['ID' => $user_id, 'display_name' => $data['name']]);
        Trenerka_Roles::set_user_role($user_id, 'client');
        global $wpdb;
        $wpdb->insert(Trenerka_Database::table('client_profiles'), [
            'user_id' => $user_id,
            'trainer_user_id' => self::trainer_id(),
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'date_of_birth' => $data['date_of_birth'],
            'status' => $data['status'],
            'goal' => $data['goal'],
            'notes' => $data['notes'],
            'package_balance' => $data['package_balance'],
        ]);
        $profile_id = (int) $wpdb->insert_id;
        update_user_meta($user_id, Trenerka_Roles::META_CLIENT_PROFILE_ID, $profile_id);
        update_user_meta($user_id, Trenerka_Roles::META_TRAINER_ID, self::trainer_id());
        $row = self::fetch_client($profile_id);
        $formatted = self::format_client($row);
        $formatted['temporary_password'] = $password;
        return new WP_REST_Response($formatted, 201);
    }

    public static function update_client(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $id = (int) $request['id'];
        if (!Trenerka_Permissions::client_belongs_to_trainer($id, self::trainer_id())) {
            return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
        }
        $data = self::sanitize_client_payload($request);
        global $wpdb;
        $wpdb->update(Trenerka_Database::table('client_profiles'), [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'date_of_birth' => $data['date_of_birth'],
            'status' => $data['status'],
            'goal' => $data['goal'],
            'notes' => $data['notes'],
            'package_balance' => $data['package_balance'],
        ], ['id' => $id]);
        $row = self::fetch_client($id);
        return new WP_REST_Response(self::format_client($row), 200);
    }

    public static function delete_client(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $id = (int) $request['id'];
        if (!Trenerka_Permissions::client_belongs_to_trainer($id, self::trainer_id())) {
            return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
        }
        global $wpdb;
        $wpdb->update(Trenerka_Database::table('client_profiles'), ['status' => 'archive'], ['id' => $id]);
        return new WP_REST_Response(['success' => true], 200);
    }

    private static function fetch_client(int $id): ?array {
        global $wpdb;
        if (!Trenerka_Permissions::client_belongs_to_trainer($id, self::trainer_id())) {
            return null;
        }
        $table = Trenerka_Database::table('client_profiles');
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE id = %d", $id), ARRAY_A);
        return $row ?: null;
    }

    private static function sanitize_client_payload(WP_REST_Request $request): array {
        return [
            'name' => sanitize_text_field($request->get_param('name') ?? ''),
            'email' => sanitize_email($request->get_param('email') ?? ''),
            'phone' => sanitize_text_field($request->get_param('phone') ?? ''),
            'date_of_birth' => $request->get_param('dateOfBirth') ? sanitize_text_field($request->get_param('dateOfBirth')) : null,
            'status' => sanitize_text_field($request->get_param('status') ?? 'active'),
            'goal' => sanitize_textarea_field($request->get_param('goal') ?? ''),
            'notes' => sanitize_textarea_field($request->get_param('notes') ?? ''),
            'package_balance' => (int) ($request->get_param('packageBalance') ?? 0),
        ];
    }

    private static function format_client(array $row): array {
        return [
            'id' => (string) $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'] ?? '',
            'dateOfBirth' => $row['date_of_birth'] ?? null,
            'status' => $row['status'] ?? 'active',
            'joinedAt' => $row['joined_at'] ?? '',
            'packageBalance' => (int) ($row['package_balance'] ?? 0),
            'lastSession' => $row['last_session'] ?? null,
            'goal' => $row['goal'] ?? '',
            'notes' => $row['notes'] ?? '',
        ];
    }

    public static function list_exercises(): WP_REST_Response {
        global $wpdb;
        $table = Trenerka_Database::table('exercises');
        $tid = self::trainer_id();
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$table} WHERE is_public = 1 OR trainer_user_id = %d ORDER BY name ASC",
            $tid
        ), ARRAY_A);
        return new WP_REST_Response(array_map([__CLASS__, 'format_exercise'], $rows ?: []), 200);
    }

    public static function create_exercise(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $data = self::sanitize_exercise_payload($request);
        $data['trainer_user_id'] = self::trainer_id();
        $data['is_public'] = 0;
        $wpdb->insert(Trenerka_Database::table('exercises'), $data);
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('exercises') . " WHERE id = %d",
            $wpdb->insert_id
        ), ARRAY_A);
        return new WP_REST_Response(self::format_exercise($row), 201);
    }

    public static function update_exercise(WP_REST_Request $request): WP_REST_Response|WP_Error {
        return self::mutate_exercise((int) $request['id'], $request, false);
    }

    public static function delete_exercise(WP_REST_Request $request): WP_REST_Response|WP_Error {
        global $wpdb;
        $id = (int) $request['id'];
        $table = Trenerka_Database::table('exercises');
        $owner = (int) $wpdb->get_var($wpdb->prepare("SELECT trainer_user_id FROM {$table} WHERE id = %d", $id));
        if ($owner !== self::trainer_id()) {
            return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
        }
        $wpdb->delete($table, ['id' => $id]);
        return new WP_REST_Response(['success' => true], 200);
    }

    private static function mutate_exercise(int $id, WP_REST_Request $request, bool $create): WP_REST_Response|WP_Error {
        global $wpdb;
        $table = Trenerka_Database::table('exercises');
        if (!$create) {
            $owner = (int) $wpdb->get_var($wpdb->prepare("SELECT trainer_user_id FROM {$table} WHERE id = %d", $id));
            if ($owner && $owner !== self::trainer_id()) {
                return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
            }
        }
        $data = self::sanitize_exercise_payload($request);
        if ($create) {
            $wpdb->insert($table, $data);
            $id = (int) $wpdb->insert_id;
        } else {
            $wpdb->update($table, $data, ['id' => $id]);
        }
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE id = %d", $id), ARRAY_A);
        return new WP_REST_Response(self::format_exercise($row), 200);
    }

    private static function sanitize_exercise_payload(WP_REST_Request $request): array {
        return [
            'name' => sanitize_text_field($request->get_param('name') ?? ''),
            'description' => sanitize_textarea_field($request->get_param('description') ?? ''),
            'technique' => sanitize_textarea_field($request->get_param('technique') ?? ''),
            'muscle_group' => sanitize_text_field($request->get_param('muscleGroup') ?? ''),
            'equipment' => sanitize_text_field($request->get_param('equipment') ?? ''),
            'difficulty' => sanitize_text_field($request->get_param('difficulty') ?? 'intermediate'),
            'image_url' => esc_url_raw($request->get_param('imageUrl') ?? ''),
            'video_url' => esc_url_raw($request->get_param('videoUrl') ?? ''),
        ];
    }

    private static function format_exercise(array $row): array {
        return [
            'id' => (string) $row['id'],
            'name' => $row['name'],
            'description' => $row['description'] ?? '',
            'technique' => $row['technique'] ?? '',
            'muscleGroup' => $row['muscle_group'] ?? '',
            'equipment' => $row['equipment'] ?? '',
            'difficulty' => $row['difficulty'] ?? 'intermediate',
            'imageUrl' => $row['image_url'] ?? '',
            'videoUrl' => $row['video_url'] ?? '',
            'isPublic' => (bool) ($row['is_public'] ?? false),
        ];
    }

    public static function list_programs(): WP_REST_Response {
        global $wpdb;
        $programs = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('programs') . " WHERE trainer_user_id = %d ORDER BY id DESC",
            self::trainer_id()
        ), ARRAY_A);
        return new WP_REST_Response(array_map([__CLASS__, 'format_program_summary'], $programs ?: []), 200);
    }

    public static function get_program(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $program = self::load_program((int) $request['id']);
        if (!$program) {
            return new WP_Error('not_found', 'Программа не найдена', ['status' => 404]);
        }
        return new WP_REST_Response($program, 200);
    }

    public static function save_program(WP_REST_Request $request): WP_REST_Response|WP_Error {
        global $wpdb;
        $body = $request->get_json_params() ?: [];
        $id = (int) ($request['id'] ?? $body['id'] ?? 0);
        $name = sanitize_text_field($body['name'] ?? 'Программа');
        $weeks = (int) ($body['weeks'] ?? 4);
        $description = sanitize_textarea_field($body['description'] ?? '');
        $table = Trenerka_Database::table('programs');
        if ($id) {
            $owner = (int) $wpdb->get_var($wpdb->prepare("SELECT trainer_user_id FROM {$table} WHERE id = %d", $id));
            if ($owner !== self::trainer_id()) {
                return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
            }
            $wpdb->update($table, compact('name', 'weeks', 'description'), ['id' => $id]);
        } else {
            $wpdb->insert($table, [
                'trainer_user_id' => self::trainer_id(),
                'name' => $name,
                'weeks' => $weeks,
                'description' => $description,
            ]);
            $id = (int) $wpdb->insert_id;
        }
        self::sync_program_workouts($id, $body['workouts'] ?? []);
        $program = self::load_program($id);
        return new WP_REST_Response($program, $id ? 200 : 201);
    }

    public static function delete_program(WP_REST_Request $request): WP_REST_Response|WP_Error {
        global $wpdb;
        $id = (int) $request['id'];
        $table = Trenerka_Database::table('programs');
        $owner = (int) $wpdb->get_var($wpdb->prepare("SELECT trainer_user_id FROM {$table} WHERE id = %d", $id));
        if ($owner !== self::trainer_id()) {
            return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
        }
        $wpdb->delete($table, ['id' => $id]);
        return new WP_REST_Response(['success' => true], 200);
    }

    private static function sync_program_workouts(int $program_id, array $workouts): void {
        global $wpdb;
        $wt = Trenerka_Database::table('workouts');
        $wet = Trenerka_Database::table('workout_exercises');
        $existing = $wpdb->get_col($wpdb->prepare("SELECT id FROM {$wt} WHERE program_id = %d", $program_id));
        foreach ($existing as $wid) {
            $wpdb->delete($wet, ['workout_id' => (int) $wid]);
        }
        $wpdb->delete($wt, ['program_id' => $program_id]);
        foreach ($workouts as $i => $workout) {
            $wpdb->insert($wt, [
                'program_id' => $program_id,
                'week_number' => (int) ($workout['weekNumber'] ?? 1),
                'day_label' => sanitize_text_field($workout['dayLabel'] ?? ''),
                'title' => sanitize_text_field($workout['title'] ?? ''),
                'sort_order' => $i,
            ]);
            $workout_id = (int) $wpdb->insert_id;
            foreach (($workout['exercises'] ?? []) as $j => $ex) {
                $wpdb->insert($wet, [
                    'workout_id' => $workout_id,
                    'exercise_id' => (int) ($ex['exerciseId'] ?? 0),
                    'sets' => (int) ($ex['sets'] ?? 3),
                    'reps' => sanitize_text_field((string) ($ex['reps'] ?? '10')),
                    'rest_seconds' => (int) ($ex['restSeconds'] ?? 90),
                    'video_url' => esc_url_raw($ex['videoUrl'] ?? ''),
                    'sort_order' => $j,
                ]);
            }
        }
    }

    private static function load_program(int $id): ?array {
        global $wpdb;
        $table = Trenerka_Database::table('programs');
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$table} WHERE id = %d AND trainer_user_id = %d",
            $id,
            self::trainer_id()
        ), ARRAY_A);
        if (!$row) {
            return null;
        }
        $wt = Trenerka_Database::table('workouts');
        $wet = Trenerka_Database::table('workout_exercises');
        $et = Trenerka_Database::table('exercises');
        $workouts = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$wt} WHERE program_id = %d ORDER BY sort_order ASC",
            $id
        ), ARRAY_A);
        $formatted_workouts = [];
        foreach ($workouts ?: [] as $w) {
            $exercises = $wpdb->get_results($wpdb->prepare(
                "SELECT we.*, e.name, e.muscle_group, e.equipment, e.technique, e.video_url as exercise_video
                 FROM {$wet} we
                 LEFT JOIN {$et} e ON e.id = we.exercise_id
                 WHERE we.workout_id = %d ORDER BY we.sort_order ASC",
                $w['id']
            ), ARRAY_A);
            $formatted_workouts[] = [
                'id' => (string) $w['id'],
                'weekNumber' => (int) $w['week_number'],
                'dayLabel' => $w['day_label'],
                'title' => $w['title'],
                'exercises' => array_map(static function ($ex) {
                    return [
                        'id' => (string) $ex['id'],
                        'exerciseId' => (string) $ex['exercise_id'],
                        'name' => $ex['name'] ?? '',
                        'muscleGroup' => $ex['muscle_group'] ?? '',
                        'sets' => (int) $ex['sets'],
                        'reps' => $ex['reps'],
                        'restSeconds' => (int) $ex['rest_seconds'],
                        'videoUrl' => $ex['video_url'] ?: ($ex['exercise_video'] ?? ''),
                        'technique' => $ex['technique'] ?? '',
                    ];
                }, $exercises ?: []),
            ];
        }
        return array_merge(self::format_program_summary($row), ['workouts' => $formatted_workouts]);
    }

    private static function format_program_summary(array $row): array {
        return [
            'id' => (string) $row['id'],
            'name' => $row['name'],
            'description' => $row['description'] ?? '',
            'weeks' => (int) ($row['weeks'] ?? 4),
        ];
    }

    public static function get_client_program(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $client_id = (int) $request->get_param('clientId');
        if (!$client_id || !Trenerka_Permissions::client_belongs_to_trainer($client_id, self::trainer_id())) {
            return new WP_REST_Response(['program' => null], 200);
        }
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT cp.start_date, p.* FROM " . Trenerka_Database::table('client_programs') . " cp
             INNER JOIN " . Trenerka_Database::table('programs') . " p ON p.id = cp.program_id
             WHERE cp.client_id = %d AND cp.status = 'active' ORDER BY cp.id DESC LIMIT 1",
            $client_id
        ), ARRAY_A);
        if (!$row) {
            return new WP_REST_Response(['program' => null], 200);
        }
        $program = self::get_program(new WP_REST_Request('GET', '/trenerka/v1/programs/' . $row['id']));
        $data = $program->get_data();
        return new WP_REST_Response([
            'program' => is_array($data) ? $data : null,
            'startDate' => $row['start_date'] ?? null,
        ], 200);
    }

    public static function assign_program(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $body = $request->get_json_params() ?: [];
        $client_id = (int) ($body['clientId'] ?? 0);
        if (!$client_id || !Trenerka_Permissions::client_belongs_to_trainer($client_id, self::trainer_id())) {
            return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
        }
        $wpdb->update(
            Trenerka_Database::table('client_programs'),
            ['status' => 'replaced'],
            ['client_id' => $client_id, 'status' => 'active']
        );
        $wpdb->insert(Trenerka_Database::table('client_programs'), [
            'client_id' => $client_id,
            'program_id' => (int) ($body['programId'] ?? 0),
            'start_date' => sanitize_text_field($body['startDate'] ?? gmdate('Y-m-d')),
            'end_date' => !empty($body['endDate']) ? sanitize_text_field($body['endDate']) : null,
            'status' => 'active',
        ]);
        return new WP_REST_Response(['success' => true, 'id' => (string) $wpdb->insert_id], 201);
    }

    public static function trainer_client_progress(WP_REST_Request $request): WP_REST_Response {
        $client_id = (int) $request['id'];
        if (!Trenerka_Permissions::client_belongs_to_trainer($client_id, self::trainer_id())) {
            return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
        }
        global $wpdb;
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('progress_reports') . " WHERE client_id = %d ORDER BY recorded_at ASC",
            $client_id
        ), ARRAY_A);
        return new WP_REST_Response(['measurements' => array_map(static fn ($r) => [
            'date' => $r['recorded_at'],
            'weight' => (float) $r['weight'],
            'waist' => (float) $r['waist'],
            'hips' => (float) $r['hips'],
            'chest' => (float) $r['chest'],
            'arms' => (float) $r['arms'],
            'legs' => (float) $r['legs'],
            'bodyFat' => (float) $r['body_fat'],
            'notes' => $r['notes'],
            'photos' => $r['photos_json'] ? json_decode($r['photos_json'], true) : [],
        ], $rows ?: [])], 200);
    }

    public static function save_client_progress(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $client_id = (int) $request['id'];
        if (!Trenerka_Permissions::client_belongs_to_trainer($client_id, self::trainer_id())) {
            return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
        }
        $body = $request->get_json_params() ?: [];
        global $wpdb;
        $wpdb->insert(Trenerka_Database::table('progress_reports'), [
            'client_id' => $client_id,
            'weight' => (float) ($body['weight'] ?? 0),
            'waist' => (float) ($body['waist'] ?? 0),
            'hips' => (float) ($body['hips'] ?? 0),
            'chest' => (float) ($body['chest'] ?? 0),
            'arms' => (float) ($body['arms'] ?? 0),
            'legs' => (float) ($body['legs'] ?? 0),
            'body_fat' => (float) ($body['bodyFat'] ?? 0),
            'notes' => sanitize_textarea_field($body['notes'] ?? ''),
            'recorded_at' => sanitize_text_field($body['date'] ?? gmdate('Y-m-d')),
        ]);
        return new WP_REST_Response(['success' => true], 201);
    }

    public static function list_events(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $table = Trenerka_Database::table('calendar_events');
        $role = Trenerka_Roles::get_user_role(Trenerka_Permissions::current_user_id());
        if ($role === 'client') {
            $client_id = Trenerka_Permissions::client_profile_for_user(Trenerka_Permissions::current_user_id());
            $rows = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$table} WHERE client_id = %d ORDER BY start_time ASC",
                $client_id
            ), ARRAY_A);
        } else {
            $rows = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$table} WHERE trainer_user_id = %d ORDER BY start_time ASC",
                self::trainer_id()
            ), ARRAY_A);
        }
        return new WP_REST_Response(array_map([__CLASS__, 'format_event'], $rows ?: []), 200);
    }

    public static function save_event(WP_REST_Request $request): WP_REST_Response|WP_Error {
        global $wpdb;
        $body = $request->get_json_params() ?: [];
        $id = (int) ($request['id'] ?? $body['id'] ?? 0);
        $data = [
            'trainer_user_id' => self::trainer_id(),
            'client_id' => !empty($body['clientId']) ? (int) $body['clientId'] : null,
            'title' => sanitize_text_field($body['title'] ?? 'Событие'),
            'event_type' => sanitize_text_field($body['type'] ?? 'training'),
            'start_time' => sanitize_text_field($body['start'] ?? $body['startTime'] ?? ''),
            'end_time' => sanitize_text_field($body['end'] ?? $body['endTime'] ?? ''),
            'status' => sanitize_text_field($body['status'] ?? 'scheduled'),
            'recurring_rule' => !empty($body['recurring']) ? 'weekly' : null,
            'color' => sanitize_hex_color($body['color'] ?? '') ?: '',
        ];
        $table = Trenerka_Database::table('calendar_events');
        if ($id) {
            unset($data['trainer_user_id']);
            $wpdb->update($table, $data, ['id' => $id, 'trainer_user_id' => self::trainer_id()]);
        } else {
            $wpdb->insert($table, $data);
            $id = (int) $wpdb->insert_id;
        }
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE id = %d", $id), ARRAY_A);
        return new WP_REST_Response(self::format_event($row), $id ? 200 : 201);
    }

    public static function delete_event(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $wpdb->delete(Trenerka_Database::table('calendar_events'), [
            'id' => (int) $request['id'],
            'trainer_user_id' => self::trainer_id(),
        ]);
        return new WP_REST_Response(['success' => true], 200);
    }

    private static function format_event(array $row): array {
        return [
            'id' => (string) $row['id'],
            'title' => $row['title'],
            'start' => mysql_to_rfc3339($row['start_time']),
            'end' => mysql_to_rfc3339($row['end_time']),
            'clientId' => $row['client_id'] ? (string) $row['client_id'] : null,
            'type' => $row['event_type'] ?? 'training',
            'status' => $row['status'] ?? 'scheduled',
            'recurring' => !empty($row['recurring_rule']),
            'color' => $row['color'] ?? '',
        ];
    }

    public static function list_payments(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $table = Trenerka_Database::table('payments');
        $role = Trenerka_Roles::get_user_role(Trenerka_Permissions::current_user_id());
        if ($role === 'client') {
            $client_id = Trenerka_Permissions::client_profile_for_user(Trenerka_Permissions::current_user_id());
            $rows = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$table} WHERE client_id = %d ORDER BY payment_date DESC",
                $client_id
            ), ARRAY_A);
        } else {
            $rows = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$table} WHERE trainer_user_id = %d ORDER BY payment_date DESC",
                self::trainer_id()
            ), ARRAY_A);
        }
        return new WP_REST_Response(array_map([__CLASS__, 'format_payment'], $rows ?: []), 200);
    }

    public static function create_payment(WP_REST_Request $request): WP_REST_Response|WP_Error {
        global $wpdb;
        $body = $request->get_json_params() ?: [];
        $client_id = (int) ($body['clientId'] ?? 0);
        if (!Trenerka_Permissions::client_belongs_to_trainer($client_id, self::trainer_id())) {
            return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
        }
        $amount = (float) ($body['amount'] ?? 0);
        $sessions = (int) ($body['sessionsAdded'] ?? 0);
        $wpdb->insert(Trenerka_Database::table('payments'), [
            'trainer_user_id' => self::trainer_id(),
            'client_id' => $client_id,
            'amount' => $amount,
            'payment_date' => sanitize_text_field($body['paymentDate'] ?? $body['date'] ?? gmdate('Y-m-d')),
            'method' => sanitize_text_field($body['method'] ?? ''),
            'comment' => sanitize_textarea_field($body['comment'] ?? $body['note'] ?? ''),
            'sessions_added' => $sessions,
        ]);
        if ($sessions > 0) {
            $wpdb->query($wpdb->prepare(
                "UPDATE " . Trenerka_Database::table('client_profiles') . " SET package_balance = package_balance + %d WHERE id = %d",
                $sessions,
                $client_id
            ));
        }
        self::notify_user_by_client($client_id, 'payment', 'Оплата получена', 'Баланс пакета обновлён');
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('payments') . " WHERE id = %d",
            $wpdb->insert_id
        ), ARRAY_A);
        return new WP_REST_Response(self::format_payment($row), 201);
    }

    public static function update_payment(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $body = $request->get_json_params() ?: [];
        $wpdb->update(Trenerka_Database::table('payments'), [
            'amount' => (float) ($body['amount'] ?? 0),
            'payment_date' => sanitize_text_field($body['paymentDate'] ?? gmdate('Y-m-d')),
            'method' => sanitize_text_field($body['method'] ?? ''),
            'comment' => sanitize_textarea_field($body['comment'] ?? ''),
        ], ['id' => (int) $request['id'], 'trainer_user_id' => self::trainer_id()]);
        return new WP_REST_Response(['success' => true], 200);
    }

    public static function delete_payment(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $wpdb->delete(Trenerka_Database::table('payments'), [
            'id' => (int) $request['id'],
            'trainer_user_id' => self::trainer_id(),
        ]);
        return new WP_REST_Response(['success' => true], 200);
    }

    public static function payment_reports(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $from = sanitize_text_field($request->get_param('from') ?? gmdate('Y-m-01'));
        $to = sanitize_text_field($request->get_param('to') ?? gmdate('Y-m-d'));
        $table = Trenerka_Database::table('payments');
        $total = (float) $wpdb->get_var($wpdb->prepare(
            "SELECT COALESCE(SUM(amount),0) FROM {$table} WHERE trainer_user_id = %d AND payment_date BETWEEN %s AND %s",
            self::trainer_id(),
            $from,
            $to
        ));
        return new WP_REST_Response(['from' => $from, 'to' => $to, 'total' => $total], 200);
    }

    private static function format_payment(array $row): array {
        return [
            'id' => (string) $row['id'],
            'clientId' => (string) $row['client_id'],
            'amount' => (float) $row['amount'],
            'date' => $row['payment_date'],
            'method' => $row['method'] ?? '',
            'note' => $row['comment'] ?? '',
            'sessionsAdded' => (int) ($row['sessions_added'] ?? 0),
        ];
    }

    public static function list_messages(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $client_id = (int) $request->get_param('clientId');
        $table = Trenerka_Database::table('messages');
        $role = Trenerka_Roles::get_user_role(Trenerka_Permissions::current_user_id());
        if ($role === 'client') {
            $client_id = Trenerka_Permissions::client_profile_for_user(Trenerka_Permissions::current_user_id()) ?? 0;
        }
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$table} WHERE client_id = %d ORDER BY created_at ASC",
            $client_id
        ), ARRAY_A);
        return new WP_REST_Response(array_map([__CLASS__, 'format_message'], $rows ?: []), 200);
    }

    public static function create_message(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $body = $request->get_json_params() ?: [];
        $role = Trenerka_Roles::get_user_role(Trenerka_Permissions::current_user_id());
        $client_id = (int) ($body['clientId'] ?? 0);
        if ($role === 'client') {
            $client_id = Trenerka_Permissions::client_profile_for_user(Trenerka_Permissions::current_user_id()) ?? 0;
        }
        $sender = $role === 'client' ? 'client' : 'trainer';
        $trainer_id = $role === 'client'
            ? (int) get_user_meta(Trenerka_Permissions::current_user_id(), Trenerka_Roles::META_TRAINER_ID, true)
            : self::trainer_id();
        $wpdb->insert(Trenerka_Database::table('messages'), [
            'trainer_user_id' => $trainer_id,
            'client_id' => $client_id,
            'sender' => $sender,
            'text' => sanitize_textarea_field($body['text'] ?? ''),
            'attachment_url' => esc_url_raw($body['attachmentUrl'] ?? ''),
            'is_read' => 0,
        ]);
        $message_id = (int) $wpdb->insert_id;
        if ($sender === 'client') {
            self::create_notification($trainer_id, 'message', 'Новое сообщение', sanitize_textarea_field($body['text'] ?? ''));
        } else {
            self::notify_user_by_client($client_id, 'message', 'Сообщение от тренера', sanitize_textarea_field($body['text'] ?? ''));
        }
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('messages') . " WHERE id = %d",
            $message_id
        ), ARRAY_A);
        return new WP_REST_Response(self::format_message($row ?: []), 201);
    }

    public static function message_unread_counts(): WP_REST_Response {
        global $wpdb;
        $table = Trenerka_Database::table('messages');
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT client_id, COUNT(*) as cnt FROM {$table}
             WHERE trainer_user_id = %d AND sender = 'client' AND is_read = 0
             GROUP BY client_id",
            self::trainer_id()
        ), ARRAY_A);
        $counts = [];
        foreach ($rows ?: [] as $row) {
            $counts[(string) $row['client_id']] = (int) $row['cnt'];
        }
        return new WP_REST_Response($counts, 200);
    }

    public static function mark_message_read(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $wpdb->update(Trenerka_Database::table('messages'), ['is_read' => 1], ['id' => (int) $request['id']]);
        return new WP_REST_Response(['success' => true], 200);
    }

    private static function format_message(array $row): array {
        return [
            'id' => (string) $row['id'],
            'clientId' => (string) $row['client_id'],
            'sender' => $row['sender'],
            'text' => $row['text'],
            'createdAt' => mysql_to_rfc3339($row['created_at']),
            'read' => (bool) $row['is_read'],
            'attachmentUrl' => $row['attachment_url'] ?? '',
        ];
    }

    public static function list_notifications(): WP_REST_Response {
        global $wpdb;
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('notifications') . " WHERE user_id = %d ORDER BY created_at DESC LIMIT 50",
            Trenerka_Permissions::current_user_id()
        ), ARRAY_A);
        return new WP_REST_Response(array_map(static function ($row) {
            return [
                'id' => (string) $row['id'],
                'title' => $row['title'],
                'body' => $row['body'],
                'createdAt' => mysql_to_rfc3339($row['created_at']),
                'read' => (bool) $row['is_read'],
                'type' => $row['type'],
            ];
        }, $rows ?: []), 200);
    }

    public static function mark_notification_read(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $wpdb->update(Trenerka_Database::table('notifications'), ['is_read' => 1], [
            'id' => (int) $request['id'],
            'user_id' => Trenerka_Permissions::current_user_id(),
        ]);
        return new WP_REST_Response(['success' => true], 200);
    }

    private static function create_notification(int $user_id, string $type, string $title, string $body): void {
        global $wpdb;
        $wpdb->insert(Trenerka_Database::table('notifications'), [
            'user_id' => $user_id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'is_read' => 0,
        ]);
        do_action('trenerka_send_email', $user_id, $title, $body);
    }

    public static function notify_user_by_client(int $client_profile_id, string $type, string $title, string $body): void {
        global $wpdb;
        $user_id = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT user_id FROM " . Trenerka_Database::table('client_profiles') . " WHERE id = %d",
            $client_profile_id
        ));
        if ($user_id) {
            self::create_notification($user_id, $type, $title, $body);
        }
    }

    public static function client_dashboard(): WP_REST_Response {
        $uid = Trenerka_Permissions::current_user_id();
        $client_id = Trenerka_Permissions::client_profile_for_user($uid);
        global $wpdb;
        $profile = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('client_profiles') . " WHERE id = %d",
            $client_id
        ), ARRAY_A);
        $trainer = get_user_by('id', (int) get_user_meta($uid, Trenerka_Roles::META_TRAINER_ID, true));
        $next = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('calendar_events') . " WHERE client_id = %d AND start_time >= NOW() ORDER BY start_time ASC LIMIT 1",
            $client_id
        ), ARRAY_A);
        $program = $wpdb->get_row($wpdb->prepare(
            "SELECT p.name FROM " . Trenerka_Database::table('client_programs') . " cp
             JOIN " . Trenerka_Database::table('programs') . " p ON p.id = cp.program_id
             WHERE cp.client_id = %d AND cp.status = 'active' ORDER BY cp.id DESC LIMIT 1",
            $client_id
        ), ARRAY_A);
        $notifications = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('notifications') . " WHERE user_id = %d ORDER BY created_at DESC LIMIT 5",
            $uid
        ), ARRAY_A);
        $streak_days = self::client_workout_streak($client_id);
        return new WP_REST_Response([
            'clientProfileId' => (string) $client_id,
            'profile' => [
                'name' => $profile['name'] ?? '',
                'trainer' => $trainer ? $trainer->display_name : '',
                'packageBalance' => (int) ($profile['package_balance'] ?? 0),
            ],
            'currentProgram' => $program['name'] ?? 'Не назначена',
            'nextSession' => $next ? self::format_event($next) : null,
            'streakDays' => $streak_days,
            'notifications' => array_map(static fn ($n) => [
                'id' => (string) $n['id'],
                'title' => $n['title'],
                'body' => $n['body'],
                'createdAt' => mysql_to_rfc3339($n['created_at']),
                'read' => (bool) $n['is_read'],
            ], $notifications ?: []),
        ], 200);
    }

    public static function client_workouts(): WP_REST_Response {
        $client_id = Trenerka_Permissions::client_profile_for_user(Trenerka_Permissions::current_user_id());
        global $wpdb;
        $assignment = $wpdb->get_row($wpdb->prepare(
            "SELECT program_id FROM " . Trenerka_Database::table('client_programs') . " WHERE client_id = %d AND status = 'active' ORDER BY id DESC LIMIT 1",
            $client_id
        ), ARRAY_A);
        if (!$assignment) {
            return new WP_REST_Response(['workouts' => []], 200);
        }
        $program = self::load_program_for_client((int) $assignment['program_id'], $client_id);
        return new WP_REST_Response(['workouts' => $program['workouts'] ?? []], 200);
    }

    private static function client_workout_streak(int $client_id): int {
        global $wpdb;
        $dates = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT DATE(completed_at) AS d FROM " . Trenerka_Database::table('workout_completions') . "
             WHERE client_id = %d ORDER BY d DESC LIMIT 60",
            $client_id
        ));
        if (!$dates) {
            return 0;
        }
        $streak = 0;
        $cursor = gmdate('Y-m-d');
        foreach ($dates as $d) {
            if ($d !== $cursor) {
                break;
            }
            $streak++;
            $cursor = gmdate('Y-m-d', strtotime($cursor . ' -1 day'));
        }
        return $streak;
    }

    private static function load_program_for_client(int $program_id, ?int $client_id = null): array {
        global $wpdb;
        $wt = Trenerka_Database::table('workouts');
        $wet = Trenerka_Database::table('workout_exercises');
        $et = Trenerka_Database::table('exercises');
        $workouts = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$wt} WHERE program_id = %d ORDER BY sort_order ASC",
            $program_id
        ), ARRAY_A);
        $completed_ids = [];
        if ($client_id) {
            $done = $wpdb->get_col($wpdb->prepare(
                "SELECT workout_id FROM " . Trenerka_Database::table('workout_completions') . " WHERE client_id = %d",
                $client_id
            ));
            $completed_ids = array_flip(array_map('intval', $done ?: []));
        }
        $formatted = [];
        foreach ($workouts ?: [] as $w) {
            $exercises = $wpdb->get_results($wpdb->prepare(
                "SELECT we.*, e.name, e.muscle_group, e.technique, e.video_url as exercise_video
                 FROM {$wet} we LEFT JOIN {$et} e ON e.id = we.exercise_id
                 WHERE we.workout_id = %d ORDER BY we.sort_order ASC",
                $w['id']
            ), ARRAY_A);
            $wid = (int) $w['id'];
            $formatted[] = [
                'id' => (string) $wid,
                'day' => $w['day_label'],
                'title' => $w['title'],
                'status' => isset($completed_ids[$wid]) ? 'done' : 'planned',
                'exercises' => array_map(static fn ($ex) => [
                    'name' => $ex['name'],
                    'muscle' => $ex['muscle_group'],
                    'sets' => (int) $ex['sets'],
                    'reps' => $ex['reps'],
                    'rest' => (int) $ex['rest_seconds'],
                    'technique' => $ex['technique'] ?? '',
                    'videoUrl' => $ex['video_url'] ?: ($ex['exercise_video'] ?? ''),
                ], $exercises ?: []),
            ];
        }
        return ['workouts' => $formatted];
    }

    public static function client_progress(): WP_REST_Response {
        $client_id = Trenerka_Permissions::client_profile_for_user(Trenerka_Permissions::current_user_id());
        global $wpdb;
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM " . Trenerka_Database::table('progress_reports') . " WHERE client_id = %d ORDER BY recorded_at ASC",
            $client_id
        ), ARRAY_A);
        return new WP_REST_Response(['measurements' => array_map(static fn ($r) => [
            'date' => $r['recorded_at'],
            'weight' => (float) $r['weight'],
            'waist' => (float) $r['waist'],
            'hips' => (float) $r['hips'],
            'chest' => (float) $r['chest'],
            'arms' => (float) $r['arms'],
            'legs' => (float) $r['legs'],
            'bodyFat' => (float) $r['body_fat'],
            'notes' => $r['notes'],
            'photos' => $r['photos_json'] ? json_decode($r['photos_json'], true) : [],
        ], $rows ?: [])], 200);
    }

    public static function save_progress(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $body = $request->get_json_params() ?: [];
        $client_id = Trenerka_Permissions::client_profile_for_user(Trenerka_Permissions::current_user_id());
        $photos = [];
        if (!empty($body['photos']) && is_array($body['photos'])) {
            foreach ($body['photos'] as $url) {
                $clean = esc_url_raw((string) $url);
                if ($clean) {
                    $photos[] = $clean;
                }
            }
        }
        $wpdb->insert(Trenerka_Database::table('progress_reports'), [
            'client_id' => $client_id,
            'weight' => (float) ($body['weight'] ?? 0),
            'waist' => (float) ($body['waist'] ?? 0),
            'hips' => (float) ($body['hips'] ?? 0),
            'chest' => (float) ($body['chest'] ?? 0),
            'arms' => (float) ($body['arms'] ?? 0),
            'legs' => (float) ($body['legs'] ?? 0),
            'body_fat' => (float) ($body['bodyFat'] ?? 0),
            'notes' => sanitize_textarea_field($body['notes'] ?? ''),
            'photos_json' => $photos ? wp_json_encode($photos) : null,
            'recorded_at' => sanitize_text_field($body['date'] ?? gmdate('Y-m-d')),
        ]);
        return new WP_REST_Response(['success' => true], 201);
    }

    public static function complete_workout(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $client_id = Trenerka_Permissions::client_profile_for_user(Trenerka_Permissions::current_user_id());
        $wpdb->insert(Trenerka_Database::table('workout_completions'), [
            'client_id' => $client_id,
            'workout_id' => (int) $request['id'],
        ]);
        return new WP_REST_Response(['success' => true], 200);
    }

    public static function trainer_analytics(): WP_REST_Response {
        global $wpdb;
        $tid = self::trainer_id();
        $clients = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM " . Trenerka_Database::table('client_profiles') . " WHERE trainer_user_id = %d AND status = 'active'",
            $tid
        ));
        $revenue = (float) $wpdb->get_var($wpdb->prepare(
            "SELECT COALESCE(SUM(amount),0) FROM " . Trenerka_Database::table('payments') . " WHERE trainer_user_id = %d AND payment_date >= %s",
            $tid,
            gmdate('Y-m-01')
        ));
        $sessions = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM " . Trenerka_Database::table('calendar_events') . " WHERE trainer_user_id = %d AND start_time >= %s",
            $tid,
            gmdate('Y-m-d', strtotime('-7 days'))
        ));
        $unread = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM " . Trenerka_Database::table('messages') . " WHERE trainer_user_id = %d AND sender = 'client' AND is_read = 0",
            $tid
        ));
        return new WP_REST_Response([
            'activeClients' => $clients,
            'monthlyRevenue' => $revenue,
            'weeklySessions' => $sessions,
            'unreadMessages' => $unread,
        ], 200);
    }

    public static function client_progress_pdf(WP_REST_Request $request): WP_REST_Response {
        $client_id = (int) $request['id'];
        if (!Trenerka_Permissions::client_belongs_to_trainer($client_id, self::trainer_id())) {
            return new WP_Error('forbidden', 'Нет доступа', ['status' => 403]);
        }
        global $wpdb;
        $client = $wpdb->get_row($wpdb->prepare(
            "SELECT name FROM " . Trenerka_Database::table('client_profiles') . " WHERE id = %d",
            $client_id
        ), ARRAY_A);
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT recorded_at, weight, waist FROM " . Trenerka_Database::table('progress_reports') . " WHERE client_id = %d ORDER BY recorded_at ASC",
            $client_id
        ), ARRAY_A);
        $lines = ["Отчёт прогресса: " . ($client['name'] ?? ''), ''];
        foreach ($rows ?: [] as $r) {
            $lines[] = "{$r['recorded_at']}: вес {$r['weight']} кг, талия {$r['waist']} см";
        }
        $pdf = implode("\n", $lines);
        return new WP_REST_Response([
            'filename' => 'progress-' . $client_id . '.txt',
            'content' => base64_encode($pdf),
            'mime' => 'text/plain',
        ], 200);
    }

    public static function admin_stats(): WP_REST_Response {
        $users = count_users();
        global $wpdb;
        $payments = (float) $wpdb->get_var("SELECT COALESCE(SUM(amount),0) FROM " . Trenerka_Database::table('payments'));
        return new WP_REST_Response([
            'trainers' => (int) ($users['avail_roles'][Trenerka_Roles::ROLE_TRAINER] ?? 0),
            'clients' => (int) $wpdb->get_var("SELECT COUNT(*) FROM " . Trenerka_Database::table('client_profiles')),
            'paymentsTotal' => $payments,
            'exercises' => (int) $wpdb->get_var("SELECT COUNT(*) FROM " . Trenerka_Database::table('exercises')),
        ], 200);
    }

    public static function admin_users(): WP_REST_Response {
        $users = get_users(['number' => 200]);
        $data = array_map(static function ($u) {
            return [
                'id' => (string) $u->ID,
                'email' => $u->user_email,
                'name' => $u->display_name,
                'role' => Trenerka_Roles::get_user_role($u->ID),
                'blocked' => (bool) get_user_meta($u->ID, 'trenerka_blocked', true),
            ];
        }, $users);
        return new WP_REST_Response($data, 200);
    }

    public static function admin_patch_user(WP_REST_Request $request): WP_REST_Response {
        $id = (int) $request['id'];
        $body = $request->get_json_params() ?: [];
        if (isset($body['blocked'])) {
            update_user_meta($id, 'trenerka_blocked', $body['blocked'] ? 1 : 0);
        }
        return new WP_REST_Response(['success' => true], 200);
    }

    public static function list_news(): WP_REST_Response {
        global $wpdb;
        $rows = $wpdb->get_results("SELECT * FROM " . Trenerka_Database::table('news') . " ORDER BY published_at DESC", ARRAY_A);
        return new WP_REST_Response(array_map(static fn ($r) => [
            'id' => (string) $r['id'],
            'title' => $r['title'],
            'content' => $r['content'],
            'publishedAt' => mysql_to_rfc3339($r['published_at']),
        ], $rows ?: []), 200);
    }

    public static function save_news(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $body = $request->get_json_params() ?: [];
        $id = (int) ($request['id'] ?? $body['id'] ?? 0);
        $data = [
            'title' => sanitize_text_field($body['title'] ?? ''),
            'content' => wp_kses_post($body['content'] ?? ''),
            'published_at' => sanitize_text_field($body['publishedAt'] ?? gmdate('Y-m-d H:i:s')),
            'author_id' => Trenerka_Permissions::current_user_id(),
        ];
        $table = Trenerka_Database::table('news');
        if ($id) {
            $wpdb->update($table, $data, ['id' => $id]);
        } else {
            $wpdb->insert($table, $data);
            $id = (int) $wpdb->insert_id;
        }
        return new WP_REST_Response(['id' => (string) $id], $id ? 200 : 201);
    }

    public static function delete_news(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $wpdb->delete(Trenerka_Database::table('news'), ['id' => (int) $request['id']]);
        return new WP_REST_Response(['success' => true], 200);
    }

    public static function upload_file(WP_REST_Request $request): WP_REST_Response|WP_Error {
        if (empty($_FILES['file'])) {
            return new WP_Error('no_file', 'Файл не передан', ['status' => 400]);
        }
        $file = $_FILES['file'];
        if ($file['size'] > 10 * 1024 * 1024) {
            return new WP_Error('too_large', 'Максимум 10 МБ', ['status' => 400]);
        }
        require_once ABSPATH . 'wp-admin/includes/file.php';
        $upload = wp_handle_upload($file, ['test_form' => false]);
        if (!empty($upload['error'])) {
            return new WP_Error('upload_error', $upload['error'], ['status' => 400]);
        }
        return new WP_REST_Response(['url' => $upload['url']], 200);
    }
}
