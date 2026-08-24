import api from './api';

export const analyticsService = {
  /**
   * Track non-invasive portfolio events.
   */
  async track(eventType, target = '', metadata = {}) {
    try {
      await api.post('/analytics', { eventType, target, metadata });
    } catch {
      // Non-blocking telemetry
    }
  },
};

export default analyticsService;
