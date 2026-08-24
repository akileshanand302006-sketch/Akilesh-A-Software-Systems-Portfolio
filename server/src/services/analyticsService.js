import Analytics from '../models/Analytics.js';

/**
 * Records a non-invasive analytics interaction.
 */
export async function trackEvent({ eventType, target, metadata, ipHash, userAgent }) {
  return await Analytics.create({
    eventType,
    target,
    metadata,
    ipHash,
    userAgent,
  });
}
