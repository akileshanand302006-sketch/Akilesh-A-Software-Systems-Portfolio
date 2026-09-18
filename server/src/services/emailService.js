import nodemailer from 'nodemailer';

/**
 * emailService.js
 * Production-ready backend email delivery service using Nodemailer and Gmail SMTP.
 * Enforces IPv4 resolution to prevent ENETUNREACH in cloud container environments (Render/Docker/Linux),
 * and provides automatic failover between SSL (port 465) and STARTTLS (port 587).
 */

const DEFAULT_SMTP_USER = 'akileshanand302006@gmail.com';
const DEFAULT_SMTP_PASS = 'wqezjahwucvxayrm';
const DEFAULT_SMTP_HOST = 'smtp.gmail.com';
const DEFAULT_SMTP_PORT = 465;

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
  const user = (process.env.SMTP_USER && process.env.SMTP_USER.trim()) || DEFAULT_SMTP_USER;
  const pass = (process.env.SMTP_PASS && process.env.SMTP_PASS.trim()) || DEFAULT_SMTP_PASS;
  return Boolean(user && pass && pass.length > 0 && !pass.includes('placeholder'));
}

/**
 * Factory to create Nodemailer Transporter with explicit IPv4 and timeout controls.
 */
export function createTransporter(port = null, secure = null) {
  const currentPass = (process.env.SMTP_PASS && process.env.SMTP_PASS.trim() && !process.env.SMTP_PASS.includes('placeholder')) 
    ? process.env.SMTP_PASS.trim() 
    : DEFAULT_SMTP_PASS;
  const currentUser = (process.env.SMTP_USER && process.env.SMTP_USER.trim()) 
    ? process.env.SMTP_USER.trim() 
    : DEFAULT_SMTP_USER;
  const host = process.env.SMTP_HOST || DEFAULT_SMTP_HOST;
  
  const targetPort = port !== null ? port : (Number(process.env.SMTP_PORT) || DEFAULT_SMTP_PORT);
  const isSecure = secure !== null ? secure : (process.env.SMTP_SECURE === 'true' || targetPort === 465);

  return nodemailer.createTransport({
    host,
    port: targetPort,
    secure: isSecure,
    family: 4, // CRITICAL: Force IPv4 for Render/Docker/Linux to prevent ENETUNREACH
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    auth: {
      user: currentUser,
      pass: currentPass,
    },
  });
}

let cachedTransporter = null;
let lastPass = null;

export function getTransporter() {
  const currentPass = (process.env.SMTP_PASS && process.env.SMTP_PASS.trim() && !process.env.SMTP_PASS.includes('placeholder')) 
    ? process.env.SMTP_PASS.trim() 
    : DEFAULT_SMTP_PASS;

  if (!cachedTransporter || lastPass !== currentPass) {
    cachedTransporter = createTransporter(465, true);
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
 * Checks primary port 465 and fallback port 587.
 */
export async function verifySmtpConfiguration() {
  if (!isSmtpConfigured()) {
    console.warn('??  [SMTP NOTICE] Gmail SMTP credentials not configured. Contact emails will not be sent.');
    return false;
  }

  try {
    const primary = getTransporter();
    await primary.verify();
    console.log('? [SMTP] Gmail SMTP verified successfully on port 465 (IPv4).');
    return true;
  } catch (error) {
    console.warn('[SMTP NOTICE] Port 465 verification notice (' + error.message + '), checking fallback port 587...');
    try {
      const fallback = createTransporter(587, false);
      await fallback.verify();
      console.log('? [SMTP] Gmail SMTP verified successfully on fallback port 587 (IPv4).');
      return true;
    } catch (fallbackError) {
      console.error('[CONTACT ERROR] SMTP connection verification failed on both ports:', fallbackError.message);
      return false;
    }
  }
}

/**
 * Send contact inquiry email to Akilesh via Gmail SMTP.
 * Dispatches via primary port 465 (SSL) with automatic fallback to port 587 (STARTTLS).
 */
export async function sendContactEmail({ name, email, subject, message, timestamp, ipAddress }) {
  if (!isSmtpConfigured()) {
    console.error('[CONTACT ERROR] Cannot send email: SMTP credentials not configured.');
    throw new Error('Email service is temporarily unavailable.');
  }

  const destinationEmail = process.env.CONTACT_TO || process.env.SMTP_USER || DEFAULT_SMTP_USER;
  const authenticatedSender = process.env.SMTP_USER || DEFAULT_SMTP_USER;
  const emailSubject = `New Portfolio Contact ? ${subject || 'General Inquiry'}`;
  const displayTime = timestamp || new Date().toLocaleString();

  const textContent = `
New Portfolio Contact

Name: ${name}
Email: ${email}
Subject: ${subject || 'General Inquiry'}

Message:
${message}

--------------------------------------------------
Received from: Akilesh A ? Software Systems Portfolio
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
      Received from: Akilesh A ? Software Systems Portfolio &bull; ${displayTime}
    </div>
  </div>
</body>
</html>
`.trim();

  console.log(`[CONTACT] Sending email to ${destinationEmail} with Reply-To ${email} via IPv4...`);

  const mailOptions = {
    from: `"Akilesh A Portfolio" <${authenticatedSender}>`,
    to: destinationEmail,
    replyTo: email,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
  };

  // Primary attempt: Port 465 (SSL, IPv4)
  try {
    const primaryTransporter = getTransporter();
    const info = await primaryTransporter.sendMail(mailOptions);
    console.log('[CONTACT] Email sent successfully via Gmail SMTP (Port 465). MessageId:', info.messageId);
    return info;
  } catch (primaryError) {
    console.warn('[CONTACT WARNING] Primary SMTP send (465) failed (' + primaryError.message + '), trying fallback on port 587 (IPv4)...');
    try {
      const fallbackTransporter = createTransporter(587, false);
      const info = await fallbackTransporter.sendMail(mailOptions);
      console.log('[CONTACT] Email sent successfully via Gmail SMTP fallback (Port 587). MessageId:', info.messageId);
      return info;
    } catch (fallbackError) {
      console.error('[CONTACT ERROR] Both SMTP attempts failed. Fallback error:', fallbackError.message);
      throw fallbackError;
    }
  }
}
