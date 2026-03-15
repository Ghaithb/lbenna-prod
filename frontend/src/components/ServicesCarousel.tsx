import { useState, useEffect } from 'react';
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

const COLOR_MAP: string[] = [
  "from-primary-500 to-primary-600",
  "from-secondary-500 to-secondary-600",
  "from-accent-500 to-accent-600",
  "from-primary-600 to-secondary-500",
  "from-secondary-600 to-primary-500",
  "from-accent-600 to-primary-500",
];

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

  useEffect(() => {
    if (!isAutoPlaying || services.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, services.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (services.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-12">
      {/* Titre de section */}
      <div className="text-center mb-12 animate-fade-in-down">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gray-900">
            Nos Univers de Services
          </span>
        </h2>
        <p className="text-gray-600 text-lg">
          Des solutions professionnelles pour tous vos besoins photo et vidéo
        </p>
      </div>

      {/* Carrousel */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {services.map((service, index) => {
            const Icon = ICON_MAP[Object.keys(ICON_MAP).find(k => service.title.includes(k)) || 'Tirage'] || Camera;
            const color = COLOR_MAP[index % COLOR_MAP.length];

            return (
              <div key={(service as any).id} className="min-w-full px-4">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
                  <div className={`h-2 bg-gradient-to-r ${color}`}></div>

                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Icône / Image */}
                      <div className={`flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg animate-float overflow-hidden`}>
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                        ) : (
                          <Icon className="w-12 h-12" />
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-3xl font-black mb-4 text-gray-950 italic">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-lg mb-6 line-clamp-2">
                          {service.description}
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                          <span className={`px-4 py-2 rounded-full bg-gradient-to-r ${color} text-white text-sm font-semibold shadow-md`}>
                            {service.price ? `${service.price} TND` : 'Sur Mesure'}
                          </span>
                          {service.duration && (
                            <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                              {service.duration} min
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex-shrink-0">
                        <Link
                          to={(service.title.toLowerCase().includes('mariage') || service.title.toLowerCase().includes('vidéo') || service.title.toLowerCase().includes('film') || service.title.toLowerCase().includes('corporate') || service.title.toLowerCase().includes('drone')) ? '/production' : '/services'}
                          className={`px-8 py-4 rounded-xl bg-gradient-to-r ${color} text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-block`}
                        >
                          Réserver
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Boutons de navigation */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-gradient-fire hover:text-white transition-all duration-300 z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-gradient-fire hover:text-white transition-all duration-300 z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicateurs */}
      <div className="flex justify-center gap-3 mt-8">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${index === currentIndex
              ? 'w-12 h-3 bg-gradient-fire'
              : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
          />
        ))}
      </div>

      {/* Compteur */}
      <div className="text-center mt-4 text-gray-500 font-semibold">
        {currentIndex + 1} / {services.length}
      </div>
    </div>
  );
}
