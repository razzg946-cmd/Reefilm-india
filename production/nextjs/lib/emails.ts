import { Resend } from "resend";

let resendInstance: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not defined");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

// Simple retry helper
async function runWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((res) => setTimeout(res, delay));
    return runWithRetry(fn, retries - 1, delay * 2);
  }
}

/**
 * 1. Admin Alert: New Contact Inquiry
 */
export async function sendAdminContactEmail(data: {
  fullName: string;
  company?: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  message?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "razzg946@gmail.com";
  const resend = getResendClient();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Inquiry - Reefilm India</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
        .header { background: #E30613; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; color: #fff; }
        .content { padding: 30px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table td { padding: 12px 8px; border-bottom: 1px solid #1a1a1a; font-size: 14px; }
        .table td.label { font-weight: bold; color: #888; width: 150px; text-transform: uppercase; font-size: 11px; }
        .message-box { background: #111; border: 1px solid #222; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 13px; line-height: 1.6; }
        .footer { text-align: center; padding: 20px; font-size: 11px; color: #444; border-top: 1px solid #111; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>New Contact Inquiry</h1>
        </div>
        <div class="content">
          <p style="font-size: 14px; color: #aaa; margin-top: 0;">A new business inquiry has been recorded on the Reefilm India website:</p>
          <table class="table">
            <tr><td class="label">Full Name</td><td>${data.fullName}</td></tr>
            <tr><td class="label">Company</td><td>${data.company || "Not Provided"}</td></tr>
            <tr><td class="label">Phone</td><td>${data.phone}</td></tr>
            <tr><td class="label">WhatsApp</td><td>${data.whatsapp}</td></tr>
            <tr><td class="label">Email</td><td>${data.email}</td></tr>
            <tr><td class="label">City</td><td>${data.city}</td></tr>
          </table>
          ${data.message ? `<div class="message-box"><strong>Inquiry message:</strong><br>${data.message}</div>` : ""}
        </div>
        <div class="footer">
          Reefilm India • Chennai Desk National Service Partner
        </div>
      </div>
    </body>
    </html>
  `;

  return runWithRetry(() =>
    resend.emails.send({
      from: "Reefilm India Alerts <alerts@reefilm.in>",
      to: adminEmail,
      subject: `New Contact Inquiry - ${data.fullName}`,
      html,
    })
  );
}

/**
 * 2. Customer Thank You: Contact Confirmation
 */
export async function sendCustomerThankYouEmail(email: string, fullName: string) {
  const resend = getResendClient();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank you for contacting Reefilm India</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
        .header { background: #111; border-b: 1px solid #222; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; color: #fff; letter-spacing: 1px; }
        .content { padding: 35px; line-height: 1.6; font-size: 14px; color: #ccc; }
        .important-note { background: #E30613/10; border-left: 3px solid #E30613; padding: 15px; border-radius: 4px; font-size: 13px; color: #fff; margin: 20px 0; }
        .footer { text-align: center; padding: 25px; font-size: 11px; color: #444; border-top: 1px solid #111; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="color:#E30613;">Reefilm India</h1>
        </div>
        <div class="content">
          <p>Dear ${fullName},</p>
          <p>Thank you for contacting Reefilm India. Our sales team will contact you shortly.</p>
          
          <div class="important-note">
            <strong>Exclusive Technical Partnership:</strong> All architectural LED film structures are manufactured directly at Reefilm Head Office (China) and fully calibrated, installed, and warrantied locally by Reefilm India (Chennai Desk) under the supervision of Raj Gupta.
          </div>

          <p>We will review your glass installation specs and get back to you with custom CAD layouts and transparency diagnostics within 4 hours.</p>
          <p>Best Regards,<br><strong>Raj Gupta</strong><br>National Projects Coordinator<br>Reefilm India</p>
        </div>
        <div class="footer">
          Reefilm Chennai Sales Office, Tamil Nadu, India • +91 85779 17327
        </div>
      </div>
    </body>
    </html>
  `;

  return runWithRetry(() =>
    resend.emails.send({
      from: "Raj Gupta | Reefilm India <raj@reefilm.in>",
      to: email,
      subject: "Thank you for contacting Reefilm India",
      html,
    })
  );
}

/**
 * 3. Admin Alert: New Quote Request
 */
export async function sendAdminQuoteEmail(data: {
  quoteId: string;
  fullName: string;
  company?: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  country?: string;
  productOfInterest: string;
  quantity: string;
  glassSize: string;
  screenSize?: string;
  budgetRange: string;
  timeline: string;
  specialRequirements?: string;
  drawingUrl?: string;
  imageUrl?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "razzg946@gmail.com";
  const resend = getResendClient();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Quote Request - Reefilm India</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 20px; }
        .card { max-width: 650px; margin: 0 auto; background: #0a0a0a; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
        .header { background: #111; border-bottom: 2px solid #E30613; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; color: #fff; }
        .quote-id { background: #E30613; display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; font-family: monospace; margin-top: 10px; }
        .content { padding: 30px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table td { padding: 10px 8px; border-bottom: 1px solid #1a1a1a; font-size: 13px; }
        .table td.label { font-weight: bold; color: #888; width: 180px; text-transform: uppercase; font-size: 10px; }
        .links-box { margin-top: 25px; padding: 15px; background: #111; border: 1px solid #222; border-radius: 8px; font-size: 13px; }
        .links-box a { color: #E30613; text-decoration: none; font-weight: bold; }
        .footer { text-align: center; padding: 20px; font-size: 11px; color: #444; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>New Architectural Quote Request</h1>
          <div class="quote-id">ID: ${data.quoteId}</div>
        </div>
        <div class="content">
          <table class="table">
            <tr><td class="label">Customer Name</td><td>${data.fullName}</td></tr>
            <tr><td class="label">Company</td><td>${data.company || "Not Provided"}</td></tr>
            <tr><td class="label">Contact Info</td><td>Phone: ${data.phone} | WhatsApp: ${data.whatsapp}</td></tr>
            <tr><td class="label">Email Address</td><td>${data.email}</td></tr>
            <tr><td class="label">Location</td><td>${data.city}, ${data.state}, ${data.country}</td></tr>
            <tr><td class="label">Product Required</td><td>${data.productOfInterest}</td></tr>
            <tr><td class="label">Glass Sizing</td><td>${data.glassSize}</td></tr>
            <tr><td class="label">Screen Target Sizing</td><td>${data.screenSize || "Same as Glass"}</td></tr>
            <tr><td class="label">Quantity Screens</td><td>${data.quantity}</td></tr>
            <tr><td class="label">Stated Budget</td><td>${data.budgetRange}</td></tr>
            <tr><td class="label">Construction Timeline</td><td>${data.timeline}</td></tr>
          </table>

          ${data.specialRequirements ? `<div style="margin-top:20px; font-size:13px;"><strong>Technical Notes:</strong><br>${data.specialRequirements}</div>` : ""}

          ${
            data.drawingUrl || data.imageUrl
              ? `
            <div class="links-box">
              <strong>Uploaded Attachments:</strong><br>
              ${data.drawingUrl ? `<p>📂 CAD Drawing: <a href="${data.drawingUrl}" target="_blank">Download File</a></p>` : ""}
              ${data.imageUrl ? `<p>🖼️ Facade Photo: <a href="${data.imageUrl}" target="_blank">View Photo</a></p>` : ""}
            </div>
          `
              : ""
          }
        </div>
        <div class="footer">Reefilm India Intelligent Estimator Hub</div>
      </div>
    </body>
    </html>
  `;

  return runWithRetry(() =>
    resend.emails.send({
      from: "Reefilm India Estimator <estimator@reefilm.in>",
      to: adminEmail,
      subject: `New Quote Request [${data.quoteId}] - ${data.fullName}`,
      html,
    })
  );
}

/**
 * 4. Customer Thank You: Quote Confirmation
 */
export async function sendCustomerQuoteThankYouEmail(data: {
  email: string;
  fullName: string;
  quoteId: string;
  productOfInterest: string;
}) {
  const resend = getResendClient();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Quote Request Received - Reefilm India</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
        .header { background: #E30613; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; color: #fff; }
        .content { padding: 35px; line-height: 1.6; font-size: 14px; color: #ccc; }
        .important-note { background: #111; border-left: 3px solid #E30613; padding: 15px; border-radius: 4px; font-size: 13px; color: #fff; margin: 20px 0; }
        .footer { text-align: center; padding: 25px; font-size: 11px; color: #444; border-top: 1px solid #111; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Quote Request Logged</h1>
          <div style="font-family: monospace; font-size: 12px; color: #fff; margin-top: 5px; opacity: 0.9;">Quote Reference: ${data.quoteId}</div>
        </div>
        <div class="content">
          <p>Dear ${data.fullName},</p>
          <p>Thank you for contacting Reefilm India. Our sales team will contact you shortly.</p>
          
          <div class="important-note">
            Your quote proposal request has been registered under ID <strong>${data.quoteId}</strong>. We are evaluating architectural specs for <strong>${data.productOfInterest}</strong>.
          </div>

          <p>Our engineering leads in Chennai will immediately execute a heat dissipation and transparency map using your dimensions. Expect our comprehensive project design draft within 1 business day.</p>
          <p>Best Regards,<br><strong>Raj Gupta</strong><br>National Technical Partner<br>Reefilm India</p>
        </div>
        <div class="footer">
          Reefilm India (Chennai) • +91 85779 17327
        </div>
      </div>
    </body>
    </html>
  `;

  return runWithRetry(() =>
    resend.emails.send({
      from: "Raj Gupta | Reefilm India <raj@reefilm.in>",
      to: data.email,
      subject: `Quote Request Received [${data.quoteId}] - Reefilm India`,
      html,
    })
  );
}
