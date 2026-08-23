<?php
/**
 * Order endpoint. Port of server/api/order.post.ts.
 * Reached as /api/order via the rewrite in the site-root .htaccess.
 */

declare(strict_types=1);

require __DIR__ . '/lib/bootstrap.php';

date_default_timezone_set('Europe/Oslo');

villheva_require_post();
villheva_rate_limit('order');

$body = villheva_read_json_body();

$items    = $body['items'] ?? null;
$total    = $body['total'] ?? null;
$customer = $body['customer'] ?? null;

if (
    !is_array($items) || $items === []
    || !is_array($customer)
    || trim((string) ($customer['name'] ?? '')) === ''
    || trim((string) ($customer['email'] ?? '')) === ''
    || trim((string) ($customer['phone'] ?? '')) === ''
) {
    villheva_fail(400, 'Missing required fields: items, total, customer details');
}

$customerName  = trim((string) $customer['name']);
$customerEmail = trim((string) $customer['email']);
$customerPhone = trim((string) $customer['phone']);
$customerNotes = trim((string) ($customer['notes'] ?? ''));

if (!villheva_is_email($customerEmail)) {
    villheva_fail(400, 'Invalid email address');
}

$orderNumber = 'ORD-' . (int) round(microtime(true) * 1000);
$orderDate   = date('j.n.Y');
$orderTime   = date('H:i:s');

$itemsHtml = '';
foreach ($items as $item) {
    if (!is_array($item)) {
        continue;
    }
    $title    = villheva_escape((string) ($item['title'] ?? ''));
    $quantity = (int) ($item['quantity'] ?? 0);
    $price    = (float) ($item['price'] ?? 0);
    $lineSum  = $price * $quantity;
    $priceStr = rtrim(rtrim(number_format($price, 2, '.', ''), '0'), '.');
    $lineStr  = rtrim(rtrim(number_format($lineSum, 2, '.', ''), '0'), '.');

    $itemsHtml .= <<<HTML

      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; text-align: left;">{$title}</td>
        <td style="padding: 12px 0; text-align: center;">{$quantity}</td>
        <td style="padding: 12px 0; text-align: right;">{$priceStr} kr</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600;">{$lineStr} kr</td>
      </tr>
    
HTML;
}

$safeName  = villheva_escape($customerName);
$safeEmail = villheva_escape($customerEmail);
$safePhone = villheva_escape($customerPhone);
$safeNotes = villheva_escape($customerNotes);
$totalStr  = is_numeric($total)
    ? rtrim(rtrim(number_format((float) $total, 2, '.', ''), '0'), '.')
    : '0';

$tableHead = <<<HTML
            <thead>
              <tr style="background-color: #e8dcd2;">
                <th style="padding: 12px; text-align: left; color: #4d4738; font-weight: 600;">Produkt</th>
                <th style="padding: 12px; text-align: center; color: #4d4738; font-weight: 600;">Antall</th>
                <th style="padding: 12px; text-align: right; color: #4d4738; font-weight: 600;">Pris</th>
                <th style="padding: 12px; text-align: right; color: #4d4738; font-weight: 600;">Total</th>
              </tr>
            </thead>
HTML;

$customerNotesBlock = $customerNotes === '' ? '' : <<<HTML
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #4d4738; font-weight: 600;">Spesielle instruksjoner:</p>
              <p style="margin: 0; color: #666; white-space: pre-wrap;">{$safeNotes}</p>
            </div>
HTML;

$adminNotesBlock = $customerNotes === '' ? '' : <<<HTML
            <h3 style="color: #4d4738; margin: 20px 0 15px 0;">Spesielle instruksjoner:</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #c0ae94;">
              <p style="margin: 0; color: #666; white-space: pre-wrap;">{$safeNotes}</p>
            </div>
HTML;

