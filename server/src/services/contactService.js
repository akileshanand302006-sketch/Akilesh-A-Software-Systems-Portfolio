import ContactMessage from '../models/ContactMessage.js';
import { sendContactEmail, isResendConfigured } from './emailService.js';

/**
 * Orchestrates contact email delivery and database persistence:
 * 1. Dispatches message to Akilesh via Resend REST API (HTTPS/443)
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

  // Step 1: Deliver email via Resend REST API
  let emailDeliveryResult = null;
  try {
    emailDeliveryResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
      ipAddress,
    });
  } catch (deliveryError) {
    console.error('[CONTACT ERROR] Resend email delivery failed:', deliveryError.message);

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
        errorMessage: deliveryError.message,
      });
    } catch {}

    // Re-throw so the controller returns 500 and the frontend never displays false success
    throw deliveryError;
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
    messageId: emailDeliveryResult?.id || emailDeliveryResult?.messageId,
  };
}
