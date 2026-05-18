import { useEffect, useState } from 'react';
import { serviceOffersService, ServiceOffer } from '../services/serviceOffers';
import { Link } from 'react-router-dom';
import { Check, Camera, Sparkles, Briefcase, Loader2 } from 'lucide-react';

const IconMap: any = {
  Camera, Sparkles, Briefcase, Check
};

function DynamicIcon({ name, className }: { name: string, className?: string }) {
  const Icon = IconMap[name] || Camera;
  return <Icon className={className} />;
}

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

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        );
    }
    if (packs.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary-500 font-bold tracking-wider uppercase text-sm">Sur-Mesure</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4 tracking-tighter">Nos Packs Exclusifs</h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Des formules étudiées pour répondre à chaque besoin, avec la garantie de la qualité L Benna.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-stretch pt-8">
                    {packs.map((pack, idx) => {
                        const isPopular = pack.badge || idx === 1;
                        const iconName = pack.title.toLowerCase().includes('corporate') ? 'Briefcase' : 
                                       pack.title.toLowerCase().includes('prestige') ? 'Sparkles' : 'Camera';

                        return (
                            <div
                                key={pack.id}
                                className={`relative bg-white rounded-3xl p-8 border ${isPopular ? 'border-primary-500 shadow-2xl scale-105 z-20' : 'border-gray-100 shadow-lg hover:shadow-xl'} group transition-all duration-500 hover:-translate-y-2 flex flex-col`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-5 inset-x-0 flex justify-center">
                                        <span className="bg-gradient-fire text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                                            {pack.badge || 'Le Choix Préféré'}
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2">{pack.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{pack.description}</p>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${isPopular ? 'bg-primary-50 text-primary-500' : 'bg-gray-50 text-gray-400'}`}>
                                        <DynamicIcon name={iconName} className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-gray-900 tracking-tight">
                                            {pack.promoPrice || pack.price ? `${pack.promoPrice || pack.price} TND` : 'Sur Devis'}
                                        </span>
                                        {(pack.promoPrice || pack.price) && <span className="text-gray-400 text-sm font-medium">/ partir de</span>}
                                    </div>
                                    {pack.promoPrice && pack.price && (
                                        <span className="text-sm font-bold text-red-500 line-through block mt-1">
                                            {pack.price} TND
                                        </span>
                                    )}
                                </div>

                                <ul className="mb-8 flex-1 space-y-4">
                                    {(pack.features || []).length > 0 ? (
                                        pack.features.map((feature: string, fIdx: number) => (
                                            <li key={fIdx} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                                                <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${isPopular ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'}`}>
                                                    <Check size={14} strokeWidth={3} />
                                                </div>
                                                {feature}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="flex items-start gap-3 text-sm font-medium text-gray-400 italic">
                                            Pack complet tout inclus
                                        </li>
                                    )}
                                </ul>

                                <Link
                                    to="/contact"
                                    className={`w-full py-4 rounded-xl flex items-center justify-center font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                                        isPopular 
                                            ? 'bg-gradient-fire text-white hover:shadow-lg hover:shadow-primary-500/30' 
                                            : 'bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100 hover:border-gray-200'
                                    }`}
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
