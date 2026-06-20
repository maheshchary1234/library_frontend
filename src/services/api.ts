import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Shared Axios instance used by all services.
 * - Request interceptor: injects Bearer token from localStorage.
 * - Response interceptor: on 401/403, clears session and redirects to /login.
 */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request: attach JWT ────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: auto-logout on expired / invalid token ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // Clear stale credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login — works outside React components
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
