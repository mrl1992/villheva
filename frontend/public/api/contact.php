<?php
/**
 * Contact form endpoint. Port of server/api/contact.post.ts.
 * Reached as /api/contact via the rewrite in the site-root .htaccess, so the
 * Nuxt client keeps calling the same path it does in dev.
 */

declare(strict_types=1);

require __DIR__ . '/lib/bootstrap.php';

date_default_timezone_set('Europe/Oslo');

villheva_require_post();
villheva_rate_limit('contact');

$body = villheva_read_json_body();

$name    = trim((string) ($body['name'] ?? ''));
$email   = trim((string) ($body['email'] ?? ''));
$message = trim((string) ($body['message'] ?? ''));
$subject = trim((string) ($body['subject'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    villheva_fail(400, 'Missing required fields: name, email, message');
}
if (!villheva_is_email($email)) {
    villheva_fail(400, 'Invalid email address');
}
if ($subject === '') {
    $subject = 'Generell henvendelse';
}

$safeName    = villheva_escape($name);
$safeEmail   = villheva_escape($email);
$safeSubject = villheva_escape($subject);
$safeMessage = villheva_escape($message);

$adminHtml = <<<HTML
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4d4738;">Ny melding fra kontaktskjema</h2>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Navn:</strong> {$safeName}</p>
          <p><strong>E-post:</strong> {$safeEmail}</p>
          <p><strong>Emne:</strong> {$safeSubject}</p>
        </div>

        <div style="background-color: #fafafa; padding: 20px; border-radius: 8px; border-left: 4px solid #C0AE94;">
          <p><strong>Melding:</strong></p>
          <p style="white-space: pre-wrap; color: #555;">{$safeMessage}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

        <p style="font-size: 12px; color: #999;">
          Svar til: <a href="mailto:{$safeEmail}">{$safeEmail}</a>
        </p>
      </div>
HTML;

$confirmationHtml = <<<HTML
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4d4738;">Takk for at du kontaktet oss</h2>

        <p>Hei {$safeName},</p>

        <p>Vi har mottatt meldingen din og vil svare så snart som mulig.</p>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Din melding:</strong></p>
          <p style="white-space: pre-wrap; color: #555;">{$safeMessage}</p>
        </div>

        <p>Med vennlig hilsen,<br/>Villheva Team</p>
      </div>
HTML;

$adminEmail = villheva_config('ADMIN_EMAIL') ?? villheva_config('RESEND_FROM_EMAIL');
if ($adminEmail === null) {
    error_log('[villheva] contact: neither ADMIN_EMAIL nor RESEND_FROM_EMAIL is configured');
    villheva_fail(500, 'Noe gikk galt. Vennligst prøv igjen senere.');
}

try {
    villheva_send_email([
        'to'       => $adminEmail,
        'subject'  => 'Ny henvendelse: ' . $subject,
        'html'     => $adminHtml,
        'reply_to' => $email,
    ]);

    villheva_send_email([
        'to'      => $email,
        'subject' => 'Vi mottok meldingen din',
        'html'    => $confirmationHtml,
    ]);
} catch (Throwable $e) {
    villheva_handle_exception($e, 'contact');
}

villheva_json(200, [
    'success' => true,
    'message' => 'Email sent successfully',
]);
