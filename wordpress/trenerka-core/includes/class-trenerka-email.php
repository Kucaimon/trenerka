<?php
if (!defined('ABSPATH')) {
    exit;
}

class Trenerka_Email {
    public static function register(): void {
        add_action('trenerka_send_email', [__CLASS__, 'send'], 10, 3);
    }

    public static function send(int $user_id, string $subject, string $message): bool {
        $user = get_user_by('id', $user_id);
        if (!$user || !is_email($user->user_email)) {
            return false;
        }
        return (bool) wp_mail($user->user_email, '[Trenerka] ' . $subject, wp_strip_all_tags($message));
    }
}
