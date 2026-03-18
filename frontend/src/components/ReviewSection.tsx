import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, ShieldCheck } from 'lucide-react';

interface ReviewSectionProps {
    productId?: string;
    className?: string;
}

interface Review {
    id: string;
    user: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
    likes: number;
}

// @ts-ignore
export function ReviewSection({ productId: _productId }: ReviewSectionProps) {
    // Mock data for now
    const [reviews] = useState<Review[]>([
        {
            id: '1',
            user: 'Sarah M.',
            rating: 5,
            date: '12 Déc. 2025',
            comment: 'La qualité du papier Fine Art est tout simplement incroyable. Les couleurs sont fidèles à mon écran et le grain apporte une profondeur magnifique.',
            verified: true,
            likes: 12
        },
        {
            id: '2',
            user: 'Karim L.',
            rating: 4,
            date: '05 Nov. 2025',
            comment: 'Très satisfait du cadre bois naturel. Livraison soignée et rapide. Je recommande vivement pour des tirages pro.',
            verified: true,
            likes: 8
        }
    ]);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-950">Avis Clients</h2>
                    <p className="text-gray-500 mt-2 font-medium">Ce que nos collectionneurs disent de nos tirages.</p>
                </div>
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="text-center px-4 border-r border-gray-200">
                        <p className="text-3xl font-black text-gray-950">4.9</p>
                        <div className="flex text-yellow-400 mt-1">
                            <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                        </div>
                    </div>
                    <div className="text-sm">
                        <p className="font-bold text-gray-900">128 Avis vérifiés</p>
                        <p className="text-gray-400">98% de satisfaction</p>
                    </div>
                    <button className="bg-gray-950 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-colors">
                        Écrire un avis
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((review) => (
                    <div key={review.id} className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg">
                                    {review.user.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                        {review.user}
                                        {review.verified && <ShieldCheck size={14} className="text-blue-500" />}
                                    </h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed italic">
                            "{review.comment}"
                        </p>

                        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-6">
                            <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">
                                <ThumbsUp size={14} /> {review.likes} Utile
                            </button>
                            <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors">
                                <MessageSquare size={14} /> Répondre
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
