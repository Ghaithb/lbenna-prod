import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Loader2, Star } from 'lucide-react';
import { categoriesService, Category } from '../services/categories';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop';
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');
const imgSrc = (url?: string) => (!url ? FALLBACK_IMAGE : url.startsWith('http') ? url : `${BASE_URL}${url}`);

function CategorySlideshow({ images, isActive }: { images: string[], isActive: boolean }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!isActive || images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 3000); // 3 seconds per image
        return () => clearInterval(interval);
    }, [isActive, images.length]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-950">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                        idx === current ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={img}
                        alt=""
                        className={`w-full h-full object-cover ${
                            isActive && idx === current ? 'animate-ken-burns' : ''
                        }`}
                    />
                </div>
            ))}
        </div>
    );
}

export default function UniversesCarousel() {
    const [universes, setUniverses] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoriesService.getAll();
                let mapped = data.map((c: Category) => {
                    const categoryImages = c.portfolioItems && c.portfolioItems.length > 0 
                        ? c.portfolioItems.map(i => imgSrc(i.coverUrl))
                        : [FALLBACK_IMAGE];

                    return {
                        id: c.id,
                        title: c.name,
                        subtitle: c.description || 'Service professionnel',
                        icon: Star,
                        color: c.color || 'bg-primary-500',
                        gradient: 'from-gray-950/90 via-gray-900/40',
                        images: categoryImages,
                        link: c.name.toLowerCase().includes('production') ? '/production' : '/services'
                    };
                });

                // Fallback for empty DB
                if (mapped.length === 0) {
                    mapped = [
                        { id: 'def-1', title: 'Production Studio', subtitle: 'Shooting & Captation 4K', icon: Star, color: 'bg-primary-500', gradient: 'from-gray-950/90 via-gray-900/40', images: [FALLBACK_IMAGE], link: '/production' },
                        { id: 'def-2', title: 'Reportage Mariage', subtitle: 'L\'excellence depuis 1988', icon: Star, color: 'bg-primary-600', gradient: 'from-gray-950/90 via-gray-900/40', images: [FALLBACK_IMAGE], link: '/services' },
                        { id: 'def-3', title: 'Borne Photobooth', subtitle: 'Location d\'animations fun', icon: Star, color: 'bg-secondary-500', gradient: 'from-gray-950/90 via-gray-900/40', images: [FALLBACK_IMAGE], link: '/photobooth' }
                    ];
                }
                setUniverses(mapped);
            } catch (err) {
                console.error('Failed to load universes', err);
                setUniverses([
                    { id: 'error-1', title: 'Production Studio', subtitle: 'Shooting & Captation 4K', icon: Star, color: 'bg-primary-500', gradient: 'from-gray-950/90 via-gray-900/40', images: [FALLBACK_IMAGE], link: '/production' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    // Auto-rotate
    useEffect(() => {
        if (universes.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % universes.length);
        }, 5000); // Rotate carousel every 5 seconds
        return () => clearInterval(interval);
    }, [universes.length]);

    const nextSlide = () => setActiveIndex((current: number) => (current + 1) % universes.length);
    const prevSlide = () => setActiveIndex((current: number) => (current - 1 + universes.length) % universes.length);

    if (loading) return (
        <div className="h-[600px] flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-6" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Exploration des Univers...</p>
        </div>
    );
    if (universes.length === 0) return null;

    return (
        <div
            className="relative w-full max-w-7xl mx-auto h-[700px] flex items-center justify-center perspective-1000"
        >
            {/* Premium Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-0 z-50 p-5 rounded-full bg-white/30 backdrop-blur-xl text-gray-950 hover:bg-white transition-all hover:scale-110 shadow-2xl hidden md:flex border border-white/50 group/nav"
            >
                <ChevronLeft size={32} className="group-hover/nav:-translate-x-1 transition-transform" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-0 z-50 p-5 rounded-full bg-white/30 backdrop-blur-xl text-gray-950 hover:bg-white transition-all hover:scale-110 shadow-2xl hidden md:flex border border-white/50 group/nav"
            >
                <ChevronRight size={32} className="group-hover/nav:translate-x-1 transition-transform" />
            </button>

            {/* Cards Container */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden py-16 px-4">
                {universes.map((universe, index) => {
                    const total = universes.length;
                    const diff = (index - activeIndex + total) % total;

                    let transformStyle = '';
                    let opacityStyle = '0';
                    let zIndex = 0;

                    if (diff === 0) {
                        transformStyle = 'scale(1) translateX(0) translateZ(50px)';
                        opacityStyle = '1';
                        zIndex = 30;
                    } else if (diff === 1 || diff === total - 1 && total > 2) {
                        // In a 3-card layout, 1 is Right, total-1 is Left
                        const isRight = diff === 1;
                        transformStyle = `scale(0.8) translateX(${isRight ? '65%' : '-65%'}) translateZ(-150px) rotateY(${isRight ? '-25deg' : '25deg'})`;
                        opacityStyle = '0.4';
                        zIndex = 20;
                    } else if (total > 3 && (diff === total - 1)) {
                        // Separate case for total > 3 if needed, but the logic above covers it
                         transformStyle = 'scale(0.8) translateX(-65%) translateZ(-150px) rotateY(25deg)';
                         opacityStyle = '0.4';
                         zIndex = 20;
                    } else {
                        transformStyle = 'scale(0.6) translateZ(-300px)';
                        opacityStyle = '0';
                        zIndex = 10;
                    }

                    // Special case for 3 items
                    if (total === 3) {
                        if (diff === 1) { // Next
                            transformStyle = 'scale(0.8) translateX(65%) translateZ(-150px) rotateY(-25deg)';
                            opacityStyle = '0.4';
                            zIndex = 20;
                        } else if (diff === 2) { // Prev
                            transformStyle = 'scale(0.8) translateX(-65%) translateZ(-150px) rotateY(25deg)';
                            opacityStyle = '0.4';
                            zIndex = 20;
                        }
                    }

                    return (
                        <Link
                            key={universe.id}
                            to={universe.link}
                            className={`absolute transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) cursor-pointer w-[320px] md:w-[480px] h-[550px] md:h-[620px] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] ${diff === 0 ? 'pointer-events-auto ring-2 ring-white/30' : 'pointer-events-none md:pointer-events-auto filter blur-[2px] opacity-40 hover:opacity-100 group'
                                }`}
                            style={{
                                transform: transformStyle,
                                zIndex: zIndex,
                                opacity: opacityStyle
                            }}
                        >
                            {/* Animated Slideshow with Ken Burns */}
                            <CategorySlideshow images={universe.images} isActive={diff === 0} />

                            {/* Premium Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10 opacity-90" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14 z-20 text-white">
                                <div className={`w-16 h-16 ${universe.color} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-2xl transform -rotate-12`}>
                                    <universe.icon size={32} className="text-white" />
                                </div>
                                <p className="text-primary-400 font-black text-xs uppercase tracking-[0.4em] mb-4 opacity-70">Univers L Benna</p>
                                <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-none">{universe.title}</h3>
                                <p className="text-white/70 font-medium text-lg leading-relaxed max-w-[90%]">{universe.subtitle}</p>

                                <div className={`mt-10 flex items-center gap-4 transition-all duration-700 ${diff === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <span className="h-0.5 w-12 bg-primary-500 rounded-full" />
                                    <span className="text-sm font-black uppercase tracking-[0.2em]">DÉCOUVRIR</span>
                                    <ArrowRight size={20} className="text-primary-500 animate-pulse" />
                                </div>
                            </div>

                            {/* Interaction Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                        </Link>
                    );
                })}
            </div>

            {/* Modern Indicators */}
            <div className="absolute bottom-4 flex gap-3">
                {universes.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-12 bg-primary-500 shadow-[0_0_15px_rgba(var(--primary-500-rgb),0.5)]' : 'w-2 bg-gray-600 hover:bg-gray-400'}`}
                    />
                ))}
            </div>
        </div>
    );
}
