/**
 * API Client for interacting with the portfolio backend.
 * Uses local proxy in development and VITE_API_URL in production.
 */

const isDev = import.meta.env.DEV;
const rawBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
let defaultBase = isDev ? '/api' : (rawBase ? rawBase.replace(/\/+$/, '') : '/api');

if (!isDev && defaultBase.startsWith('http') && !defaultBase.endsWith('/api')) {
  defaultBase = `${defaultBase}/api`;
}

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async request(endpoint, options = {}) {
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

    // 15-second timeout controller for smooth transactional email & Atlas queries
    const controller = new AbortController();
    const timeoutMs = options.timeout || 60000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
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

  getFileUrl(fileId, fallbackUrl = '') {
    if (!fileId) return fallbackUrl;
    return `${this.baseUrl}/files/${fileId}`;
  }

  getResumeUrl(download = false, type = 'sde') {
    return `${this.baseUrl}/resume?type=${type}${download ? '&download=true' : ''}`;
  }
}

export const api = new ApiClient(defaultBase);
export default api;
