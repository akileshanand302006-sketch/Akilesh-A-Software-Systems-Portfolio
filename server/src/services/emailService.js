import nodemailer from 'nodemailer';
import { Resend } from 'resend';

/**
 * emailService.js
 * Unified transactional email service supporting Resend API and Nodemailer SMTP.
 */

function getEmailProvider() {
  // Check for Resend API Key
  const resendKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  if (resendKey && resendKey !== 'your_private_email_api_key' && !resendKey.includes('placeholder')) {
    return { type: 'resend', client: new Resend(resendKey) };
  }

  // Check for SMTP Credentials
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SECURE } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    return { type: 'smtp', client: transporter };
  }

  return null;
}

export async function sendOwnerNotification({ name, email, subject, message, timestamp, ipAddress }) {
  const provider = getEmailProvider();
  const ownerEmail = process.env.PORTFOLIO_EMAIL || process.env.NOTIFICATION_EMAIL || 'akileshanand302006@gmail.com';
  const fromAddress = process.env.EMAIL_FROM || 'Akilesh Portfolio <onboarding@resend.dev>';

  if (!provider) {
    console.error('[CONTACT ERROR] No email service configured. Please set RESEND_API_KEY or SMTP credentials in server/.env');
    throw new Error('Email service is not yet configured on the server. Please set RESEND_API_KEY or SMTP credentials in server/.env');
  }

  const emailSubject = `New Portfolio Message from ${name}${subject ? `: ${subject}` : ''}`;

  const textContent = `
New Portfolio Contact Message

From: ${name}
Email: ${email}
Subject: ${subject || 'General Inquiry'}
Time: ${timestamp || new Date().toISOString()}
IP: ${ipAddress || 'Not recorded'}

Message:
${message}

--------------------------------
Sent from:
Akilesh A — Software Systems Portfolio
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #080a10; color: #f8fafc; padding: 24px; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 28px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
    h2 { color: #ffffff; font-size: 20px; margin-top: 0; }
    .field { margin-bottom: 14px; }
    .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .val { color: #f1f5f9; font-size: 15px; margin-top: 3px; }
    .msg-box { background: #1e293b; border-left: 3px solid #38bdf8; padding: 16px; border-radius: 6px; margin: 20px 0; color: #ffffff; font-size: 15px; line-height: 1.6; white-space: pre-wrap; }
    .footer { font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">New Contact Message</div>
    <h2>Portfolio Contact Received</h2>
    <div class="field">
      <div class="label">Sender Name</div>
      <div class="val"><strong>${name}</strong></div>
    </div>
    <div class="field">
      <div class="label">Sender Email</div>
      <div class="val"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></div>
    </div>
    ${subject ? `<div class="field"><div class="label">Subject</div><div class="val">${subject}</div></div>` : ''}
    <div class="field">
      <div class="label">Message</div>
      <div class="msg-box">${message}</div>
    </div>
    <div class="footer">
      Sent from Akilesh A — Software Systems Portfolio &bull; ${new Date().toLocaleString()}
    </div>
  </div>
</body>
</html>
`.trim();

  console.log(`[CONTACT] Sending owner email to ${ownerEmail} via ${provider.type}...`);

  if (provider.type === 'resend') {
    const { data, error } = await provider.client.emails.send({
      from: fromAddress,
      to: [ownerEmail],
      reply_to: email,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });
    if (error) {
      console.error('[CONTACT ERROR] Resend error delivering to owner:', error);
      throw new Error(error.message || 'Resend failed to deliver owner email.');
    }
    console.log('[CONTACT] Owner email sent successfully via Resend. ID:', data?.id);
    return data;
  } else if (provider.type === 'smtp') {
    const info = await provider.client.sendMail({
      from: fromAddress,
      to: ownerEmail,
      replyTo: email,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });
    console.log('[CONTACT] Owner email sent successfully via SMTP. MessageId:', info?.messageId);
    return info;
  }
}

export async function sendVisitorAcknowledgement({ name, email, subject, message }) {
  const provider = getEmailProvider();
  if (!provider) return null;

  const fromAddress = process.env.EMAIL_FROM || 'Akilesh Portfolio <onboarding@resend.dev>';
  const ackSubject = 'Thanks for contacting Akilesh A';

  const textContent = `
Hi ${name},

Thank you for reaching out through my portfolio.

I have received your message and will get back to you as soon as possible.

Your message:
"${message}"

Best regards,
Akilesh A
Software Systems
Coimbatore Institute of Technology
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #080a10; color: #f8fafc; padding: 24px; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 28px; max-width: 560px; margin: 0 auto; }
    h2 { color: #ffffff; font-size: 20px; margin-top: 0; }
    p { color: #cbd5e1; font-size: 15px; line-height: 1.6; }
    .quote-box { background: #1e293b; border-left: 3px solid #38bdf8; padding: 14px 16px; border-radius: 6px; margin: 18px 0; color: #94a3b8; font-style: italic; font-size: 14px; }
    .sig { margin-top: 24px; color: #f8fafc; font-weight: 600; }
    .sub { color: #38bdf8; font-size: 13px; margin-top: 2px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Thanks for reaching out, ${name}!</h2>
    <p>Thank you for contacting me through my portfolio. Your message has been received successfully, and I will get back to you as soon as possible.</p>
    <div class="quote-box">"${message}"</div>
    <div class="sig">
      Akilesh A
      <div class="sub">M.Sc Software Systems &bull; CIT Coimbatore</div>
    </div>
  </div>
</body>
</html>
`.trim();

  try {
    console.log(`[CONTACT] Sending visitor acknowledgement to ${email}...`);
    if (provider.type === 'resend') {
      const result = await provider.client.emails.send({
        from: fromAddress,
        to: [email],
        subject: ackSubject,
        text: textContent,
        html: htmlContent,
      });
      console.log('[CONTACT] Acknowledgement sent successfully to visitor');
      return result;
    } else if (provider.type === 'smtp') {
      const result = await provider.client.sendMail({
        from: fromAddress,
        to: email,
        subject: ackSubject,
        text: textContent,
        html: htmlContent,
      });
      console.log('[CONTACT] Acknowledgement sent successfully to visitor');
      return result;
    }
  } catch (err) {
    console.warn('[CONTACT WARNING] Could not deliver visitor acknowledgement email:', err.message);
    return null;
  }
}
