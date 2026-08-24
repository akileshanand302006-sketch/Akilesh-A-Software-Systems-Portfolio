import { trackEvent } from '../services/analyticsService.js';

export async function recordAnalytics(req, res, next) {
  try {
    const { eventType, target, metadata } = req.body;

    if (!eventType) {
      return res.status(400).json({ success: false, message: 'eventType is required' });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await trackEvent({
      eventType,
      target,
      metadata,
      ipHash: ipAddress ? Buffer.from(ipAddress).toString('base64').substring(0, 16) : '',
      userAgent,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
}
