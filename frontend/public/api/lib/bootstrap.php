<?php
/**
 * Shared helpers for the Villheva form endpoints.
 *
 * These replace the Nuxt server routes (server/api/*.ts) once the site is
 * served as static files from domene.no, which has PHP but no Node runtime.
 * Mail still goes through Resend's REST API rather than PHP mail(), because
 * shared-host mail() has poor deliverability.
 */

declare(strict_types=1);

// Never leak a stack trace or a config value to the client.
ini_set('display_errors', '0');
error_reporting(E_ALL);

const VILLHEVA_RATE_LIMIT_MAX     = 5;   // requests ...
const VILLHEVA_RATE_LIMIT_WINDOW  = 600; // ... per this many seconds, per IP

/**
 * Read a setting from the environment, falling back to lib/config.php.
 * config.php is git-ignored and created on the server; see config.example.php.
 */
function villheva_config(string $key, ?string $default = null): ?string
{
    static $file = null;
    if ($file === null) {
        $file = [];
        $path = __DIR__ . '/config.php';
        if (is_readable($path)) {
            $loaded = require $path;
            if (is_array($loaded)) {
                $file = $loaded;
            }
        }
    }

    $env = getenv($key);
    if (is_string($env) && $env !== '') {
        return $env;
    }
    if (isset($file[$key]) && $file[$key] !== '') {
        return (string) $file[$key];
    }
    return $default;
}

function villheva_json(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Error shape matches what the Nuxt client reads: error.data?.message */
function villheva_fail(int $status, string $message): void
{
    villheva_json($status, ['success' => false, 'message' => $message]);
}

function villheva_require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        villheva_fail(405, 'Method Not Allowed');
    }
}

/** $fetch sends a JSON body; parse it or fail with 400. */
function villheva_read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        villheva_fail(400, 'Empty request body');
    }
    if (strlen($raw) > 100_000) {
        villheva_fail(413, 'Request body too large');
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        villheva_fail(400, 'Invalid JSON body');
    }
    return $data;
}

function villheva_escape(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function villheva_is_email(?string $value): bool
{
    return is_string($value) && filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Coarse per-IP throttle. These endpoints send mail without authentication,
 * so an unthrottled one is an open relay for spammers and a fast route to a
 * blocked sending domain.
 */
function villheva_rate_limit(string $bucket): void
{
    $ip  = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $dir = sys_get_temp_dir() . '/villheva-rl';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $file = $dir . '/' . $bucket . '-' . sha1($ip);

    $now  = time();
    $hits = [];
    if (is_readable($file)) {
        $decoded = json_decode((string) file_get_contents($file), true);
        if (is_array($decoded)) {
            $hits = array_filter(
                $decoded,
                static fn($t) => is_int($t) && $t > $now - VILLHEVA_RATE_LIMIT_WINDOW
            );
        }
    }

    if (count($hits) >= VILLHEVA_RATE_LIMIT_MAX) {
        villheva_fail(429, 'For mange forsøk. Vennligst prøv igjen om noen minutter.');
    }

    $hits[] = $now;
    @file_put_contents($file, json_encode(array_values($hits)), LOCK_EX);
}

/**
 * Send one email through the Resend REST API.
 * Throws RuntimeException so callers can decide the response status.
 */
function villheva_send_email(array $options): void
{
    $apiKey = villheva_config('RESEND_API_KEY');
    if ($apiKey === null) {
        throw new RuntimeException('RESEND_API_KEY is not configured on the server.');
    }

    $payload = [
        'from'    => $options['from']
            ?? villheva_config('RESEND_FROM_EMAIL', 'noreply@villheva.no'),
        'to'      => (array) $options['to'],
        'subject' => $options['subject'],
        'html'    => $options['html'],
    ];
    if (!empty($options['reply_to'])) {
        // Resend's REST API uses snake_case here, unlike the Node SDK.
        $payload['reply_to'] = $options['reply_to'];
    }

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ]);

    $body   = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($body === false) {
        throw new RuntimeException('Could not reach Resend: ' . $err);
    }
    if ($status < 200 || $status >= 300) {
        $decoded = json_decode((string) $body, true);
        $detail  = is_array($decoded) && isset($decoded['message'])
            ? (string) $decoded['message']
            : (string) $body;
        throw new RuntimeException('Resend returned ' . $status . ': ' . $detail);
    }
}

/** Log server-side, return a generic message to the client. */
function villheva_handle_exception(Throwable $e, string $context): void
{
    error_log('[villheva] ' . $context . ': ' . $e->getMessage());
    villheva_fail(500, 'Noe gikk galt. Vennligst prøv igjen senere.');
}
