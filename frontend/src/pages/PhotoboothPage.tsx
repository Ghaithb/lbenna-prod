import { useState, useRef, useEffect } from 'react';
import {
    Camera, Check, ChevronRight,
    ShieldCheck, Zap, Sparkles, Loader2, Star,
    Heart, Building2, Clock, MapPin
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useForm } from 'react-hook-form';
import { bookingsService } from '../services/bookings';
import { serviceOffersService, ServiceOffer } from '../services/serviceOffers';

// ─── Event type config ─────────────────────────────────────────────────
const EVENT_TYPES = [
    { id: 'mariage',   label: 'Mariage',          icon: Heart,     keywords: ['mariage', 'wedding'] },
    { id: 'anniv',     label: 'Anniversaire',     icon: Sparkles,  keywords: ['anniversaire', 'fête'] },
    { id: 'corporate', label: 'Corporate',        icon: Building2, keywords: ['corporate', 'entreprise', 'pro'] },
    { id: 'boutique',  label: 'Ouverture',        icon: ShieldCheck, keywords: ['ouverture', 'boutique', 'lancement'] },
    { id: 'autre',     label: 'Autre Event',      icon: Zap,       keywords: [] },
];

const DURATIONS = [
    { id: '1h',    label: '1 heure' },
    { id: '2-4h',  label: '2 – 4 heures' },
    { id: 'half',  label: 'Demi-journée' },
    { id: 'full',  label: 'Journée complète' },
    { id: 'multi', label: 'Plusieurs jours' },
];

