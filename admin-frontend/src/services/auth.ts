import { api } from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const loginAdmin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/admin/login', credentials);
  // Axios instance considers <500 as ok; here we enforce 2xx with token
  if (response.status < 200 || response.status >= 300 || !response.data?.access_token) {
    const msg = (response as any)?.data?.message || (response as any)?.statusText || 'Échec de connexion';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }
  // Sauvegarder le token
  localStorage.setItem('admin_token', response.data.access_token);
  return response.data;
};

export const logoutAdmin = async () => {
  // Backend n'a pas d'endpoint logout: on invalide côté client
  localStorage.removeItem('admin_token');
};

export const getAdminToken = () => {
  return localStorage.getItem('admin_token');
};