// EMAIL 1: Receipt for the customer
$customerEmailHtml = <<<HTML
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #4d4738 0%, #6d5d50 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-family: 'Playfair Display', serif; font-size: 28px;">Villheva</h1>
          <p style="color: #e8dcd2; margin: 10px 0 0 0;">Takk for din bestilling!</p>
        </div>

        <div style="padding: 30px; background: #fafafa;">
          <h2 style="color: #4d4738; margin: 0 0 20px 0; font-family: 'Playfair Display', serif;">Ordrens Detaljer</h2>

          <p style="color: #666; margin: 0 0 20px 0;">
            Hei <strong>{$safeName}</strong>,
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">
              <strong>Ordrenummer:</strong> <span style="color: #755f4a;">{$orderNumber}</span>
            </p>
            <p style="margin: 0;">
              <strong>Dato:</strong> {$orderDate}
            </p>
          </div>

          <h3 style="color: #4d4738; font-size: 16px; margin: 25px 0 15px 0;">Ordredetaljer:</h3>

          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
{$tableHead}
            <tbody>
              {$itemsHtml}
            </tbody>
          </table>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c0ae94;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600; color: #4d4738;">
              <span>Totalt:</span>
              <span>{$totalStr} kr</span>
            </div>
          </div>

{$customerNotesBlock}

          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <p style="margin: 0 0 10px 0; color: #4d4738; font-weight: 600;">Kontaktinformasjon:</p>
            <p style="margin: 5px 0; color: #666;">Telefon: {$safePhone}</p>
            <p style="margin: 5px 0; color: #666;">E-post: {$safeEmail}</p>
          </div>

          <p style="color: #666; margin: 20px 0 0 0;">
            Vi setter pris på din bestilling og vil kontakte deg snart med oppdateringer.
          </p>

          <p style="color: #666; margin: 10px 0;">Med vennlig hilsen,<br/><strong>Villheva Team</strong></p>
        </div>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #999;">
          <p style="margin: 0;">© 2025 Villheva. Alle rettigheter reservert.</p>
        </div>
      </div>
HTML;

// EMAIL 2: Order notification for the admin
$adminEmailHtml = <<<HTML
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #4d4738 0%, #6d5d50 100%); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0; font-family: 'Playfair Display', serif; font-size: 24px;">🎉 Ny Bestilling</h1>
        </div>

        <div style="padding: 20px; background: #fafafa;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 0 0 20px 0;">
            <p style="margin: 0 0 15px 0;">
              <strong style="color: #4d4738;">Ordrenummer:</strong> <span style="color: #755f4a; font-size: 18px; font-weight: 600;">{$orderNumber}</span>
            </p>
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #4d4738;">Dato:</strong> {$orderDate} {$orderTime}
            </p>
          </div>

          <h3 style="color: #4d4738; margin: 20px 0 15px 0;">Kundedetaljer:</h3>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 0 0 20px 0; border-left: 4px solid #c0ae94;">
            <p style="margin: 0 0 10px 0;">
              <strong>Navn:</strong> {$safeName}
            </p>
            <p style="margin: 0 0 10px 0;">
              <strong>E-post:</strong> <a href="mailto:{$safeEmail}">{$safeEmail}</a>
            </p>
            <p style="margin: 0;">
              <strong>Telefon:</strong> {$safePhone}
            </p>
          </div>

          <h3 style="color: #4d4738; margin: 20px 0 15px 0;">Ordredetaljer:</h3>

          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
{$tableHead}
            <tbody>
              {$itemsHtml}
            </tbody>
          </table>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c0ae94;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600; color: #4d4738;">
              <span>Totalt:</span>
              <span>{$totalStr} kr</span>
            </div>
          </div>

{$adminNotesBlock}
        </div>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #999;">
          <p style="margin: 0;">Ordre mottatt automatisk fra Villheva bestillingssystem</p>
        </div>
      </div>
HTML;

$fromEmail  = villheva_config('RESEND_FROM_EMAIL', 'noreply@villheva.no');
$adminEmail = villheva_config('ADMIN_EMAIL', 'post@villheva.no');

try {
    villheva_send_email([
        'to'       => $customerEmail,
        'subject'  => 'Din bestilling er mottatt - ' . $orderNumber,
        'html'     => $customerEmailHtml,
        'from'     => $fromEmail,
        'reply_to' => $adminEmail,
    ]);

    villheva_send_email([
        'to'      => $adminEmail,
        'subject' => 'Ny bestilling: ' . $orderNumber,
        'html'    => $adminEmailHtml,
        'from'    => $fromEmail,
    ]);
} catch (Throwable $e) {
    villheva_handle_exception($e, 'order');
}

villheva_json(200, [
    'success'     => true,
    'message'     => 'Order created and emails sent successfully',
    'orderNumber' => $orderNumber,
]);
