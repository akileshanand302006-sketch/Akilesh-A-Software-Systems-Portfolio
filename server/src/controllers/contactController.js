import { processContactMessage } from '../services/contactService.js';

export async function submitContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, subject, message) are required.',
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const savedMessage = await processContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: { id: savedMessage._id },
    });
  } catch (error) {
    next(error);
  }
}
