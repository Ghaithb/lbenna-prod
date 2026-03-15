import { ArrowRight, Camera, Sparkles, Layers, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { serviceOffersService, ServiceOffer } from '../services/serviceOffers';

export default function VisualShowcase() {
    const [studioOffer, setStudioOffer] = useState<ServiceOffer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const data = await serviceOffersService.getAll();
                // Find a featured studio offer or "Book Photo"
                const featured = data.find((s: ServiceOffer) =>
                    s.isActive && (s.title.toLowerCase().includes('studio') || s.title.toLowerCase().includes('book'))
                );
                setStudioOffer(featured || null);
            } catch (err) {
                console.error('Failed to load featured showcase', err);
            } finally {
                setLoading(false);
            }
        };
        loadFeatured();
    }, []);

    const defaultFeatures = [
        "Éclairage professionnel Profoto",
        "Direction de modèle experte",
        "Retouche haute couture incluse",
        "Livraison en 24h sur galerie privée"
    ];

    const displayFeatures = studioOffer?.description?.split('\n').filter(f => f.trim()).slice(0, 4) || defaultFeatures;

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Préparation du Showcase...</p>
            </div>
        );
    }

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Production Événementielle */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="relative order-2 lg:order-1">
                        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
                            <img
                                src="https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=1000&auto=format&fit=crop"
                                alt="Production Événementielle Mariage"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 animate-blob"></div>
                        <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl hidden md:block z-20">
                            <div className="flex items-center gap-3 mb-2">
                                <Layers className="text-primary-600 w-6 h-6" />
                                <span className="font-bold text-gray-900">Cinéma & Storytelling</span>
                            </div>
                            <p className="text-sm text-gray-500 max-w-[180px]">Captation 4K, Drone et Montage narratif.</p>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-primary-600 font-black tracking-widest uppercase text-sm">L'Excellence Événementielle</span>
                            <span className="h-px w-8 bg-primary-100"></span>
                            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Depuis 1988</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
                            Immortaliser l'instant, sublimer l'émotion.
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                            De la magie d'un mariage à l'impact d'un événement corporate, nous déployons une expertise technique et artistique unique pour créer des souvenirs inoubliables.
                        </p>
                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl font-black text-gray-900">1000+</span>
                                <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Mariages couverts</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl font-black text-gray-900">4K</span>
                                <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Qualité Cinéma</span>
                            </div>
                        </div>
                        <Link
                            to="/production"
                            className="group inline-flex items-center gap-4 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all shadow-xl hover:shadow-primary-500/20"
                        >
                            Découvrir nos Reportages <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* L'Expérience Studio */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-primary-600 font-black tracking-widest uppercase text-sm mb-4 block">L'Instant Studio</span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
                            Capturer l'invisible, raconter l'émotion.
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                            Mariages, shootings corporate ou portraits de famille : notre équipe d'experts vous guide pour créer des images qui vous ressemblent dans un cadre professionnel et bienveillant.
                        </p>
                        <ul className="space-y-4 mb-10">
                            {displayFeatures.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-green-600" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link
                            to="/services"
                            className="group inline-flex items-center gap-4 px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all shadow-xl hover:shadow-gray-900/20"
                        >
                            Réserver une séance <Camera className="group-hover:scale-110 transition-transform" />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="aspect-[16/10] lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
                            <img
                                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4"
                                alt="Studio Shooting Session"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                        <div className="absolute top-0 -left-10 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 animate-blob" style={{ animationDelay: '2s' }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
