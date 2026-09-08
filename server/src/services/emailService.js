import nodemailer from 'nodemailer';

/**
 * emailService.js
 * Backend email delivery service using Nodemailer and Gmail SMTP (SSL/TLS).
 */

// Helper to escape user input to prevent HTML injection in emails
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Check whether Gmail SMTP is configured with non-empty credentials.
 */
export function isSmtpConfigured() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return Boolean(user && pass && pass.trim().length > 0 && !pass.includes('placeholder'));
}

/**
 * Singleton Nodemailer Transporter
 * Configured for Gmail SMTP (Default: smtp.gmail.com:465 with SSL/TLS)
 */
let cachedTransporter = null;
let lastPass = null;

export function getTransporter() {
  const currentPass = process.env.SMTP_PASS;
  if (!cachedTransporter || lastPass !== currentPass) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: currentPass,
      },
    });
    lastPass = currentPass;
  }
  return cachedTransporter;
}

export const transporter = {
  sendMail: (...args) => getTransporter().sendMail(...args),
  verify: (...args) => getTransporter().verify(...args),
};

/**
 * Safe startup verification for SMTP connection.
 * Logs verification status without leaking passwords or crashing the process.
 */
export async function verifySmtpConfiguration() {
  if (!isSmtpConfigured()) {
    console.warn('⚠️  [SMTP NOTICE] Gmail SMTP_PASS is empty in server/.env. Contact emails will not be sent until a 16-character Google App Password is configured.');
    return false;
  }

  try {
    await getTransporter().verify();
    console.log('⚡ [SMTP] Gmail SMTP connection verified successfully.');
    return true;
  } catch (error) {
    console.error('[CONTACT ERROR] SMTP connection verification failed:', error.message);
    return false;
  }
}

/**
 * Send contact inquiry email to Akilesh via Gmail SMTP.
 *
 * Headers:
 * - From: "Portfolio Contact" <akileshanand302006@gmail.com> (authenticated account)
 * - To: CONTACT_TO (akileshanand302006@gmail.com)
 * - Reply-To: visitor's entered email (allows direct reply to the visitor)
 * - Subject: New Portfolio Contact — <visitor subject>
 */
export async function sendContactEmail({ name, email, subject, message, timestamp, ipAddress }) {
  if (!isSmtpConfigured()) {
    console.error('[CONTACT ERROR] Cannot send email: SMTP credentials not configured in server/.env.');
    throw new Error('Email service is temporarily unavailable.');
  }

  const destinationEmail = process.env.CONTACT_TO || process.env.SMTP_USER || 'akileshanand302006@gmail.com';
  const authenticatedSender = process.env.SMTP_USER || 'akileshanand302006@gmail.com';
  const emailSubject = `New Portfolio Contact — ${subject || 'General Inquiry'}`;
  const displayTime = timestamp || new Date().toLocaleString();

  const textContent = `
New Portfolio Contact

Name: ${name}
Email: ${email}
Subject: ${subject || 'General Inquiry'}

Message:
${message}

--------------------------------------------------
Received from: Akilesh A — Software Systems Portfolio
Time: ${displayTime}
IP: ${ipAddress || 'Not recorded'}
`.trim();

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || 'General Inquiry');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #080a10; color: #f8fafc; padding: 24px; margin: 0; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 28px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
    h2 { color: #ffffff; font-size: 20px; margin: 0 0 16px 0; }
    .field { margin-bottom: 14px; }
    .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .val { color: #f1f5f9; font-size: 15px; margin-top: 3px; }
    .msg-box { background: #1e293b; border-left: 3px solid #38bdf8; padding: 16px; border-radius: 6px; margin: 18px 0; color: #ffffff; font-size: 15px; line-height: 1.6; }
    .footer { font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">New Portfolio Contact</div>
    <h2>New Message Received</h2>
    <div class="field">
      <div class="label">Name</div>
      <div class="val"><strong>${safeName}</strong></div>
    </div>
    <div class="field">
      <div class="label">Email (Reply-To)</div>
      <div class="val"><a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none;">${safeEmail}</a></div>
    </div>
    <div class="field">
      <div class="label">Subject</div>
      <div class="val">${safeSubject}</div>
    </div>
    <div class="field">
      <div class="label">Message</div>
      <div class="msg-box">${safeMessage}</div>
    </div>
    <div class="footer">
      Received from: Akilesh A — Software Systems Portfolio &bull; ${displayTime}
    </div>
  </div>
</body>
</html>
`.trim();

  console.log(`[CONTACT] Sending email to ${destinationEmail} with Reply-To ${email}...`);

  const mailOptions = {
    from: `"Akilesh A Portfolio" <${authenticatedSender}>`,
    to: destinationEmail,
    replyTo: email,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('[CONTACT] Email sent successfully via Gmail SMTP. MessageId:', info.messageId);
  return info;
}
