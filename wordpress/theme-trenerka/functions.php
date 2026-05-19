<?php
/**
 * Trenerka theme — loads React SPA from Vite dist or redirects.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('TRENERKA_APP_URL', getenv('TRENERKA_APP_URL') ?: 'http://localhost:5173');

function trenerka_enqueue_app(): void {
    $dist = get_template_directory() . '/dist';
    $manifest = $dist . '/.vite/manifest.json';

    if (file_exists($manifest)) {
        $data = json_decode(file_get_contents($manifest), true);
        $entry = $data['src/main.tsx'] ?? $data['index.html'] ?? null;
        if ($entry && isset($entry['file'])) {
            wp_enqueue_script('trenerka-app', get_template_directory_uri() . '/dist/' . $entry['file'], [], null, true);
            if (!empty($entry['css'])) {
                foreach ((array) $entry['css'] as $css) {
                    wp_enqueue_style('trenerka-app', get_template_directory_uri() . '/dist/' . $css, [], null);
                }
            }
            return;
        }
    }

    // Fallback: redirect to Vite dev server or production subdomain
    if (!is_admin()) {
        wp_redirect(TRENERKA_APP_URL);
        exit;
    }
}
add_action('wp_enqueue_scripts', 'trenerka_enqueue_app');

function trenerka_theme_setup(): void {
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'trenerka_theme_setup');
