import api from './api';

export const contactService = {
  /**
   * Submit a contact message to the backend.
   */
  async sendMessage({ name, email, subject, message }) {
    try {
      const res = await api.post('/contact', { name, email, subject, message });
      return res;
    } catch (error) {
      throw error;
    }
  },
};

export default contactService;
