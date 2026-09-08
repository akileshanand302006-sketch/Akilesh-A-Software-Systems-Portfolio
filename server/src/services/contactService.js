import ContactMessage from '../models/ContactMessage.js';
import { sendContactEmail, isSmtpConfigured } from './emailService.js';

/**
 * Orchestrates contact email delivery and database persistence:
 * 1. Dispatches message to Akilesh via Gmail SMTP (Nodemailer)
 * 2. Persists submission to MongoDB Atlas
 */
export async function processContactMessage({
  name,
  email,
  subject,
  message,
  ipAddress,
  userAgent,
}) {
  console.log(`[CONTACT] Processing contact submission from ${name} (${email})`);

  // Step 1: Deliver email via Gmail SMTP
  let emailDeliveryResult = null;
  try {
    emailDeliveryResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
      ipAddress,
    });
  } catch (smtpError) {
    console.error('[CONTACT] Gmail SMTP delivery failed:', smtpError.message);

    // Save failed attempt in MongoDB for diagnostic auditing if possible
    try {
      await ContactMessage.create({
        name,
        email,
        subject,
        message,
        ipAddress,
        userAgent,
        status: 'NEW',
        emailStatus: 'FAILED',
        ownerEmailStatus: 'FAILED',
        errorMessage: smtpError.message,
      });
    } catch { }

    // Re-throw so the controller returns 500 and the frontend never displays false success
    throw smtpError;
  }

  // Step 2: Persist successful submission to MongoDB Atlas
  let contact = null;
  try {
    console.log('[CONTACT] Persisting message to MongoDB Atlas...');
    contact = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent,
      status: 'NEW',
      emailStatus: 'SENT',
      ownerEmailStatus: 'SENT',
    });
    console.log('[CONTACT] Successfully stored message in MongoDB Atlas. ID:', contact._id);
  } catch (dbError) {
    // Email was already delivered to Akilesh, so log DB warning without failing the user
    console.warn('[CONTACT WARNING] Email delivered, but database persistence failed:', dbError.message);
  }

  return {
    id: contact?._id || 'delivered',
    emailStatus: 'SENT',
    messageId: emailDeliveryResult?.messageId,
  };
}
