import ContactMessage from '../models/ContactMessage.js';
import { sendOwnerNotification, sendVisitorAcknowledgement } from './emailService.js';

/**
 * Orchestrates real contact delivery:
 * 1. Sends email notification to portfolio owner
 * 2. Sends auto-acknowledgement email to visitor
 * 3. Saves submission and statuses in MongoDB Atlas
 */
export async function processContactMessage({ name, email, subject, message, ipAddress, userAgent }) {
  console.log(`[CONTACT] Request received from ${name} (${email})`);

  let ownerEmailStatus = 'PENDING';
  let visitorEmailStatus = 'PENDING';

  // 1. Send owner notification first (MANDATORY: failure stops success response!)
  try {
    await sendOwnerNotification({ name, email, subject, message, ipAddress });
    ownerEmailStatus = 'SENT';
  } catch (err) {
    ownerEmailStatus = 'FAILED';
    console.error('[CONTACT ERROR] Owner email delivery failed:', err.message);

    // Save failed attempt in MongoDB for diagnostic auditing
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
        visitorEmailStatus: 'FAILED',
        errorMessage: err.message,
      });
    } catch { }

    // Re-throw so API returns 500/503 and frontend NEVER displays fake success!
    throw new Error(err.message || 'Email delivery failed.');
  }

  // 2. Send visitor acknowledgement email
  try {
    const ackResult = await sendVisitorAcknowledgement({ name, email, subject, message });
    visitorEmailStatus = ackResult ? 'SENT' : 'FAILED';
  } catch (err) {
    visitorEmailStatus = 'FAILED';
    console.warn('[CONTACT WARNING] Visitor acknowledgement failed:', err.message);
  }

  // 3. Save to MongoDB Atlas
  let contact = null;
  try {
    console.log('[CONTACT] Saving message to MongoDB Atlas...');
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
      visitorEmailStatus,
    });
    console.log('[CONTACT] Contact request completed. ID:', contact._id);
  } catch (dbErr) {
    console.warn('[CONTACT WARNING] Could not persist message to MongoDB Atlas:', dbErr.message);
  }

  return {
    id: contact?._id || 'delivered',
    emailStatus: 'SENT',
    ownerEmailStatus,
    visitorEmailStatus,
  };
}
