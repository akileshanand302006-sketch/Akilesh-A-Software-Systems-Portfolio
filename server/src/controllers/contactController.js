import { processContactMessage } from '../services/contactService.js';
import { isSmtpConfigured } from '../services/emailService.js';

/**
 * Health check endpoint indicating whether SMTP mail service is configured.
 * GET /api/contact/health
 */
export function getContactHealth(req, res) {
  res.status(200).json({
    success: true,
    emailConfigured: isSmtpConfigured(),
  });
}

/**
 * Handle contact form submission.
 * Validates inputs, sends email via Gmail SMTP, and saves to MongoDB Atlas.
 * POST /api/contact
 */
export async function submitContactMessage(req, res) {
  try {
    const { name, email, subject, message, _honeypot, website } = req.body || {};

    // 1. Anti-spam honeypot verification
    if (_honeypot || website) {
      console.warn('[CONTACT] Honeypot triggered. Silently rejecting bot request.');
      return res.status(400).json({
        success: false,
        message: 'Please provide valid contact information.',
      });
    }

    // 2. Strict field validation
    // Name validation
    if (!name || typeof name !== 'string' || !name.trim() || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name is required and must be between 2 and 100 characters.',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !email.trim() || email.trim().length > 254 || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // Subject validation
    if (!subject || typeof subject !== 'string' || !subject.trim() || subject.trim().length < 2 || subject.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required and must be between 2 and 200 characters.',
      });
    }

    // Message validation
    if (!message || typeof message !== 'string' || !message.trim() || message.trim().length < 10 || message.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be between 10 and 5000 characters.',
      });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // 3. Process email dispatch and database persistence
    const result = await processContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
      data: {
        id: result.id,
      },
    });
  } catch (error) {
    // Technical logging on server (never exposing passwords or stack traces to client)
    console.error('[CONTACT CONTROLLER ERROR]', error.message);

    res.status(500).json({
      success: false,
      message: 'Unable to send message right now. Please try again or email me directly.',
    });
  }
}
