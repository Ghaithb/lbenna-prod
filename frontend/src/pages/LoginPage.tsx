import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: login, isPending, error } = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const API = (
        (typeof globalThis !== 'undefined' && (globalThis as any).__API_BASE__) ||
        (typeof process !== 'undefined' && (process as any)?.env?.VITE_API_URL) ||
        (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_URL) ||
        '/api'
      );
      const response = await fetch(`${API}/auth/client/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const data = await response.json();
      const token = data?.access_token || data?.token;
      if (!token) throw new Error('Réponse de connexion invalide');
      localStorage.setItem('token', token);
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-changed'));
      return data;
    },
    onSuccess: () => {
      const back = location?.state?.from || '/learning/tutorials';
      navigate(back, { replace: true });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            L Benna Production
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error instanceof Error ? error.message : 'Une erreur est survenue'}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {isPending ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <div>
              <a href="/register" className="text-sm text-purple-600 hover:text-purple-500 font-medium">
                Pas encore inscrit ? Créez votre compte
              </a>
            </div>
            <div>
              <a href="/forgot-password" hidden={false} className="text-xs text-gray-500 hover:text-gray-900 font-medium">
                Mot de passe oublié ?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}