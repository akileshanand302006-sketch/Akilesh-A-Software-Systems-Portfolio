import api from './api';

export const contactService = {
  /**
   * Submit contact message to the Express backend.
   * Dispatches real email via Resend REST API (HTTPS/443) and stores in MongoDB Atlas.
   */
  async sendMessage({ name, email, subject, message }) {
    return await api.post('/contact', {
      name,
      email,
      subject,
      message,
    });
  },

  /**
   * Health check for email service availability.
   */
  async getHealth() {
    try {
      return await api.get('/contact/health');
    } catch {
      return { success: false, emailConfigured: false };
    }
  },
};

export default contactService;
