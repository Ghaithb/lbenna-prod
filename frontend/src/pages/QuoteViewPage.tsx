import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface QuoteItem {
    description: string;
    quantity: number;
    unitPrice: number;
    productId?: string;
}

interface Quote {
    id: string;
    quoteNumber: string;
    clientName?: string;
    clientEmail?: string;
    items: QuoteItem[];
    subtotal: number;
    taxAmount: number;
    total: number;
    status: string;
    validUntil?: string;
    createdAt: string;
}

export default function QuoteViewPage() {
    const { quoteNumber } = useParams();
    const navigate = useNavigate();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadQuote();
    }, [quoteNumber]);

    const loadQuote = async () => {
        try {
            const response = await axios.get(`${API_URL}/quotes/number/${quoteNumber}`);
            setQuote(response.data);
        } catch (error) {
            console.error('Failed to load quote', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!quote) return;
        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/quotes/${quote.id}/accept`);
            alert('Devis accepté avec succès ! Nous vous contacterons prochainement.');
            loadQuote();
        } catch (error) {
            alert('Erreur lors de l\'acceptation du devis');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!quote) return;
        const reason = prompt('Raison du refus (optionnel):');
        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/quotes/${quote.id}/reject`, { reason });
            alert('Devis refusé.');
            loadQuote();
        } catch (error) {
            alert('Erreur lors du refus du devis');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du devis...</p>
                </div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Devis introuvable</h1>
                    <p className="text-gray-600 mb-6">Le numéro de devis n'existe pas ou a expiré.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    const isExpired = quote.validUntil && new Date(quote.validUntil) < new Date();
    const canRespond = (quote.status === 'DRAFT' || quote.status === 'SENT') && !isExpired;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Devis {quote.quoteNumber}</h1>
                            <p className="text-gray-500 mt-1">
                                Créé le {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl font-bold text-sm ${quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                            quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                quote.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                            }`}>
                            {quote.status}
                        </div>
                    </div>

                    {isExpired && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                            <Clock className="w-5 h-5 text-orange-600" />
                            <p className="text-orange-800 font-medium">
                                Ce devis a expiré le {new Date(quote.validUntil!).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    )}

                    {quote.validUntil && !isExpired && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <p className="text-blue-800 font-medium">
                                Valable jusqu'au {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Package className="w-6 h-6" />
                        Articles
                    </h2>
                    <div className="space-y-4">
                        {quote.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{item.description}</p>
                                    <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{(item.quantity * item.unitPrice).toFixed(3)} TND</p>
                                    <p className="text-sm text-gray-500">{item.unitPrice.toFixed(3)} TND / unité</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Sous-total HT:</span>
                            <span className="font-bold">{quote.subtotal.toFixed(3)} TND</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>TVA (19%):</span>
                            <span className="font-bold">{quote.taxAmount.toFixed(3)} TND</span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t">
                            <span>Total TTC:</span>
                            <span>{quote.total.toFixed(3)} TND</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {canRespond && (
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Votre décision</h2>
                        <p className="text-gray-600 mb-6">
                            Veuillez accepter ou refuser ce devis. En l'acceptant, nous procéderons à la création de votre commande.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleAccept}
                                disabled={actionLoading}
                                className="flex-1 bg-green-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Accepter le devis
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={actionLoading}
                                className="flex-1 bg-red-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                Refuser le devis
                            </button>
                        </div>
                    </div>
                )}

                {quote.status === 'ACCEPTED' && (
                    <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center space-y-6">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                        <div>
                            <h2 className="text-2xl font-bold text-green-900 mb-2">Devis accepté !</h2>
                            <p className="text-green-700">
                                Merci pour votre confiance. Vous pouvez maintenant finaliser votre commande.
                            </p>
                        </div>
                        <button
                            onClick={async () => {
                                setActionLoading(true);
                                try {
                                    await axios.post(`${API_URL}/quotes/${quote.id}/convert`, {}, {
                                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                    });
                                    alert('Commande créée avec succès ! redirection vers votre tableau de bord...');
                                    navigate('/dashboard');
                                } catch (error) {
                                    alert('Erreur lors de la conversion du devis. Vérifiez que vous avez un compte client.');
                                } finally {
                                    setActionLoading(false);
                                }
                            }}
                            disabled={actionLoading}
                            className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                        >
                            💳 Payer maintenant & Commander
                        </button>
                    </div>
                )}

                {quote.status === 'REJECTED' && (
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
                        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-900 mb-2">Devis refusé</h2>
                        <p className="text-red-700">
                            Ce devis a été refusé. N'hésitez pas à nous contacter pour toute question.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
