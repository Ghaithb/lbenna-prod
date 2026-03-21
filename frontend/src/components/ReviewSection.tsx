import { useEffect, useState } from 'react';
import { Star, Check, Loader2 } from 'lucide-react';
import { reviewsService, Review } from '../services/reviews';

export default function ReviewSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await reviewsService.getPublic();
                setReviews(data);
            } catch (err) {
                console.error('Failed to fetch reviews', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement des avis...</p>
            </div>
        );
    }

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-950">Avis Clients</h2>
                        <p className="text-gray-500 mt-2 font-medium">Ce que nos clients disent de nos prestations.</p>
                    </div>
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="text-center px-4 border-r border-gray-200">
                            <p className="text-3xl font-black text-gray-950">5.0</p>
                            <div className="flex text-yellow-400 mt-1">
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                            </div>
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-gray-900">Avis vérifiés</p>
                            <p className="text-gray-400">100% de satisfaction</p>
                        </div>
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Aucun avis pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {new Date(review.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>

                                <p className="text-gray-600 leading-relaxed mb-8 italic">"{review.comment}"</p>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-fire rounded-full flex items-center justify-center text-white font-black uppercase">
                                            {review.user.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 leading-none mb-1">{review.user}</p>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <Check size={8} className="text-white" strokeWidth={4} />
                                                </div>
                                                <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Client Vérifié</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
