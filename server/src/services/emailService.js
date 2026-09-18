import nodemailer from 'nodemailer';

/**
 * emailService.js
 * Production-ready transactional email service using Nodemailer + Gmail SMTP.
 * Secrets are loaded STRICTLY from environment variables (process.env).
 * No credentials or third-party providers (Resend, SendGrid, etc.) are used.
 */

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
 * Check whether Gmail SMTP is configured in environment variables.
 */
export function isSmtpConfigured() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return Boolean(user && user.trim() && pass && pass.trim());
}

/**
 * Create Nodemailer Transporter using Gmail SMTP credentials from environment.
 */
export function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export const transporter = {
  sendMail: (...args) => getTransporter().sendMail(...args),
  verify: (...args) => getTransporter().verify(...args),
};

/**
 * Startup verification for Gmail SMTP connection.
 */
export async function verifySmtpConfiguration() {
  if (!isSmtpConfigured()) {
    console.warn('[SMTP NOTICE] Gmail SMTP credentials (SMTP_USER / SMTP_PASS) not configured in environment.');
    return false;
  }

  try {
    await getTransporter().verify();
    console.log('[SMTP] Gmail SMTP connection verified successfully.');
    return true;
  } catch (error) {
    console.error('[SMTP ERROR] Connection verification failed:', error.message);
    return false;
  }
}

/**
 * Send contact inquiry email to Akilesh via Gmail SMTP.
 * Authenticated account: akileshanand302006@gmail.com (SMTP_USER)
 * Destination: akileshanand302006@gmail.com (CONTACT_TO / SMTP_USER)
 * Reply-To: visitor's entered email
 */
export async function sendContactEmail({ name, email, subject, message, timestamp, ipAddress }) {
  if (!isSmtpConfigured()) {
    console.error('[CONTACT ERROR] Cannot send email: SMTP_USER or SMTP_PASS not set in environment.');
    throw new Error('Email service is not configured on this server.');
  }

  const authenticatedUser = process.env.SMTP_USER;
  const destinationEmail = process.env.CONTACT_TO || authenticatedUser;
  const emailSubject = 'New Portfolio Contact: ' + (subject || 'General Inquiry');
  const displayTime = timestamp || new Date().toLocaleString();

  const textContent = [
    'New Portfolio Contact',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Subject: ' + (subject || 'General Inquiry'),
    '',
    'Message:',
    message,
    '',
    '--------------------------------------------------',
    'Received from: Akilesh A - Software Systems Portfolio',
    'Time: ' + displayTime,
    'IP: ' + (ipAddress || 'Not recorded')
  ].join('\n');

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || 'General Inquiry');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  const htmlContent = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <style>',
    '    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #080a10; color: #f8fafc; padding: 24px; margin: 0; }',
    '    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 28px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }',
    '    .badge { display: inline-block; background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }',
    '    h2 { color: #ffffff; font-size: 20px; margin: 0 0 16px 0; }',
    '    .field { margin-bottom: 14px; }',
    '    .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }',
    '    .val { color: #f1f5f9; font-size: 15px; margin-top: 3px; }',
    '    .msg-box { background: #1e293b; border-left: 3px solid #38bdf8; padding: 16px; border-radius: 6px; margin: 18px 0; color: #ffffff; font-size: 15px; line-height: 1.6; }',
    '    .footer { font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; text-align: center; }',
  '  </style>',
    '</head>',
    '<body>',
    '  <div class="card">',
    '    <div class="badge">New Portfolio Contact</div>',
    '    <h2>New Message Received</h2>',
    '    <div class="field">',
    '      <div class="label">Name</div>',
    '      <div class="val"><strong>' + safeName + '</strong></div>',
    '    </div>',
    '    <div class="field">',
    '      <div class="label">Email (Reply-To)</div>',
    '      <div class="val"><a href="mailto:' + safeEmail + '" style="color: #38bdf8; text-decoration: none;">' + safeEmail + '</a></div>',
    '    </div>',
    '    <div class="field">',
    '      <div class="label">Subject</div>',
    '      <div class="val">' + safeSubject + '</div>',
    '    </div>',
    '    <div class="field">',
    '      <div class="label">Message</div>',
    '      <div class="msg-box">' + safeMessage + '</div>',
    '    </div>',
    '    <div class="footer">',
    '      Received from: Akilesh A - Software Systems Portfolio &bull; ' + displayTime,
    '    </div>',
    '  </div>',
    '</body>',
    '</html>'
  ].join('\n');

  console.log('[CONTACT] Dispatching email to ' + destinationEmail + ' with Reply-To ' + email + ' via Gmail SMTP...');

  const mailOptions = {
    from: '"Akilesh A Portfolio" <' + authenticatedUser + '>',
    to: destinationEmail,
    replyTo: email,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
  };

  const info = await getTransporter().sendMail(mailOptions);
  console.log('[CONTACT] Email delivered successfully via Gmail SMTP. MessageId:', info.messageId);
  return info;
}
