import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    isB2B?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();

        // Listen for storage events (multi-tab support)
        window.addEventListener('storage', checkAuth);
        // Listen for custom event from Login page/Header
        window.addEventListener('auth-changed', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-changed', checkAuth);
        };
    }, []);

    const checkAuth = async () => {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const res = await fetch(`${API}/auth/client/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                console.error('Auth verification failed');
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        setUser(userData);
        window.dispatchEvent(new Event('auth-changed'));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.dispatchEvent(new Event('auth-changed'));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
