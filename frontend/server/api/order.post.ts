import { sendEmail } from "~/server/utils/email";

// Simple HTML escaping function
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

interface OrderItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
}

interface OrderData {
  items: OrderItem[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
}

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (event.node.req.method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  try {
    const body = await readBody<OrderData>(event);

    // Validate required fields
    const { items, total, customer } = body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !customer ||
      !customer.name ||
      !customer.email ||
      !customer.phone
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Missing required fields: items, total, customer details",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid email address",
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create items HTML table for emails
    const itemsHtml = items
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; text-align: left;">${escapeHtml(item.title)}</td>
        <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right;">${item.price} kr</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600;">${item.price * item.quantity} kr</td>
      </tr>
    `,
      )
      .join("");

    // EMAIL 1: Receipt for customer
    const customerEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #4d4738 0%, #6d5d50 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-family: 'Playfair Display', serif; font-size: 28px;">Villheva</h1>
          <p style="color: #e8dcd2; margin: 10px 0 0 0;">Takk for din bestilling!</p>
        </div>

        <div style="padding: 30px; background: #fafafa;">
          <h2 style="color: #4d4738; margin: 0 0 20px 0; font-family: 'Playfair Display', serif;">Ordrens Detaljer</h2>

          <p style="color: #666; margin: 0 0 20px 0;">
            Hei <strong>${escapeHtml(customer.name)}</strong>,
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">
              <strong>Ordrenummer:</strong> <span style="color: #755f4a;">${orderNumber}</span>
            </p>
            <p style="margin: 0;">
              <strong>Dato:</strong> ${new Date().toLocaleDateString("no-NO")}
            </p>
          </div>

          <h3 style="color: #4d4738; font-size: 16px; margin: 25px 0 15px 0;">Ordredetaljer:</h3>

          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #e8dcd2;">
                <th style="padding: 12px; text-align: left; color: #4d4738; font-weight: 600;">Produkt</th>
                <th style="padding: 12px; text-align: center; color: #4d4738; font-weight: 600;">Antall</th>
                <th style="padding: 12px; text-align: right; color: #4d4738; font-weight: 600;">Pris</th>
                <th style="padding: 12px; text-align: right; color: #4d4738; font-weight: 600;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c0ae94;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600; color: #4d4738;">
              <span>Totalt:</span>
              <span>${total} kr</span>
            </div>
          </div>

          ${
            customer.notes
              ? `
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #4d4738; font-weight: 600;">Spesielle instruksjoner:</p>
              <p style="margin: 0; color: #666; white-space: pre-wrap;">${escapeHtml(customer.notes)}</p>
            </div>
          `
              : ""
          }

          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <p style="margin: 0 0 10px 0; color: #4d4738; font-weight: 600;">Kontaktinformasjon:</p>
            <p style="margin: 5px 0; color: #666;">Telefon: ${escapeHtml(customer.phone)}</p>
            <p style="margin: 5px 0; color: #666;">E-post: ${escapeHtml(customer.email)}</p>
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
    `;

    // EMAIL 2: Order notification for admin
    const adminEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #4d4738 0%, #6d5d50 100%); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0; font-family: 'Playfair Display', serif; font-size: 24px;">🎉 Ny Bestilling</h1>
        </div>

        <div style="padding: 20px; background: #fafafa;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 0 0 20px 0;">
            <p style="margin: 0 0 15px 0;">
              <strong style="color: #4d4738;">Ordrenummer:</strong> <span style="color: #755f4a; font-size: 18px; font-weight: 600;">${orderNumber}</span>
            </p>
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #4d4738;">Dato:</strong> ${new Date().toLocaleDateString("no-NO")} ${new Date().toLocaleTimeString("no-NO")}
            </p>
          </div>

          <h3 style="color: #4d4738; margin: 20px 0 15px 0;">Kundedetaljer:</h3>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 0 0 20px 0; border-left: 4px solid #c0ae94;">
            <p style="margin: 0 0 10px 0;">
              <strong>Navn:</strong> ${escapeHtml(customer.name)}
            </p>
            <p style="margin: 0 0 10px 0;">
              <strong>E-post:</strong> <a href="mailto:${escapeHtml(customer.email)}">${escapeHtml(customer.email)}</a>
            </p>
            <p style="margin: 0;">
              <strong>Telefon:</strong> ${escapeHtml(customer.phone)}
            </p>
          </div>

          <h3 style="color: #4d4738; margin: 20px 0 15px 0;">Ordredetaljer:</h3>

          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #e8dcd2;">
                <th style="padding: 12px; text-align: left; color: #4d4738; font-weight: 600;">Produkt</th>
                <th style="padding: 12px; text-align: center; color: #4d4738; font-weight: 600;">Antall</th>
                <th style="padding: 12px; text-align: right; color: #4d4738; font-weight: 600;">Pris</th>
                <th style="padding: 12px; text-align: right; color: #4d4738; font-weight: 600;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c0ae94;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600; color: #4d4738;">
              <span>Totalt:</span>
              <span>${total} kr</span>
            </div>
          </div>

          ${
            customer.notes
              ? `
            <h3 style="color: #4d4738; margin: 20px 0 15px 0;">Spesielle instruksjoner:</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #c0ae94;">
              <p style="margin: 0; color: #666; white-space: pre-wrap;">${escapeHtml(customer.notes)}</p>
            </div>
          `
              : ""
          }
        </div>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #999;">
          <p style="margin: 0;">Ordre mottatt automatisk fra Villheva bestillingssystem</p>
        </div>
      </div>
    `;

    // Send receipt email to customer
    await sendEmail({
      to: customer.email,
      subject: `Din bestilling er mottatt - ${orderNumber}`,
      html: customerEmailHtml,
      from: "noreply@villheva.no",
      replyTo: "post@villheva.no",
    }, event);

    // Send order notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || "post@villheva.no";
    await sendEmail({
      to: adminEmail,
      subject: `Ny bestilling: ${orderNumber}`,
      html: adminEmailHtml,
      from: "noreply@villheva.no",
    }, event);

    return {
      success: true,
      message: "Order created and emails sent successfully",
      orderNumber,
    };
  } catch (error: any) {
    console.error("Order submission error:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || error.message || "Failed to process order",
    });
  }
});
