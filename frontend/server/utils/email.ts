/**
 * Minimal Resend client.
 *
 * Calls the REST API directly rather than using the `resend` SDK: the SDK
 * imports `@react-email/render` for its React template support, which cannot
 * be bundled for the Cloudflare Workers runtime ("externals are not allowed").
 * A single fetch has no such problem and works on any runtime.
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

interface ResendError {
  message?: string;
  name?: string;
}

export async function sendEmail(options: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY environment variable is not set. Please configure it in your production environment.",
    );
  }

  const body: Record<string, unknown> = {
    from:
      options.from || process.env.RESEND_FROM_EMAIL || "noreply@villheva.no",
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
  };
  // The REST API uses snake_case here, unlike the Node SDK.
  if (options.replyTo) {
    body.reply_to = options.replyTo;
  }

  try {
    return await $fetch<{ id: string }>("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body,
    });
  } catch (error: any) {
    const detail: ResendError = error?.data ?? {};
    const message = detail.message || error?.message || "unknown error";
    console.error("Email sending failed:", message);
    throw new Error(`Failed to send email: ${message}`);
  }
}
