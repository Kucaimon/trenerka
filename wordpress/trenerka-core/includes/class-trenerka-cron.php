<?php
if (!defined('ABSPATH')) {
    exit;
}

class Trenerka_Cron {
    public static function register(): void {
        add_action('trenerka_session_reminders', [__CLASS__, 'send_reminders']);
        if (!wp_next_scheduled('trenerka_session_reminders')) {
            wp_schedule_event(time(), 'hourly', 'trenerka_session_reminders');
        }
    }

    public static function send_reminders(): void {
        global $wpdb;
        $table = Trenerka_Database::table('calendar_events');
        $windows = [120, 30];
        foreach ($windows as $minutes) {
            $from = gmdate('Y-m-d H:i:s', time() + ($minutes - 5) * 60);
            $to = gmdate('Y-m-d H:i:s', time() + ($minutes + 5) * 60);
            $events = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$table} WHERE status = 'scheduled' AND start_time BETWEEN %s AND %s",
                $from,
                $to
            ), ARRAY_A);
            foreach ($events ?: [] as $event) {
                if (!$event['client_id']) {
                    continue;
                }
                $meta_key = 'trenerka_reminder_' . $minutes . '_' . $event['id'];
                if (get_option($meta_key)) {
                    continue;
                }
                Trenerka_REST::notify_user_by_client((int) $event['client_id'], 'reminder', 'Напоминание о тренировке', sprintf(
                    'Через %d мин: %s',
                    $minutes,
                    $event['title']
                ));
                update_option($meta_key, 1, false);
            }
        }
    }
}
