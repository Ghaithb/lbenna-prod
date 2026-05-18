import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Camera, Palette, Video, Award, Loader2, Heart, Briefcase, PlaySquare } from 'lucide-react';
import { serviceOffersService, ServiceOffer } from '../services/serviceOffers';
import { Link } from 'react-router-dom';

const ICON_MAP: Record<string, any> = {
  'Retouche': Palette,
  'Vidéo': Video,
  'Shooting': Award,
  'Mariage': Heart,
  'Corporate': Briefcase,
  'Drone': PlaySquare,
};

export default function ServicesCarousel() {
  const [services, setServices] = useState<ServiceOffer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceOffersService.getAll();
      setServices(data.filter((s: ServiceOffer) => s.isActive));
    } catch (err) {
      console.error('Error loading services', err);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
    setIsAutoPlaying(false);
  }, [services.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
    setIsAutoPlaying(false);
  }, [services.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying || services.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, services.length]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (services.length === 0) return null;

  return (
    <div className="relative w-full max-w-[85rem] mx-auto px-4 py-8">

      {/* Carousel Container */}
      <div className="relative overflow-hidden pt-4 pb-12 px-2 md:px-12">
        <div 
          className="flex transition-transform duration-1000 cubic-bezier(0.87, 0, 0.13, 1)"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {services.map((service) => {
            const Icon = ICON_MAP[Object.keys(ICON_MAP).find(k => service.title.includes(k)) || 'Tirage'] || Camera;

            return (
              <div key={service.id} className="min-w-full px-2 md:px-6">
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden group">
                  {/* Top Red Border */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-fire"></div>

                  <div className="p-8 md:p-14 md:py-16 flex flex-col lg:flex-row items-center gap-10">
                    
                    {/* Left Icon / Image */}
                    <div className="relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-gradient-fire flex items-center justify-center text-white shadow-2xl shadow-primary-500/30 overflow-hidden transform group-hover:scale-[1.03] transition-transform duration-500">
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover mix-blend-overlay opacity-80" />
                      ) : (
                        <Icon className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md" strokeWidth={1.5} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="text-3xl md:text-4xl font-black mb-4 text-gray-950 italic tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed mb-8 line-clamp-2 lg:line-clamp-none max-w-3xl">
                        {service.description}
                      </p>

                      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                        <span className="px-5 py-2.5 rounded-full bg-gray-950 text-white text-sm font-bold shadow-md tracking-wider">
                          {service.price ? `${service.price} TND` : 'Sur Mesure'}
                        </span>
                        {service.duration && (
                          <span className="px-5 py-2.5 rounded-full bg-gray-100 text-gray-600 text-sm font-bold border border-gray-200">
                            {service.duration} min
                          </span>
                        )}
                        {service.badge && (
                          <span className="px-5 py-2.5 rounded-full bg-primary-50 text-primary-600 text-sm font-bold border border-primary-100 uppercase tracking-widest">
                            {service.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0 mt-6 lg:mt-0">
                      <Link
                        to={(service.title.toLowerCase().includes('mariage') || service.title.toLowerCase().includes('vidéo') || service.title.toLowerCase().includes('film') || service.title.toLowerCase().includes('corporate') || service.title.toLowerCase().includes('drone')) ? '/production' : '/services'}
                        className="group/btn inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-gradient-fire text-white font-black uppercase tracking-widest text-sm shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-1 transition-all duration-300"
                      >
                        Réserver
                        <span className="bg-white/20 p-2 rounded-full group-hover/btn:bg-white/30 transition-colors">
                          <ChevronRight size={18} strokeWidth={3} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows (Absolute to Carousel) */}
        <button
          onClick={goToPrev}
          className="absolute left-0 lg:left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:scale-110 transition-all duration-300 z-10 hidden sm:flex"
        >
          <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-0 lg:right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:scale-110 transition-all duration-300 z-10 hidden sm:flex"
        >
          <ChevronRight className="w-7 h-7" strokeWidth={2.5} />
        </button>
      </div>

      {/* Custom Pagination */}
      <div className="flex flex-col items-center gap-6 mt-4">
        <div className="flex gap-2.5">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full h-2 ${
                index === currentIndex
                  ? 'w-10 bg-primary-500'
                  : 'w-2.5 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="text-gray-400 font-bold text-sm tracking-[0.2em] uppercase">
          {String(currentIndex + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
