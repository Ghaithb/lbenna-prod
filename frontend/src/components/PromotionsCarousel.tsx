import { useEffect, useState } from 'react';
import { serviceOffersService, ServiceOffer } from '../services/serviceOffers';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PromotionsCarousel() {
    const [promos, setPromos] = useState<ServiceOffer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const allServices = await serviceOffersService.getAll();
                const promoServices = allServices.filter((s: ServiceOffer) => s.isActive && s.isPromo);
                setPromos(promoServices);
            } catch (err) {
                console.error("Failed to fetch promos", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPromos();
    }, []);

    if (loading) return null;
    if (promos.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-black tracking-widest uppercase mb-4 animate-pulse">
                        Offres limitées
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                        Promotions Exclusives
                    </h2>
                    <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                        Profitez de tarifs exceptionnels sur nos prestations les plus demandées.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {promos.map((promo) => (
                        <div key={promo.id} className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                            {/* Image */}
                            <div className="h-64 relative overflow-hidden">
                                <div className="absolute top-4 right-4 z-10 bg-red-600 text-white font-black px-4 py-2 rounded-xl shadow-lg transform rotate-3">
                                    PROMO
                                </div>
                                {promo.imageUrl ? (
                                    <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <Tag className="w-16 h-16 text-gray-700" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Content */}
                            <div className="p-8 relative">
                                <div className="mb-4">
                                    <h3 className="text-2xl font-black mb-2 group-hover:text-purple-400 transition-colors">{promo.title}</h3>
                                    <div className="flex items-center gap-4">
                                        {promo.price && (
                                            <span className="text-gray-500 line-through font-bold text-lg">
                                                {promo.price} TND
                                            </span>
                                        )}
                                        {promo.promoPrice && (
                                            <span className="text-3xl font-black text-green-400">
                                                {promo.promoPrice} TND
                                            </span>
                                        )}
                                    </div>
                                    {promo.promoExpiresAt && (
                                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wide">
                                            <Clock size={10} />
                                            Fin le {new Date(promo.promoExpiresAt).toLocaleDateString('fr-FR')}
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-8 h-10">
                                    {promo.description}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                                        <Clock size={14} />
                                        {promo.duration ? `${promo.duration} min` : 'Sur devis'}
                                    </div>
                                    <Link to="/services" className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
