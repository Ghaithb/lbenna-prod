import axios from 'axios';

// Move getAdminToken logic directly here to avoid circular dependency
const getAdminToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
};

// Resolve API URL using Vite's import.meta.env
// In production, use VITE_API_URL from .env
// In development, defaults to '/api' but we override it in .env  
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  } as const,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as any;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);