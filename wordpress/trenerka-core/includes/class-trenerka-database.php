<?php
if (!defined('ABSPATH')) {
    exit;
}

class Trenerka_Database {
    public static function table(string $name): string {
        global $wpdb;
        return $wpdb->prefix . 'trenerka_' . $name;
    }

    public static function install(): void {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();

        $tables = [
            "CREATE TABLE " . self::table('trainer_profiles') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                user_id bigint(20) unsigned NOT NULL,
                business_name varchar(255) DEFAULT '',
                full_name varchar(255) DEFAULT '',
                specialization varchar(255) DEFAULT '',
                experience varchar(128) DEFAULT '',
                phone varchar(64) DEFAULT '',
                avatar_url varchar(512) DEFAULT '',
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY user_id (user_id)
            ) $charset;",
            "CREATE TABLE " . self::table('client_profiles') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                user_id bigint(20) unsigned DEFAULT NULL,
                trainer_user_id bigint(20) unsigned NOT NULL,
                name varchar(255) NOT NULL,
                email varchar(255) NOT NULL,
                phone varchar(64) DEFAULT '',
                date_of_birth date DEFAULT NULL,
                status varchar(32) DEFAULT 'active',
                goal text,
                notes text,
                package_balance int DEFAULT 0,
                joined_at datetime DEFAULT CURRENT_TIMESTAMP,
                last_session datetime DEFAULT NULL,
                PRIMARY KEY (id),
                KEY trainer_user_id (trainer_user_id),
                KEY email (email)
            ) $charset;",
            "CREATE TABLE " . self::table('exercises') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                trainer_user_id bigint(20) unsigned DEFAULT NULL,
                name varchar(255) NOT NULL,
                description text,
                technique text,
                muscle_group varchar(128) DEFAULT '',
                equipment varchar(128) DEFAULT '',
                difficulty varchar(32) DEFAULT 'intermediate',
                image_url varchar(512) DEFAULT '',
                video_url varchar(512) DEFAULT '',
                pdf_url varchar(512) DEFAULT '',
                is_public tinyint(1) DEFAULT 0,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY trainer_user_id (trainer_user_id)
            ) $charset;",
            "CREATE TABLE " . self::table('programs') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                trainer_user_id bigint(20) unsigned NOT NULL,
                name varchar(255) NOT NULL,
                description text,
                pdf_url varchar(512) DEFAULT '',
                weeks int DEFAULT 4,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY trainer_user_id (trainer_user_id)
            ) $charset;",
            "CREATE TABLE " . self::table('workouts') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                program_id bigint(20) unsigned NOT NULL,
                week_number int DEFAULT 1,
                day_label varchar(64) DEFAULT '',
                title varchar(255) DEFAULT '',
                sort_order int DEFAULT 0,
                PRIMARY KEY (id),
                KEY program_id (program_id)
            ) $charset;",
            "CREATE TABLE " . self::table('workout_exercises') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                workout_id bigint(20) unsigned NOT NULL,
                exercise_id bigint(20) unsigned NOT NULL,
                sets int DEFAULT 3,
                reps varchar(32) DEFAULT '10',
                rest_seconds int DEFAULT 90,
                video_url varchar(512) DEFAULT '',
                technique text,
                image_url varchar(512) DEFAULT '',
                pdf_url varchar(512) DEFAULT '',
                sort_order int DEFAULT 0,
                PRIMARY KEY (id),
                KEY workout_id (workout_id)
            ) $charset;",
            "CREATE TABLE " . self::table('client_programs') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                client_id bigint(20) unsigned NOT NULL,
                program_id bigint(20) unsigned NOT NULL,
                start_date date NOT NULL,
                end_date date DEFAULT NULL,
                status varchar(32) DEFAULT 'active',
                PRIMARY KEY (id),
                KEY client_id (client_id)
            ) $charset;",
            "CREATE TABLE " . self::table('calendar_events') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                trainer_user_id bigint(20) unsigned NOT NULL,
                client_id bigint(20) unsigned DEFAULT NULL,
                title varchar(255) NOT NULL,
                event_type varchar(64) DEFAULT 'training',
                start_time datetime NOT NULL,
                end_time datetime NOT NULL,
                status varchar(32) DEFAULT 'scheduled',
                recurring_rule varchar(255) DEFAULT NULL,
                parent_event_id bigint(20) unsigned DEFAULT NULL,
                color varchar(32) DEFAULT '',
                PRIMARY KEY (id),
                KEY trainer_user_id (trainer_user_id),
                KEY start_time (start_time)
            ) $charset;",
            "CREATE TABLE " . self::table('payments') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                trainer_user_id bigint(20) unsigned NOT NULL,
                client_id bigint(20) unsigned NOT NULL,
                amount decimal(12,2) NOT NULL,
                payment_date date NOT NULL,
                method varchar(64) DEFAULT '',
                comment text,
                sessions_added int DEFAULT 0,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY trainer_user_id (trainer_user_id),
                KEY payment_date (payment_date)
            ) $charset;",
            "CREATE TABLE " . self::table('messages') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                trainer_user_id bigint(20) unsigned NOT NULL,
                client_id bigint(20) unsigned NOT NULL,
                sender varchar(16) NOT NULL,
                text text NOT NULL,
                attachment_url varchar(512) DEFAULT '',
                is_read tinyint(1) DEFAULT 0,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY thread (trainer_user_id, client_id)
            ) $charset;",
            "CREATE TABLE " . self::table('progress_reports') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                client_id bigint(20) unsigned NOT NULL,
                weight decimal(6,2) DEFAULT NULL,
                waist decimal(6,2) DEFAULT NULL,
                hips decimal(6,2) DEFAULT NULL,
                chest decimal(6,2) DEFAULT NULL,
                arms decimal(6,2) DEFAULT NULL,
                legs decimal(6,2) DEFAULT NULL,
                body_fat decimal(5,2) DEFAULT NULL,
                photos_json longtext,
                notes text,
                recorded_at date NOT NULL,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY client_id (client_id)
            ) $charset;",
            "CREATE TABLE " . self::table('notifications') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                user_id bigint(20) unsigned NOT NULL,
                type varchar(64) DEFAULT 'info',
                title varchar(255) NOT NULL,
                body text,
                is_read tinyint(1) DEFAULT 0,
                meta_json longtext,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY user_id (user_id)
            ) $charset;",
            "CREATE TABLE " . self::table('news') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                title varchar(255) NOT NULL,
                content longtext,
                published_at datetime DEFAULT CURRENT_TIMESTAMP,
                author_id bigint(20) unsigned DEFAULT NULL,
                PRIMARY KEY (id)
            ) $charset;",
            "CREATE TABLE " . self::table('workout_completions') . " (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                client_id bigint(20) unsigned NOT NULL,
                workout_id bigint(20) unsigned NOT NULL,
                completed_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY client_id (client_id)
            ) $charset;",
        ];

        foreach ($tables as $sql) {
            dbDelta($sql);
        }

        update_option('trenerka_db_version', TRENERKA_CORE_VERSION);
    }
}
