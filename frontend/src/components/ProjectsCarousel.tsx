import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Image as ImageIcon, Calendar, MapPin } from 'lucide-react';
import { portfolioService, PortfolioItem } from '../services/portfolio';

const fallbackProjects = [
  {
    id: '1',
    type: 'photo',
    title: "Mariage Sarah & Ahmed",
    category: "Mariage",
    date: "15 Juin 2024",
    location: "Tunis, Tunisie",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    description: "Une journée magique capturée avec émotion et professionnalisme.",
  },
  {
    id: '2',
    type: 'video',
    title: "Campagne Publicitaire TechCorp",
    category: "Corporate",
    date: "3 Mai 2024",
    location: "Sousse, Tunisie",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
    videoUrl: "https://example.com/video1.mp4",
    description: "Vidéo promotionnelle dynamique pour le lancement d'un nouveau produit.",
  },
];

export default function ProjectsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<Array<any>>(fallbackProjects);

  useEffect(() => {
    let mounted = true;
    portfolioService.getAll().then((data: PortfolioItem[]) => {
      if (!mounted) return;
      if (data && Array.isArray(data) && data.length > 0) {

        const validItems = data.filter(item => item.isActive);

        if (validItems.length > 0) {
          setProjects(validItems.map((p: PortfolioItem) => ({
            id: p.id,
            type: p.videoUrl ? 'video' : 'photo',
            title: p.title,
            category: (p as any).cat?.name || p.category || 'Film',
            date: p.eventDate ? new Date(p.eventDate).toLocaleDateString('fr-FR') : '',
            location: 'Tunisie', // Location not in model, default or optional
            image: p.coverUrl?.startsWith('http') ? p.coverUrl : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${p.coverUrl}`,
            description: p.description || '',
            galleryUrls: p.galleryUrls,
            videoUrl: p.videoUrl
          })));
        }
      }
    }).catch((err) => {
      console.error("Failed to load portfolio items", err);
      // keep fallback if error or empty
    });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-12">
      {/* Titre de section */}
      <div className="text-center mb-12 animate-fade-in-down">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gray-900">
            Nos Réalisations
          </span>
        </h2>
        <p className="text-gray-600 text-lg">
          Découvrez nos projets photo et vidéo réalisés avec passion
        </p>
      </div>

      {/* Carrousel principal */}
      <div className="relative overflow-hidden rounded-3xl mb-8">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {projects.map((project) => (
            <div key={project.id} className="min-w-full">
              <div className="relative h-[500px] md:h-[600px] group">
                {/* Image de fond */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Badge type */}
                <div className="absolute top-6 left-6">
                  <div className={`px-4 py-2 rounded-full backdrop-blur-md ${project.type === 'video'
                    ? 'bg-secondary-500/90'
                    : 'bg-primary-500/90'
                    } text-white font-semibold flex items-center gap-2 shadow-lg`}>
                    {project.type === 'video' ? (
                      <>
                        <Play className="w-4 h-4" />
                        Vidéo
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        Photo
                      </>
                    )}
                  </div>
                </div>

                {/* Contenu */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 transform transition-transform duration-300 group-hover:translate-y-0">
                  <div className="max-w-3xl">
                    {/* Catégorie */}
                    <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold">
                      {typeof project.category === 'object' ? project.category.name : project.category}
                    </span>

                    {/* Titre */}
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/90 text-lg mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      {project.description}
                    </p>

                    {/* Métadonnées */}
                    <div className="flex flex-wrap gap-6 text-white/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{project.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span>{project.location}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                      {project.slug ? (
                        <a href={`/projects/${project.slug}`} className="px-8 py-4 rounded-xl bg-gradient-fire text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                          Voir le projet complet
                        </a>
                      ) : (
                        <button className="px-8 py-4 rounded-xl bg-gradient-fire text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                          Voir le projet complet
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bouton play pour vidéos */}
                {project.type === 'video' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <Play className="w-10 h-10 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Boutons de navigation */}
        <button
          onClick={goToPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Miniatures */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {projects.map((project, index) => (
          <button
            key={project.id}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${index === currentIndex
              ? 'ring-4 ring-primary-500 scale-105'
              : 'opacity-60 hover:opacity-100'
              }`}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-fire transition-opacity duration-300 ${index === currentIndex ? 'opacity-20' : 'opacity-0'
              }`}></div>

            {/* Badge type */}
            <div className="absolute top-2 right-2">
              {project.type === 'video' ? (
                <Play className="w-4 h-4 text-white drop-shadow-lg" />
              ) : (
                <ImageIcon className="w-4 h-4 text-white drop-shadow-lg" />
              )}
            </div>

            {/* Titre au survol */}
            {hoveredIndex === index && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-2">
                <p className="text-white text-xs font-semibold text-center line-clamp-2">
                  {project.title}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Indicateurs */}
      <div className="flex justify-center gap-2 mt-8">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${index === currentIndex
              ? 'w-8 h-2 bg-gradient-fire'
              : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
