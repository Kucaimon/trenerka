<?php
/**
 * Plugin Name: Trenerka Core
 * Description: CPTs, REST API fields, JWT auth integration for Trenerka fitness SaaS.
 * Version: 1.0.0
 * Author: Trenerka
 * Text Domain: trenerka-core
 */

if (!defined('ABSPATH')) {
    exit;
}

define('TRENERKA_CORE_VERSION', '1.0.0');
define('TRENERKA_CORE_PATH', plugin_dir_path(__FILE__));

require_once TRENERKA_CORE_PATH . 'includes/class-trenerka-cpt.php';
require_once TRENERKA_CORE_PATH . 'includes/class-trenerka-database.php';
require_once TRENERKA_CORE_PATH . 'includes/class-trenerka-roles.php';
require_once TRENERKA_CORE_PATH . 'includes/class-trenerka-permissions.php';
require_once TRENERKA_CORE_PATH . 'includes/class-trenerka-seeder.php';
require_once TRENERKA_CORE_PATH . 'includes/class-trenerka-rest.php';
require_once TRENERKA_CORE_PATH . 'includes/class-trenerka-cron.php';
require_once TRENERKA_CORE_PATH . 'includes/class-trenerka-email.php';

final class Trenerka_Core {
    public function __construct() {
        register_activation_hook(__FILE__, [$this, 'activate']);
        add_action('init', [$this, 'init']);
        add_action('rest_api_init', [$this, 'rest']);
        Trenerka_Email::register();
        Trenerka_Cron::register();
    }

    public function activate(): void {
        Trenerka_Database::install();
        Trenerka_Roles::register();
        Trenerka_Seeder::maybe_seed_exercises();
    }

    public function init(): void {
        Trenerka_CPT::register();
        Trenerka_Roles::register();
        Trenerka_Seeder::maybe_seed_exercises();
    }

    public function rest(): void {
        Trenerka_REST::register();
    }
}

new Trenerka_Core();
