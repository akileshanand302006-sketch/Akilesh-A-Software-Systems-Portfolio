/**
 * API Client for interacting with the portfolio backend.
 * Uses VITE_API_URL or defaults to localhost:5000/api.
 */

// In local dev without explicit backend URL, default to '/api' to use Vite proxy (proxying to localhost:5000)
const rawBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
let defaultBase = rawBase ? rawBase.replace(/\/+$/, '') : '/api';

// If a domain is provided without /api (e.g. https://my-backend.com), ensure /api is attached
if (defaultBase.startsWith('http') && !defaultBase.endsWith('/api')) {
  defaultBase = `${defaultBase}/api`;
}

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async request(endpoint, options = {}) {
    // Avoid /api/api/ duplication if both baseUrl ends in /api and endpoint starts with /api
    let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (this.baseUrl.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
      cleanEndpoint = cleanEndpoint.replace(/^\/api/, '');
    }

    const url = `${this.baseUrl}${cleanEndpoint}`;
    
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

export const api = new ApiClient(defaultBase);
export default api;
