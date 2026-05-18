import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Instagram, Facebook, Clock } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const DEFAULT_MESSAGE = "Bonjour L'Benna Production ! Je suis intéressé(e) par vos services.";

export default function WhatsAppButton() {
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 3000);
        return () => clearTimeout(t);
    }, []);

    const rawPhone = settings?.contact_phone || '+21671000000';
    // Clean phone number for WhatsApp link: remove spaces, +, -
    const wa = rawPhone.replace(/[\s\-\+]/g, '');
    const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Popup Card */}
            {isOpen && (
                <div className="fixed bottom-28 right-6 z-[9999] w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-400 p-5 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <div className="font-black text-lg leading-tight">L'Benna Production</div>
                                <div className="text-green-100 text-xs flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse" />
                                    En ligne maintenant
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                            <p className="text-gray-700 text-sm leading-relaxed">
                                👋 Bonjour ! Comment pouvons-nous vous aider ?
                                <br /><br />
                                <span className="text-gray-500 text-xs">
                                    ✅ Devis gratuit en 24h<br />
                                    ✅ Disponible 7j/7<br />
                                    ✅ Réponse rapide garantie
                                </span>
                            </p>
                        </div>

                        {/* Hours */}
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                            <Clock size={12} />
                            <span>Lun–Sam : 9h → 20h | Dim : 10h → 18h</span>
                        </div>

                        {/* CTA */}
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-black py-3.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                        >
                            <MessageCircle size={20} />
                            Démarrer la conversation
                        </a>

                        {/* Phone & Socials */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <a href={`tel:${rawPhone}`} className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors text-xs font-semibold">
                                <Phone size={14} />
                                {rawPhone}
                            </a>
                            <div className="flex gap-2">
                                {settings?.social_instagram && (
                                    <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                                        <Instagram size={14} />
                                    </a>
                                )}
                                {settings?.social_facebook && (
                                    <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                                        <Facebook size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Contact WhatsApp"
                className={`fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95
                    ${isOpen ? 'bg-gray-700 rotate-0' : 'bg-green-500 hover:bg-green-600'}
                `}
            >
                {isOpen ? (
                    <X size={24} className="text-white" />
                ) : (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                )}
                {/* Pulse ring */}
                {!isOpen && (
                    <span className="absolute w-full h-full rounded-full bg-green-400 animate-ping opacity-30" />
                )}
            </button>
        </>
    );
}
