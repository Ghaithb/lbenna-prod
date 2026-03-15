import { useState, useRef, useEffect } from 'react';
import {
    Check, ArrowRight, Sparkles, Play, Loader2, Heart, Star, ShieldCheck, Users
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { bookingsService } from '../services/bookings';
import { serviceOffersService } from '../services/serviceOffers';
import { categoriesService } from '../services/categories';
import * as LucideIcons from 'lucide-react';

export function ProductionPage() {
    const [activeTab, setActiveTab] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const formRef = useRef<HTMLDivElement>(null);
    const { register, handleSubmit, formState: { isSubmitting }, setValue, watch } = useForm();

    const watchPack = watch('serviceOfferId');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [cats, offers] = await Promise.all([
                    categoriesService.getAll(),
                    serviceOffersService.getAll()
                ]);

                // Filter categories that have service offers
                const mapped = cats.filter((c: any) => offers.some((o: any) => o.categoryId === c.id))
                    .map((c: any) => ({
                        id: c.id,
                        title: c.name,
                        description: c.description || 'Service professionnel par Lab El Benna.',
                        icon: (LucideIcons as any)[c.icon] || Heart,
                        color: c.color || 'bg-primary-50 text-primary-600',
                        imageUrl: offers.find((o: any) => o.categoryId === c.id)?.imageUrl || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
                        packs: offers.filter((o: any) => o.categoryId === c.id && o.isPack).map((o: any) => ({
                            id: o.id,
                            title: o.title,
                            price: o.price || 0,
                            features: o.description?.split('\n').filter((f: string) => f.trim()) || ['Prestation Pro']
                        })),
                        options: offers.filter((o: any) => o.categoryId === c.id && !o.isPack).map((o: any) => ({
                            id: o.id,
                            title: o.title,
                            price: o.price || 0,
                            description: o.description
                        })),
                        portfolio: []
                    }));

                setCategories(mapped);
                if (mapped.length > 0) {
                    setActiveTab(mapped[0].id);
                    if (mapped[0].packs.length > 0) {
                        setValue('serviceOfferId', mapped[0].packs[0].id);
                    }
                }
            } catch (err) {
                console.error('Failed to load dynamic production data', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [setValue]);

    const activeCategory = categories.find(c => c.id === activeTab);

    useEffect(() => {
        if (activeCategory && activeCategory.packs.length > 0) {
            setValue('serviceOfferId', activeCategory.packs[0].id);
            setSelectedOptions([]);
        }
    }, [activeTab, activeCategory, setValue]);

    const toggleOption = (optionId: string) => {
        setSelectedOptions(prev =>
            prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
        );
    };

    const calculateTotal = () => {
        if (!activeCategory) return 0;
        const pack = activeCategory.packs.find((p: any) => p.id === watchPack);
        const packPrice = typeof pack?.price === 'number' ? pack.price : 0;

        const optionsPrice = selectedOptions.reduce((acc, optId) => {
            const opt = activeCategory.options.find((o: any) => o.id === optId);
            return acc + (typeof opt?.price === 'number' ? opt.price : 0);
        }, 0);

        return packPrice + optionsPrice;
    };

    const scrollToForm = (packId?: string) => {
        if (packId) {
            setValue('serviceOfferId', packId);
        }
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const onSubmit = async (data: any) => {
        try {
            const pack = activeCategory?.packs.find((p: any) => p.id === data.serviceOfferId);
            const opts = selectedOptions.map(id => activeCategory?.options.find((o: any) => o.id === id)?.title).join(', ');

            await bookingsService.create({
                serviceOfferId: data.serviceOfferId,
                bookingDate: new Date(data.date).toISOString(),
                customerName: data.name,
                customerEmail: data.email,
                customerPhone: data.phone,
                notes: `Nature: ${data.eventType}. Pack: ${pack?.title}. Options: ${opts || 'Aucune'}. Total: ${calculateTotal()} TND. Projet: ${data.notes || ''}`
            });
            setSuccess(true);
        } catch (err) {
            console.error(err);
            alert('Une erreur est survenue.');
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100">
                        <Check size={48} strokeWidth={3} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-gray-950">Projet Envoyé !</h2>
                        <p className="text-gray-500 font-medium font-outfit">Votre demande de production est entre les mains de nos experts. Nous vous contacterons sous 24h.</p>
                    </div>
                    <Link to="/services" className="w-full py-4 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 inline-block text-center text-sm font-black">
                        Découvrir d'autres services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-gray-950 text-white">
                <div className="absolute inset-0 grayscale opacity-20 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950 to-gray-950" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {loading ? (
                        <div className="flex flex-col items-center py-20">
                            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Initialisation du studio...</p>
                        </div>
                    ) : (
                        <>
                            <SectionHeader
                                title="L'Art de la Production"
                                subtitle="Du reportage de mariage à la communication d'entreprise, nous donnons vie à vos projets les plus ambitieux."
                                badge="Studio Lab El Benna"
                                icon={Sparkles}
                                dark
                            />

                            <div className="mt-16 flex justify-center gap-4 flex-wrap">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(cat.id)}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl hover:-translate-y-1 ${activeTab === cat.id
                                            ? 'bg-primary-600 text-white shadow-primary-500/30'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        <cat.icon size={18} />
                                        {cat.title}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="mt-12">
                        <button
                            onClick={() => scrollToForm()}
                            className="bg-white text-gray-950 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 mx-auto group"
                        >
                            Démarrer ma réservation <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                    {!loading && activeCategory && (
                        <div className="animate-in slide-in-from-left duration-500">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${activeCategory.color}`}>
                                <activeCategory.icon size={32} />
                            </div>
                            <h2 className="text-5xl font-black text-gray-950 mb-6 leading-tight tracking-tighter">{activeCategory.title}</h2>
                            <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl relative group">
                                <img src={activeCategory.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={activeCategory.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent" />
                            </div>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12 font-outfit">
                                {activeCategory.description}
                            </p>

                            <div className="grid gap-6">
                                {activeCategory.packs.map((pack: any) => (
                                    <div key={pack.id} className={`p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden relative group cursor-pointer ${watchPack === pack.id ? 'bg-white border-primary-500 shadow-2xl' : 'bg-gray-50 border-gray-100'}`} onClick={() => scrollToForm(pack.id)}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/20 rounded-full -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors"></div>
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <h4 className="text-2xl font-black text-gray-950 tracking-tight">{pack.title}</h4>
                                            <span className="text-2xl font-black text-primary-600">
                                                {pack.price > 0 ? `${pack.price} TND` : 'Sur Devis'}
                                            </span>
                                        </div>
                                        <ul className="space-y-3 relative z-10 mb-8">
                                            {pack.features.map((f: string, i: number) => (
                                                <li key={i} className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                                                    <Check size={16} className="text-green-500" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center transition-all relative z-10 ${watchPack === pack.id ? 'bg-primary-600 text-white' : 'bg-gray-950 text-white'}`}>
                                            {watchPack === pack.id ? 'Sélectionné' : 'Choisir ce pack'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative" id="reservation-form">
                    <div ref={formRef} className="sticky top-32 bg-gray-900 border-2 border-primary-500/30 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h3 className="text-3xl font-black mb-2 tracking-tight">Briefez votre projet</h3>
                                <p className="text-gray-400 font-medium font-outfit">Personnalisez votre pack avec nos options.</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Options Additionnelles</label>
                                    <div className="grid gap-3">
                                        {activeCategory?.options?.map((opt: any) => (
                                            <div
                                                key={opt.id}
                                                onClick={() => toggleOption(opt.id)}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedOptions.includes(opt.id) ? 'bg-primary-500/10 border-primary-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${selectedOptions.includes(opt.id) ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/20'}`}>
                                                        {selectedOptions.includes(opt.id) && <Check size={14} strokeWidth={4} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{opt.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{opt.description}</p>
                                                    </div>
                                                </div>
                                                <span className="font-black text-primary-400 text-xs">+{opt.price} TND</span>
                                            </div>
                                        ))}
                                        {activeCategory?.options?.length === 0 && (
                                            <p className="text-gray-500 text-xs italic px-2">Aucune option disponible pour cette catégorie.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Date souhaitée</label>
                                        <input type="date" {...register('date', { required: true })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary-500 focus:bg-white/10 transition-all font-bold text-white font-outfit" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Pack</label>
                                        <select {...register('serviceOfferId')} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary-500 focus:bg-white/10 transition-all font-bold text-white font-outfit">
                                            {activeCategory?.packs?.map((p: any) => (
                                                <option key={p.id} value={p.id} className="text-gray-900">{p.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <input type="text" {...register('name', { required: true })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary-500 focus:bg-white/10 transition-all font-bold text-white font-outfit" placeholder="Nom & Prénom" />
                                    <select {...register('eventType')} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary-500 focus:bg-white/10 transition-all font-bold text-white font-outfit">
                                        <option value="Mariage" className="text-gray-900">Mariage / Fête</option>
                                        <option value="Corporate" className="text-gray-900">Corporate / Event</option>
                                        <option value="Autre" className="text-gray-900">Autre</option>
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <input type="email" {...register('email', { required: true })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary-500 focus:bg-white/10 transition-all font-bold text-white font-outfit" placeholder="Email" />
                                    <input type="tel" {...register('phone', { required: true })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary-500 focus:bg-white/10 transition-all font-bold text-white font-outfit" placeholder="Téléphone" />
                                </div>

                                <textarea {...register('notes')} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary-500 focus:bg-white/10 transition-all font-bold text-white resize-none font-outfit" rows={3} placeholder="Parlez-nous de votre projet..." />

                                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Estimation Totale</p>
                                        <p className="text-3xl font-black text-primary-500">{calculateTotal()} TND</p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <>Réserver <ArrowRight size={20} /></>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-primary-600 font-black tracking-widest uppercase text-[10px]">Excellence • Studio Lab El Benna</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-16 tracking-tighter">Pourquoi nous choisir ?</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: <Star className="text-yellow-500" />, title: "Regard Expert", text: "40 ans d'expertise dans l'image." },
                            { icon: <ShieldCheck className="text-green-500" />, title: "Matériel Pro", text: "Capteurs 100MP et Drone 5.4K." },
                            { icon: <Users className="text-blue-500" />, title: "Équipe Dédiée", text: "Un interlocuteur unique pour vous." },
                            { icon: <Check className="text-purple-500" />, title: "Livraison Rapide", text: "Qualité et rapidité garanties." },
                        ].map((v, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group">
                                <div className="p-4 bg-gray-50 rounded-2xl w-fit mb-6 mx-auto group-hover:bg-primary-50 transition-colors">{v.icon}</div>
                                <h4 className="font-black text-gray-950 mb-3 text-lg tracking-tight">{v.title}</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed font-outfit">{v.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProductionPage;
