import { Tag, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { announcementsService, Announcement } from '../services/announcements';


export default function PromoCarousel() {
    const [promos, setPromos] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPromos = async () => {
            try {
                const data = await announcementsService.getAllActive();
                setPromos(data);
            } catch (err) {
                console.error('Failed to load announcements', err);
            } finally {
                setLoading(false);
            }
        };
        loadPromos();
    }, []);

    if (loading) return (
        <div className="bg-gray-950 py-2 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-primary-500 animate-spin mr-2" />
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Chargement des offres...</span>
        </div>
    );
    if (promos.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 text-white overflow-hidden py-2.5 relative shadow-md z-40">
            <div className="animate-marquee whitespace-nowrap flex items-center">
                {/* Triple duplication for smooth infinite scroll */}
                {[...promos, ...promos, ...promos].map((promo, idx) => (
                    <div key={`${promo.id}-${idx}`} className="inline-flex items-center mx-8">
                        <Tag className="w-4 h-4 mr-2 text-yellow-300 fill-yellow-300" />
                        <span className="font-bold text-sm md:text-base mr-3">{promo.text}</span>
                        {promo.code && (
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono font-bold mr-3 border border-white/30">
                                CODE: {promo.code}
                            </span>
                        )}
                        <Link
                            to={promo.link || "/contact"}
                            className="ml-4 bg-white/20 hover:bg-white text-white hover:text-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all flex items-center gap-1.5 border border-white/30"
                        >
                            En profiter <ArrowRight size={10} strokeWidth={3} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
