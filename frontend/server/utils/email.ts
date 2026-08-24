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

/**
 * Reads a secret in a way that works on both Node and Cloudflare Workers.
 *
 * `process.env.FOO` is read here at *runtime*, which workerd populates from the
 * Worker's bindings -- unlike a read inside nuxt.config.ts, which happens at
 * build time and bakes in an empty string. runtimeConfig is checked too, so a
 * `NUXT_`-prefixed variable works as well.
 */
function readSecret(envName: string, configKey: string): string | undefined {
  const fromEnv = process.env[envName];
  if (fromEnv) return fromEnv;
  const fromConfig = (useRuntimeConfig() as Record<string, any>)[configKey];
  return fromConfig || undefined;
}

export async function sendEmail(options: EmailOptions) {
  const apiKey = readSecret("RESEND_API_KEY", "resendApiKey");

  if (!apiKey) {
    console.error(
      "[Email] RESEND_API_KEY is not set. On Cloudflare add it under Settings -> Variables and Secrets.",
    );
    // Distinct from a send failure so the cause is visible without log access.
    throw createError({
      statusCode: 500,
      statusMessage: "Email is not configured on this deployment",
    });
  }

  const body: Record<string, unknown> = {
    from:
      options.from ||
      readSecret("RESEND_FROM_EMAIL", "resendFromEmail") ||
      "noreply@villheva.no",
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
    // Resend puts the useful part in the response body, not the status text.
    const detail =
      error?.data?.message || error?.data?.name || error?.message || "unknown";
    console.error(`[Email] Resend rejected the request: ${detail}`);
    throw createError({
      statusCode: 502,
      statusMessage: `Email provider rejected the request: ${detail}`,
    });
  }
}
