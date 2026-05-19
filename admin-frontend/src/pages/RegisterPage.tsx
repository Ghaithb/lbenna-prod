import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register: doRegister } = useAuth();
    const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(null);
    const [setupSecret, setSetupSecret] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
    });

    useEffect(() => {
        api.get<{ adminRegistrationOpen: boolean }>('/auth/registration-status')
            .then((r) => setRegistrationOpen(r.data.adminRegistrationOpen))
            .catch(() => setRegistrationOpen(false));
    }, []);

    const { mutate: register, isPending, error } = useMutation({
        mutationFn: (data: typeof formData & { setupSecret?: string }) => doRegister(data),
        onSuccess: () => navigate('/', { replace: true }),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register({ ...formData, setupSecret: setupSecret || undefined });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev: typeof formData) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-3xl shadow-2xl border border-slate-100">
                <div>
                    <h2 className="text-center text-3xl font-black text-slate-900">Créer un compte Admin</h2>
                    <p className="mt-2 text-center text-sm font-bold text-slate-400 uppercase">L Benna Production</p>
                </div>

                {registrationOpen === false && (
                    <p className="p-4 bg-amber-50 text-amber-800 text-xs font-bold rounded-2xl border border-amber-100 text-center">
                        Un admin existe déjà. Saisissez le code secret d&apos;invitation.
                    </p>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input name="firstName" placeholder="Prénom" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border" />
                    <input name="lastName" placeholder="Nom" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border" />
                    <input name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border" />
                    <input name="phone" type="tel" placeholder="Téléphone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border" />
                    {registrationOpen === false && (
                        <input type="password" placeholder="Code secret" required value={setupSecret} onChange={(e) => setSetupSecret(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" />
                    )}
                    <input name="password" type="password" placeholder="Mot de passe (8+ caractères)" required minLength={8} value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border" />
                    {error && <p className="text-red-600 text-xs text-center">Erreur inscription</p>}
                    <button type="submit" disabled={isPending || registrationOpen === null} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold disabled:opacity-50">
                        {isPending ? 'Création...' : 'Créer mon compte'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400">
                    <Link to="/login" className="text-orange-600">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}
