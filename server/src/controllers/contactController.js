import { processContactMessage } from '../services/contactService.js';

export async function submitContactMessage(req, res, next) {
  try {
    const { name, email, subject, message, _honeypot, website } = req.body;

    // Anti-spam honeypot check
    if (_honeypot || website) {
      console.warn('[CONTACT] Honeypot triggered. Silently rejecting bot request.');
      return res.status(400).json({
        success: false,
        message: 'Spam detected.',
      });
    }

    // Server-side validation
    if (!name || !name.trim() || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name is required and must be between 2 and 100 characters.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim() || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    if (!message || !message.trim() || message.trim().length < 10 || message.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be between 10 and 3000 characters.',
      });
    }

    const sanitizedSubject = subject ? subject.trim().substring(0, 150) : 'General Inquiry';
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const result = await processContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: sanitizedSubject,
      message: message.trim(),
      ipAddress,
      userAgent,
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully. A confirmation email has been sent to your inbox.',
      data: result,
    });
  } catch (error) {
    console.error('[CONTACT CONTROLLER ERROR]', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Unable to send your message. Please try again later or email directly.',
    });
  }
}
