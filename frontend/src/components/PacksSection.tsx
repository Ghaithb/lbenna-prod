import { useEffect, useState } from 'react';
import { serviceOffersService, ServiceOffer } from '../services/serviceOffers';
import { Link } from 'react-router-dom';

export default function PacksSection() {
    const [packs, setPacks] = useState<ServiceOffer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPacks = async () => {
            try {
                const allServices = await serviceOffersService.getAll();
                const packServices = allServices.filter((s: ServiceOffer) => s.isActive && s.isPack);
                setPacks(packServices);
            } catch (err) {
                console.error("Failed to fetch packs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPacks();
    }, []);

    if (loading) return null;
    if (packs.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-purple-600 font-black tracking-widest uppercase text-sm mb-4 block">
                        Solutions Tout-en-un
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                        Nos Packs Services
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Des formules complètes pensées pour simplifier votre projet et maximiser votre budget.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {packs.map((pack, index) => {
                        const isHighlighted = pack.badge || index === 1;
                        return (
                            <div key={pack.id} className={`relative bg-white rounded-[2.5rem] p-8 border hover:border-purple-200 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-100 ${isHighlighted ? 'border-purple-200 shadow-xl shadow-purple-50 lg:-mt-8 lg:mb-8 z-10' : 'border-gray-100 shadow-sm'}`}>
                                {isHighlighted && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg whitespace-nowrap">
                                        {pack.badge || 'Recommandé'}
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">{pack.title}</h3>
                                    <p className="text-gray-400 font-medium text-sm mb-6 h-10 line-clamp-2">{pack.description}</p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        {pack.price ? (
                                            <>
                                                <span className="text-5xl font-black text-gray-900">{pack.promoPrice || pack.price}</span>
                                                <span className="text-xl font-bold text-gray-400">TND</span>
                                            </>
                                        ) : (
                                            <span className="text-3xl font-black text-gray-900">Sur Devis</span>
                                        )}
                                    </div>
                                    {pack.promoPrice && pack.price && (
                                        <span className="text-sm font-bold text-red-500 line-through block mt-2">
                                            Au lieu de {pack.price} TND
                                        </span>
                                    )}
                                </div>

                                <div className="mb-10 min-h-[100px] flex items-center justify-center border border-dashed border-gray-200 rounded-2xl">
                                    <p className="text-sm font-bold text-gray-400 italic text-center px-4">
                                        Pack complet tout inclus
                                    </p>
                                </div>

                                <Link
                                    to="/contact"
                                    className={`w-full block py-4 rounded-xl font-black text-center text-sm uppercase tracking-widest transition-all ${isHighlighted ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200' : 'bg-gray-50 text-gray-900 hover:bg-gray-900 hover:text-white'}`}
                                >
                                    Choisir ce pack
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
