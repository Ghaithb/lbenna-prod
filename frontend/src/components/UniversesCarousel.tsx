import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Loader2, Star } from 'lucide-react';
import { categoriesService, Category } from '../services/categories';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop';

export default function UniversesCarousel() {
    const [universes, setUniverses] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoriesService.getAll();
                let mapped = data.map((c: Category) => ({
                    id: c.id,
                    title: c.name,
                    subtitle: c.description || 'Service professionnel',
                    icon: Star,
                    color: c.color || 'bg-primary-500',
                    gradient: 'from-gray-950/90 via-gray-900/40',
                    image: FALLBACK_IMAGE,
                    link: c.name.toLowerCase().includes('production') ? '/production' : '/services'
                }));

                // Fallback for empty DB
                if (mapped.length === 0) {
                    mapped = [
                        { id: 'def-1', title: 'Production Studio', subtitle: 'Shooting & Captation 4K', icon: Star, color: 'bg-primary-500', gradient: 'from-gray-950/90 via-gray-900/40', image: FALLBACK_IMAGE, link: '/production' },
                        { id: 'def-2', title: 'Reportage Mariage', subtitle: 'L\'excellence depuis 1988', icon: Star, color: 'bg-primary-600', gradient: 'from-gray-950/90 via-gray-900/40', image: FALLBACK_IMAGE, link: '/services' },
                        { id: 'def-3', title: 'Borne Photobooth', subtitle: 'Location d\'animations fun', icon: Star, color: 'bg-secondary-500', gradient: 'from-gray-950/90 via-gray-900/40', image: FALLBACK_IMAGE, link: '/photobooth' }
                    ];
                }
                setUniverses(mapped);
            } catch (err) {
                console.error('Failed to load universes', err);
                // Hardcoded fallback on error
                setUniverses([
                    { id: 'error-1', title: 'Production Studio', subtitle: 'Shooting & Captation 4K', icon: Star, color: 'bg-primary-500', gradient: 'from-gray-950/90 via-gray-900/40', image: FALLBACK_IMAGE, link: '/production' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    // Auto-rotate
    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % universes.length);
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(interval);
    }, [isHovered]);

    const nextSlide = () => setActiveIndex((current: number) => (current + 1) % universes.length);
    const prevSlide = () => setActiveIndex((current: number) => (current - 1 + universes.length) % universes.length);

    if (loading) return (
        <div className="h-[500px] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accès aux Univers...</p>
        </div>
    );
    if (universes.length === 0) return null;

    return (
        <div
            className="relative w-full max-w-5xl mx-auto h-[500px] flex items-center justify-center perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Navigation Buttons (Hidden on mobile usually, distinct style) */}
            <button
                onClick={prevSlide}
                className="absolute left-4 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md text-gray-800 hover:bg-white transition-all hover:scale-110 shadow-lg hidden md:flex"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md text-gray-800 hover:bg-white transition-all hover:scale-110 shadow-lg hidden md:flex"
            >
                <ChevronRight size={24} />
            </button>

            {/* Cards Container */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden py-10">
                {universes.map((universe, index) => {
                    // Calculate relative position based on activeIndex

                    let transformStyle = '';
                    let opacityStyle = '0'; // Renamed to opacityStyle to match usage intent and avoid TS error
                    let zIndex = 0;

                    // Normalize index relative to active (circular distance)
                    const total = universes.length;
                    // Distance: 0 is active, 1 is next, -1 (or total-1) is prev
                    const diff = (index - activeIndex + total) % total;

                    if (diff === 0) {
                        // Active Center
                        transformStyle = 'scale(1) translateX(0) translateZ(0)';
                        opacityStyle = '1';
                        zIndex = 30;
                    } else if (diff === 1 || diff === -3) {
                        // Next
                        transformStyle = 'scale(0.85) translateX(70%) translateZ(-100px) rotateY(-10deg)';
                        opacityStyle = '0.6';
                        zIndex = 20;
                    } else if (diff === total - 1 || diff === 3) {
                        // Prev
                        transformStyle = 'scale(0.85) translateX(-70%) translateZ(-100px) rotateY(10deg)';
                        opacityStyle = '0.6';
                        zIndex = 20;
                    } else {
                        // Far behind (for 4 items, the 4th one is directly behind or very small)
                        transformStyle = 'scale(0.7) translateZ(-200px)';
                        opacityStyle = '0';
                        zIndex = 10;
                    }

                    return (
                        <Link
                            key={universe.id}
                            to={universe.link}
                            className={`absolute transition-all duration-700 ease-in-out cursor-pointer w-[300px] md:w-[380px] h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl ${diff === 0 ? 'pointer-events-auto ring-4 ring-white/50' : 'pointer-events-none md:pointer-events-auto blur-[1px] hover:blur-0'
                                }`}
                            style={{
                                transform: transformStyle,
                                zIndex: zIndex,
                                opacity: diff === 2 ? 0 : opacityStyle
                            }}
                        >
                            {/* Card Content (Same as previous design basically) */}
                            <img
                                src={universe.image}
                                alt={universe.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${universe.gradient} to-transparent z-10`} />

                            <div className="absolute inset-0 flex flex-col justify-end p-8 z-20 text-white">
                                <div className={`w-14 h-14 ${universe.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                                    <universe.icon size={28} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-black mb-2 tracking-tight">{universe.title}</h3>
                                <p className="text-white/80 font-medium text-lg leading-snug">{universe.subtitle}</p>

                                <div className={`mt-6 inline-flex items-center text-sm font-bold uppercase tracking-wider transition-all duration-300 ${diff === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    Explorer <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Mobile Indincators */}
            <div className="absolute bottom-4 flex gap-2 md:hidden">
                {universes.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
}
