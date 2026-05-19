import axios from 'axios';
import { resolveApiBaseUrl } from './api-base';

// Move getAdminToken logic directly here to avoid circular dependency
const getAdminToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
};

const BASE_URL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
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