import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure server/.env is loaded even if imported standalone
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

/**
 * emailService.js
 * Production-ready transactional email service using Resend REST API (HTTPS/443).
 * Secrets are loaded STRICTLY from environment variables (process.env.RESEND_API_KEY).
 * No credentials or third-party providers (Nodemailer, SendGrid, EmailJS, etc.) are used.
 */

// Module-level Resend client instance
let resend = null;
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim()) {
  try {
    resend = new Resend(process.env.RESEND_API_KEY.trim());
  } catch {}
}

export function getResendClient() {
  if (resend) return resend;
  const key = process.env.RESEND_API_KEY;
  if (key && key.trim()) {
    resend = new Resend(key.trim());
    return resend;
  }
  return null;
}

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
 * Check whether Resend API key is configured in environment variables.
 * Never exposes the key value.
 */
export function isResendConfigured() {
  const key = process.env.RESEND_API_KEY;
  return Boolean(key && typeof key === 'string' && key.trim().length > 0);
}

/**
 * Backwards-compatible check.
 */
export const isSmtpConfigured = isResendConfigured;

/**
 * Startup diagnostic verification for Resend configuration.
 * Safe logging: NEVER prints the key.
 */
export function verifyEmailConfiguration() {
  const configured = isResendConfigured();
  if (configured) {
    if (!resend) {
      resend = new Resend(process.env.RESEND_API_KEY.trim());
    }
    console.log('[EMAIL] Resend provider configured: true');
  } else {
    console.warn('[EMAIL NOTICE] Resend API key (RESEND_API_KEY) not configured in environment.');
  }
  return configured;
}

export const verifySmtpConfiguration = verifyEmailConfiguration;

/**
 * Send contact inquiry email to Akilesh via Resend REST API over HTTPS/443.
 * 
 * - From: Resend verified domain or onboarding sender (onboarding@resend.dev)
 * - To: akileshanand302006@gmail.com
 * - Reply-To: visitor's entered email
 * - Transport: Resend REST API (port 443 HTTPS)
 */
export async function sendContactEmail({ name, email, subject, message, timestamp, ipAddress }) {
  if (!isResendConfigured()) {
    console.error('[CONTACT ERROR] Cannot send email: RESEND_API_KEY not set in environment.');
    throw new Error('Email service is not configured on this server.');
  }

  const client = getResendClient();
  if (!client) {
    console.error('[CONTACT ERROR] Failed to initialize Resend client with provided API key.');
    throw new Error('Email service could not be initialized.');
  }

  const destinationEmail = process.env.CONTACT_TO || 'akileshanand302006@gmail.com';
  const fromAddress = process.env.RESEND_FROM || 'Akilesh Portfolio <onboarding@resend.dev>';
  const emailSubject = 'New Portfolio Contact — ' + (subject || 'General Inquiry');
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
    'Received from: Akilesh A — Software Systems Portfolio',
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
    '      Received from: Akilesh A — Software Systems Portfolio &bull; ' + displayTime,
    '    </div>',
    '  </div>',
    '</body>',
    '</html>'
  ].join('\n');

  console.log('[CONTACT] Sending via Resend API to ' + destinationEmail + ' with Reply-To ' + email + '...');

  const { data, error } = await client.emails.send({
    from: fromAddress,
    to: [destinationEmail],
    replyTo: email,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
  });

  if (error) {
    console.error('[CONTACT ERROR] Resend rejected message:', error.message || error);
    throw new Error(error.message || 'Resend email delivery failed');
  }

  console.log('[CONTACT] Resend accepted message. ID:', data?.id);
  return {
    id: data?.id,
    messageId: data?.id,
  };
}
