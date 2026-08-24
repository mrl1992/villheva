import { sendEmail } from "~/server/utils/email";
import { readSecret, describeSecretSources } from "~/server/utils/secrets";

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (event.node.req.method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  try {
    const body = await readBody(event);

    // Validate required fields
    const { name, email, message, subject } = body;

    if (!name || !email || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields: name, email, message",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid email address",
      });
    }

    // Create email HTML
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4d4738;">Ny melding fra kontaktskjema</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Navn:</strong> ${escapeHtml(name)}</p>
          <p><strong>E-post:</strong> ${escapeHtml(email)}</p>
          <p><strong>Emne:</strong> ${escapeHtml(subject || "Generell henvendelse")}</p>
        </div>

        <div style="background-color: #fafafa; padding: 20px; border-radius: 8px; border-left: 4px solid #C0AE94;">
          <p><strong>Melding:</strong></p>
          <p style="white-space: pre-wrap; color: #555;">${escapeHtml(message)}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

        <p style="font-size: 12px; color: #999;">
          Svar til: <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
        </p>
      </div>
    `;

    // Send email to admin
    // Where the notification goes -- the bakery's inbox, not the visitor's.
    // ADMIN_EMAIL overrides it; the fallback means a missing variable can never
    // stop the form from working. The visitor's own address is only used for
    // the confirmation email and the Reply-To below.
    const adminEmail =
      readSecret("ADMIN_EMAIL", "adminEmail", event) ||
      readSecret("RESEND_FROM_EMAIL", "resendFromEmail", event) ||
      "post@villheva.no";

    if (!readSecret("ADMIN_EMAIL", "adminEmail", event)) {
      console.warn(
        "[Contact] ADMIN_EMAIL is not set; falling back to",
        adminEmail,
        "|",
        describeSecretSources(
          ["ADMIN_EMAIL", "RESEND_FROM_EMAIL", "RESEND_API_KEY"],
          event,
        ),
      );
    }

    await sendEmail({
      to: adminEmail,
      subject: `Ny henvendelse: ${subject || "Generell"}`,
      html: emailHtml,
      replyTo: email,
    }, event);

    // Optionally send confirmation email to user
    const confirmationHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4d4738;">Takk for at du kontaktet oss</h2>
        
        <p>Hei ${escapeHtml(name)},</p>
        
        <p>Vi har mottatt meldingen din og vil svare så snart som mulig.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Din melding:</strong></p>
          <p style="white-space: pre-wrap; color: #555;">${escapeHtml(message)}</p>
        </div>

        <p>Med vennlig hilsen,<br/>Villheva Team</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Vi mottok meldingen din",
      html: confirmationHtml,
    }, event);

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error: any) {
    console.error("Contact email error:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to send email",
    });
  }
});

// Helper function to escape HTML
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
