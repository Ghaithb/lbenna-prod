import { useState, useRef, useEffect } from 'react';
import {
    Camera, Check, ChevronRight,
    ShieldCheck, Zap, Sparkles, Loader2
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useForm } from 'react-hook-form';
import { bookingsService } from '../services/bookings';
import { serviceOffersService, ServiceOffer } from '../services/serviceOffers';

export function PhotoboothPage() {
    const [offers, setOffers] = useState<ServiceOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPack, setSelectedPack] = useState<ServiceOffer | null>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();


    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await serviceOffersService.getAll();
                // Filter for Photobooth related offers (by category or title keyword)
                const photoboothOffers = data.filter((o: any) =>
                    o.title.toLowerCase().includes('photobooth') ||
                    (o.category && o.category.slug.includes('photobooth'))
                );

                setOffers(photoboothOffers);
                if (photoboothOffers.length > 0) setSelectedPack(photoboothOffers[1] || photoboothOffers[0]);
            } catch (err) {
                console.error('Failed to load photobooth offers', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const onSubmit = async (data: any) => {
        if (!selectedPack) return;
        try {
            await bookingsService.create({
                serviceOfferId: selectedPack.id,
                bookingDate: new Date(data.date).toISOString(),
                customerName: data.name,
                customerEmail: data.email,
                customerPhone: data.phone,
                notes: `Pack choisi : ${selectedPack.title}. Événement : ${data.eventType}. ${data.notes || ''}`
            });
            alert('Réservation envoyée avec succès !');
        } catch (err) {
            console.error(err);
            alert('Une erreur est survenue.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-blue-600 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/50 to-blue-900" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <SectionHeader
                        title="Location Photobooth Lab El Benna"
                        subtitle="L'animation indispensable pour vos mariages, soirées et événements corporate."
                        badge="Animation Premium"
                        icon={Sparkles}
                        dark
                    />
                    <div className="flex justify-center gap-6 mt-12 flex-wrap">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-3">
                            <Zap className="text-yellow-400" size={20} />
                            <span className="font-bold text-sm tracking-tight">Installation Rapide</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-3">
                            <ShieldCheck className="text-green-400" size={20} />
                            <span className="font-bold text-sm tracking-tight">Assistance 24/7</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-3">
                            <Check className="text-blue-200" size={20} />
                            <span className="font-bold text-sm tracking-tight">Impressions Illimitées</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <SectionHeader
                        title="Choisissez votre Pack"
                        subtitle="Nos tarifs incluent le transport, l'installation et l'assistance."
                        badge="Nos Offres"
                        icon={Camera}
                    />
                    <div className="grid gap-6">
                        {offers.map((offer) => (
                            <div key={offer.id} className="space-y-4">
                                <button
                                    onClick={() => {
                                        setSelectedPack(offer);
                                        scrollToForm();
                                    }}
                                    className={`w-full relative p-8 rounded-[2.5rem] border-2 transition-all text-left flex items-start gap-6 group ${(selectedPack as any)?.id === offer.id
                                        ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-100'
                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${(selectedPack as any)?.id === offer.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {(selectedPack as any)?.id === offer.id ? <Check size={24} /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPack?.id === offer.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                                {offer.badge || 'Pack'}
                                            </span>
                                            <span className="text-xl font-black text-gray-950">
                                                {offer.price ? `${offer.price} TND` : 'Sur Devis'}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-black text-gray-950 mb-4">{offer.title}</h4>
                                        <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                                            {offer.features?.map((f: string, i: number) => (
                                                <li key={i} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                                    <div className="w-1 h-1 rounded-full bg-blue-400" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </button>
                                {selectedPack?.id === offer.id && (
                                    <button
                                        onClick={scrollToForm}
                                        className="w-full md:hidden py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs animate-in slide-in-from-top-2"
                                    >
                                        Réserver ce pack maintenant
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                </div>

                <div className="relative">
                    <div ref={formRef} className="sticky top-32 bg-gray-950 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl overflow-hidden border-2 border-blue-500/30">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h3 className="text-3xl font-black mb-2">Réserver ma date</h3>
                                <p className="text-gray-400 font-medium">Remplissez le formulaire, nous vous rappelons.</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Date de l'événement</label>
                                        <input type="date" {...register('date', { required: true })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Type d'événement</label>
                                        <select {...register('eventType')} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white">
                                            <option value="Mariage" className="text-gray-900">Mariage</option>
                                            <option value="Anniversaire" className="text-gray-900">Anniversaire</option>
                                            <option value="Ouverture Boutique" className="text-gray-900">Ouverture de boutique</option>
                                            <option value="Corporate" className="text-gray-900">Corporate / Entreprise</option>
                                            <option value="Autre" className="text-gray-900">Autre</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Nom & Prénom</label>
                                    <input type="text" {...register('name', { required: true })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" placeholder="Ahmed Benna" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Email</label>
                                        <input type="email" {...register('email', { required: true })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" placeholder="ahmed@mail.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Téléphone</label>
                                        <input type="tel" {...register('phone', { required: true })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" placeholder="20 000 000" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Précisions</label>
                                    <textarea {...register('notes')} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white resize-none" rows={3} placeholder="Lieu, horaires souhaités..." />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <>Réserver mon expérience <ChevronRight size={20} /></>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
