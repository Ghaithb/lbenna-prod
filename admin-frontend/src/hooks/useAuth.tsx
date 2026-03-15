import * as React from 'react';
import { api } from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

// Response type inline dans la fonction, plus de type externe inutile

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      if (!token) {
        if (!cancelled) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }
      try {
        const resp = await api.get('/auth/admin/me');
        if (!cancelled) {
          setIsAuthenticated(resp.status >= 200 && resp.status < 300);
          setUser(resp.data);
        }
      } catch (_err) {
        localStorage.removeItem('admin_token');
        if (!cancelled) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post<{ access_token: string; user: any }>('/auth/admin/login', credentials);
      localStorage.setItem('admin_token', response.data.access_token);
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      // Step 1: Create the account
      await api.post<{ access_token: string; user: any }>('/auth/register', data);
      // Step 2: Immediately log in via admin/login to get a token with the correct ADMIN role
      // (the register endpoint issues a CLIENT token regardless of the role field)
      const loginResp = await api.post<{ access_token: string; user: any }>('/auth/admin/login', {
        email: data.email,
        password: data.password,
      });
      localStorage.setItem('admin_token', loginResp.data.access_token);
      setIsAuthenticated(true);
      setUser(loginResp.data.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}