export function PhotoboothPage() {
    const [offers, setOffers] = useState<ServiceOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPack, setSelectedPack] = useState<ServiceOffer | null>(null);
    const [eventType, setEventType] = useState('mariage');
    const [duration, setDuration] = useState('full');
    const formRef = useRef<HTMLDivElement>(null);
    const { register, handleSubmit, formState: { isSubmitting }, setValue } = useForm();

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await serviceOffersService.getAll();
                // Filter for Photobooth related offers
                const photoboothOffers = data.filter((o: any) =>
                    o.title.toLowerCase().includes('photobooth') ||
                    (o.category && o.category.slug.includes('photobooth'))
                );
                setOffers(photoboothOffers);
                if (photoboothOffers.length > 0) {
                    const defaultPack = photoboothOffers[1] || photoboothOffers[0];
                    setSelectedPack(defaultPack);
                    setValue('serviceOfferId', defaultPack.id);
                }
            } catch (err) {
                console.error('Failed to load photobooth offers', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, [setValue]);

    const scrollToForm = (offer?: ServiceOffer) => {
        if (offer) {
            setSelectedPack(offer);
            setValue('serviceOfferId', offer.id);
        }
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const onSubmit = async (data: any) => {
        if (!selectedPack) return;
        try {
            const ev = EVENT_TYPES.find(e => e.id === eventType);
            const dur = DURATIONS.find(d => d.id === duration);
            
            await bookingsService.create({
                serviceOfferId: selectedPack.id,
                bookingDate: new Date(data.date).toISOString(),
                customerName: data.name,
                customerEmail: data.email,
                customerPhone: data.phone,
                eventType: ev?.label,
                duration: dur?.label,
                location: data.location,
                guests: data.guests,
                companyName: data.company,
                notes: data.notes,
                dynamicDetails: {
                    packSelected: selectedPack.title,
                }
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
                    <SectionHeader title="Location Photobooth L Benna Production" subtitle="L'animation indispensable pour vos événements." badge="Animation Premium" icon={Sparkles} dark />
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
                {/* Left: Packs */}
                <div className="space-y-12">
                    <SectionHeader title="Choisissez votre Pack" subtitle="Nos tarifs incluent le transport, l'installation et l'assistance." badge="Nos Offres" icon={Camera} />
                    <div className="grid gap-6">
                        {offers.map((offer) => (
                            <div key={offer.id} className="space-y-4">
                                <button
                                    onClick={() => scrollToForm(offer)}
                                    className={`w-full relative p-8 rounded-[2.5rem] border-2 transition-all text-left flex items-start gap-6 group ${(selectedPack as any)?.id === offer.id
                                        ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-100'
                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${(selectedPack as any)?.id === offer.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
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
                                        <div className="mt-4 py-2 border-t border-gray-50 flex items-center gap-2">
                                            <Star size={14} className="text-blue-400" />
                                            <span className="text-xs font-bold text-gray-400 italic">Animation tout inclus</span>
                                        </div>
                                    </div>
                                </button>
                                {selectedPack?.id === offer.id && (
                                    <button onClick={() => scrollToForm()} className="w-full md:hidden py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs animate-in slide-in-from-top-2">
                                        Réserver ce pack maintenant
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Intelligent Form */}
                <div className="relative">
                    <div ref={formRef} className="sticky top-32 bg-gray-950 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl overflow-hidden border-2 border-blue-500/30">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-7">
                            <div>
                                <h3 className="text-3xl font-black mb-2">Réserver ma date</h3>
                                <p className="text-gray-400 font-medium">L'expérience Photobooth sur-mesure.</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                {/* 1. Event Type */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Type d'événement</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {EVENT_TYPES.map(ev => {
                                            const Icon = ev.icon;
                                            return (
                                                <button type="button" key={ev.id} onClick={() => setEventType(ev.id)}
                                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center text-xs font-black ${eventType === ev.id ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                                                    <Icon size={18} />
                                                    <span className="leading-tight">{ev.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 2. Selected Pack Display (read-only in UI, managed by state) */}
                                {selectedPack && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Pack sélectionné</label>
                                        <div className="w-full px-5 py-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl font-bold text-white flex justify-between">
                                            <span>{selectedPack.title}</span>
                                            <span className="text-blue-400">{selectedPack.price ? `${selectedPack.price} TND` : 'Sur Devis'}</span>
                                        </div>
                                    </div>
                                )}

                                {/* 3. Date + Duration */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1"><Clock size={10} /> Date</label>
                                        <input type="date" {...register('date', { required: true })} className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Durée</label>
                                        <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white">
                                            {DURATIONS.map(d => <option key={d.id} value={d.id} className="text-gray-900">{d.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* 4. Location */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1"><MapPin size={10} /> Lieu d'installation</label>
                                    <input type="text" {...register('location')} placeholder="Salle des fêtes, Hôtel, etc." className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" />
                                </div>

                                {/* 5. Dynamic fields */}
                                {eventType === 'mariage' && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Nombre d'invités estimé</label>
                                        <select {...register('guests')} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white">
                                            <option value="<50" className="text-gray-900">Moins de 50</option>
                                            <option value="50-100" className="text-gray-900">50 – 100</option>
                                            <option value="100-200" className="text-gray-900">100 – 200</option>
                                            <option value=">200" className="text-gray-900">Plus de 200</option>
                                        </select>
                                    </div>
                                )}
                                {['corporate', 'boutique'].includes(eventType) && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Nom de l'entreprise</label>
                                        <input type="text" {...register('company')} placeholder="Votre entreprise..." className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" />
                                    </div>
                                )}

                                {/* 7. Contact */}
                                <div className="space-y-4">
                                    <input type="text" {...register('name', { required: true })} placeholder="Nom & Prénom" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" />
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input type="email" {...register('email', { required: true })} placeholder="Email" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" />
                                        <input type="tel" {...register('phone', { required: true })} placeholder="Téléphone" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white" />
                                    </div>
                                </div>

                                {/* 8. Notes */}
                                <textarea {...register('notes')} rows={2} placeholder="Précisions supplémentaires (thème, personnalisation...)" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 focus:bg-white/10 transition-all font-bold text-white resize-none" />

                                <div className="pt-4">
                                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 disabled:opacity-50">
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

export default PhotoboothPage;
