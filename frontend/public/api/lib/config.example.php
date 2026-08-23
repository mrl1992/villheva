<?php
/**
 * Copy this file to config.php on the server and fill in the real values.
 *
 *   cp config.example.php config.php
 *
 * config.php is git-ignored so the key never reaches the repository, and the
 * .htaccess at the site root blocks web access to this whole directory.
 * Environment variables of the same name take precedence if the host sets any.
 */

return [
    'RESEND_API_KEY'     => '',
    'RESEND_FROM_EMAIL'  => 'noreply@villheva.no',
    'ADMIN_EMAIL'        => 'post@villheva.no',
];
