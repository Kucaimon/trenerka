<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <div id="root">
    <p style="padding:2rem;text-align:center;color:#94a3b8;">
      Trenerka — загрузка приложения…
      <br><small>Если SPA не загрузилась, проверьте <code>dist/</code> или <code>TRENERKA_APP_URL</code>.</small>
    </p>
  </div>
  <?php wp_footer(); ?>
</body>
</html>
