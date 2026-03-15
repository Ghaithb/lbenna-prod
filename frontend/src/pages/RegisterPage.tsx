import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as any;

  const API = (
    (typeof globalThis !== 'undefined' && (globalThis as any).__API_BASE__) ||
    (typeof process !== 'undefined' && (process as any)?.env?.VITE_API_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_URL) ||
    '/api'
  );

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      if (!res.ok) throw new Error(await res.text());
      // Register endpoint already returns an access_token → use it directly
      const data = await res.json();
      const token = data?.access_token || data?.token;
      if (!token) throw new Error("Jeton d'authentification manquant après l'inscription");
      localStorage.setItem('token', token);
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-changed'));
      const back = location?.state?.from || '/learning/tutorials';
      navigate(back, { replace: true });
    } catch (e: any) {
      setError(e?.message || 'Inscription échouée');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>
        {error && <div className="mb-3 rounded bg-red-50 p-2 text-red-700 text-sm">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Prénom</label>
            <input className="w-full rounded border px-3 py-2" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nom</label>
            <input className="w-full rounded border px-3 py-2" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input type="email" required className="w-full rounded border px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
            <input type="password" required className="w-full rounded border px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button disabled={pending} type="submit" className="w-full mt-2 rounded bg-purple-600 text-white py-2 disabled:opacity-60">
            {pending ? 'Création…' : "S'inscrire"}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Déjà un compte ? <Link to="/login" className="text-purple-700 underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
