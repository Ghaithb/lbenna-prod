import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/forgot-password', { email });
            setIsSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">Vérifiez vos emails</h1>
                    <p className="text-gray-500 leading-relaxed font-medium">
                        Si un compte est associé à <strong>{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe d'ici quelques instants.
                    </p>
                    <div className="pt-4">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
                        >
                            <ArrowLeft size={18} />
                            Retour à la connexion
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
                    <h1 className="text-3xl font-black text-gray-950 mb-2">Mot de passe oublié ?</h1>
                    <p className="text-gray-500 font-medium text-sm">
                        Pas de panique ! Entrez votre email pour recevoir un lien de récupération.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email professionnel</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="nom@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
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
                            'Envoyer le lien de récupération'
                        )}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Revenir à la page de connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}
