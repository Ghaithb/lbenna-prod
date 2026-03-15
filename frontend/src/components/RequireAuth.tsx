import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function resolveApiBase(): string {
  return (
    (typeof globalThis !== 'undefined' && (globalThis as any).__API_BASE__) ||
    (typeof process !== 'undefined' && (process as any)?.env?.VITE_API_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_URL) ||
    '/api'
  );
}

export default function RequireAuth() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('token') : null;
        if (!token) throw new Error('no-token');
        const res = await fetch(`${resolveApiBase()}/auth/client/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('unauthorized');
        if (mounted) setAllowed(true);
      } catch {
        if (mounted) setAllowed(false);
        navigate('/login', { replace: true, state: { from: location.pathname } });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">Vérification de votre compte…</div>
    );
  }

  return allowed ? <Outlet /> : null;
}
