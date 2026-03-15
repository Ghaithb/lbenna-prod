import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Lien de réinitialisation invalide ou manquant.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/reset-password', { token, password });
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Lien expiré ou invalide.');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">Mot de passe modifié !</h1>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
                    </p>
                    <div className="pt-4">
                        <Link to="/login" className="px-8 py-3 bg-gray-950 text-white rounded-2xl font-black hover:bg-gray-800 transition-all">
                            Se connecter maintenant
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center">
                    <h1 className="text-3xl font-black text-gray-950 mb-2">Nouveau mot de passe</h1>
                    <p className="text-gray-500 font-medium text-sm">
                        Choisissez un mot de passe robuste de 8 caractères minimum.
                    </p>
                </div>

                {!token ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-950 text-white py-4 rounded-2xl font-black hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Enregistrer le nouveau mot de passe'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
