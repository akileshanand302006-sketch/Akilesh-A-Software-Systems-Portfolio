/**
 * API Client for interacting with the portfolio backend.
 * Uses VITE_API_URL or defaults to localhost:5000/api.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    // Add 8-second timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Returns a streaming URL for a GridFS file ID or local fallback.
   */
  getFileUrl(fileId, fallbackUrl = '') {
    if (!fileId) return fallbackUrl;
    return `${this.baseUrl}/files/${fileId}`;
  }

  /**
   * Returns the resume streaming URL.
   */
  getResumeUrl(download = false) {
    return `${this.baseUrl}/resume${download ? '?download=true' : ''}`;
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
