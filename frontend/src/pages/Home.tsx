
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, Shield, Zap, Check, ArrowRight,
  Briefcase, Heart, Users, Award, Sparkles, ShieldCheck,
  CalendarDays, ExternalLink, Image
} from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';
import ServicesCarousel from '../components/ServicesCarousel';
import ProjectsCarousel from '../components/ProjectsCarousel';
import ReviewSection from '../components/ReviewSection';
import { categoriesService, Category } from '../services/categories';

import UniversesCarousel from '../components/UniversesCarousel';
import VisualShowcase from '../components/VisualShowcase';
import { TypewriterTitle } from '../components/TypewriterTitle';
import PromoCarousel from '../components/PromoCarousel';
import { pagesService, Page } from '../services/pages';
import { portfolioService, PortfolioItem } from '../services/portfolio';

const IconMap: any = {
  Camera, Shield, Zap, Check, Briefcase, Heart, Users, Award, Sparkles, ShieldCheck
};

function DynamicIcon({ name, className }: { name: string, className?: string }) {
  const Icon = IconMap[name] || Camera;
  return <Icon className={className} />;
}

export default function Home() {
  const [page, setPage] = useState<Page | null>(null);
  const [universesCount, setUniversesCount] = useState(0);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    pagesService.getBySlug('home').then(setPage).catch(console.error);
    categoriesService.getAll().then((cats: Category[]) => setUniversesCount(cats.length)).catch(console.error);
    portfolioService.getAll()
      .then(items => setPortfolioItems(items.filter(i => i.isActive).slice(0, 8)))
      .catch(console.error);
  }, []);

  const content = page?.content || {};

  return (
    <div className="min-h-screen bg-white">
      {/* 0. Promo Bar */}
      <PromoCarousel />

      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-30">
            <div className="absolute top-0 -left-24 w-[40rem] h-[40rem] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
            <div className="absolute top-0 -right-24 w-[35rem] h-[35rem] bg-blue-100 rounded-full mix-blend-multiply filter blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-32 left-20 w-[45rem] h-[45rem] bg-purple-100 rounded-full mix-blend-multiply filter blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12 relative">
            <div className="flex justify-center mb-8 relative z-10">
              <AnimatedLogo />
            </div>

            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary-500 text-white mb-8 shadow-2xl animate-fade-in ring-4 ring-primary-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase">
                {content.hero?.badge || "Production Audiovisuelle & Événementielle • Depuis 1988"}
              </span>
            </div>

            <h1 className="text-6xl md:text-[9rem] font-black text-gray-950 mb-8 tracking-tighter leading-[0.85] flex flex-col items-center">
              <span className="opacity-90 drop-shadow-lg">{content.hero?.title_fixed || "L'Art de"}</span>
              <TypewriterTitle words={content.hero?.title_words || ["Capturer", "Sublimer", "Raconter", "Célébrer", "Éterniser"]} />
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              {content.hero?.description ? (
                <span>{content.hero.description}</span>
              ) : (
                <>Depuis 1988, <strong>L Benna Production</strong> écrit votre histoire par l'image. <br className="hidden md:block" /> Mariages d'exception, films corporate et studio de création.</>
              )}
            </p>

            {/* CTA Hero Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                to="/production"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-primary-500/40 transform hover:scale-105 transition-all duration-300"
              >
                <CalendarDays size={22} />
                Réserver un Projet
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 hover:border-primary-400 text-gray-800 hover:text-primary-600 rounded-2xl font-bold text-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                Catalogue Services
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {universesCount > 0 && (
            <div className="relative z-20 mt-12 backdrop-blur-sm bg-white/30 p-2 rounded-[3.5rem] border border-white/50 shadow-2xl">
              <UniversesCarousel />
            </div>
          )}
        </div>
      </section>

      {/* 2. Galerie / réalisations */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Notre Signature</h2>
              <p className="text-xl text-gray-400">Découvrez les derniers projets signés L Benna Production</p>
            </div>
            <Link to="/portfolio" className="text-blue-400 font-bold border-b-2 border-blue-400/30 hover:border-blue-400 transition pb-1 flex items-center gap-2">
              Explorer nos œuvres <ArrowRight size={20} />
            </Link>
          </div>
          <ProjectsCarousel />
        </div>
      </section>

      {/* 3. Services Overview avec CTA Réserver + Voir tous les services */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Expertise Studio & Terrain</span>
          <h2 className="text-3xl font-bold mb-4 mt-2">Choisissez votre Expérience</h2>
          <p className="text-gray-500">Des prestations haut de gamme, adaptées à votre vision.</p>
        </div>
        <ServicesCarousel />

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 px-4">
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white rounded-2xl font-bold text-base shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <ExternalLink size={20} />
            Voir d'autres services
          </Link>
          <Link
            to="/production"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-base shadow-xl hover:shadow-primary-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <CalendarDays size={20} />
            Réserver maintenant
          </Link>
        </div>
      </section>

      {/* 4. Galerie Photo Portfolio */}
      {portfolioItems.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
              <div>
                <span className="text-primary-500 font-bold tracking-wider uppercase text-sm">Portfolio</span>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2 tracking-tighter">Nos Réalisations</h2>
                <p className="text-gray-500 mt-2">Chaque image raconte une histoire unique</p>
              </div>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Image size={18} />
                Voir toute la galerie
              </Link>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {portfolioItems.map((item, idx) => (
                <Link
                  key={item.id}
                  to={`/portfolio`}
                  className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 ${
                    idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  style={{ aspectRatio: idx === 0 ? '1/1' : '4/3' }}
                >
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Camera size={40} className="text-gray-400" />
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">{item.title}</p>
                      {item.categoryObject && (
                        <span className="text-white/70 text-xs">{item.categoryObject.name}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 hover:bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-primary-500/40 transform hover:scale-105 transition-all duration-300"
              >
                Explorer tout le portfolio <ArrowRight size={22} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. Vous êtes ? (Personas) */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Pour qui ?
            </h2>
            <p className="text-xl text-gray-600">Un parcours adapté à vos besoins spécifiques</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {(content.personas || [
              {
                title: "Un particulier",
                description: "Capturez vos moments précieux, réservez un photographe pour vos événements familiaux.",
                cta: "Voir les services",
                link: "/services",
                icon_name: "Heart"
              },
              {
                title: "Une entreprise",
                description: "Communication visuelle, couverture d'événements pro ou packshots produits de haute qualité.",
                cta: "Découvrir l'offre Pro",
                link: "/services",
                icon_name: "Briefcase"
              }
            ]).map((persona: any, idx: number) => (
              <PersonaCard
                key={idx}
                icon={<DynamicIcon name={persona.icon_name} className="w-10 h-10" />}
                title={persona.title}
                description={persona.description}
                cta={persona.cta}
                link={persona.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Showcase Visuel */}
      <VisualShowcase />

      {/* 7. Pourquoi L Benna Production ? */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi nous faire confiance ?</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {(content.features || [
              { icon_name: "Shield", title: "Qualité Certifiée", description: "Savoir-faire artisanal pour des résultats d'exception." },
              { icon_name: "Zap", title: "Rapidité", description: "Production et livraison optimisées pour vos projets pressants." },
              { icon_name: "Users", title: "Équipe d'Experts", description: "Des photographes et techniciens passionnés à votre écoute." },
              { icon_name: "Check", title: "Satisfaction Garantie", description: "Votre vision, sublimée par notre expertise." }
            ]).map((feature: any, idx: number) => (
              <FeatureCard
                key={idx}
                icon={<DynamicIcon name={feature.icon_name} className="w-10 h-10 text-blue-500" />}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Avis clients */}
      <section className="py-24 bg-gray-50">
        <ReviewSection />
      </section>

      {/* 9. CTA final */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Camera size={400} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {content.cta_final?.title || "Donnez vie à vos projets dès aujourd'hui"}
          </h2>
          <p className="text-xl mb-12 text-white/90">
            {content.cta_final?.description || "Expertise studio et production audiovisuelle d'exception."}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/production"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <CalendarDays size={22} />
              Démarrer un projet
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition"
            >
              Catalogue Services
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PersonaCard({ icon, title, description, cta, link }: any) {
  return (
    <div className="group bg-white p-12 rounded-[3.5rem] shadow-sm hover:shadow-3xl border border-gray-100 transition-all duration-700 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-3 h-0 group-hover:h-full bg-blue-600 transition-all duration-700"></div>
      <div className="relative text-blue-600 mb-10 bg-blue-50 p-10 rounded-[2.5rem] group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 transform group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg group-hover:shadow-blue-500/50">
        {icon}
      </div>
      <h3 className="text-4xl font-black mb-6 text-gray-900 tracking-tighter text-center">{title}</h3>
      <p className="text-gray-500 mb-12 leading-relaxed text-lg text-center font-medium">
        {description}
      </p>
      <Link
        to={link}
        className="mt-auto inline-flex items-center px-10 py-4 bg-gray-50 group-hover:bg-gray-900 group-hover:text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-sm group-hover:shadow-xl"
      >
        {cta} <ArrowRight size={18} className="ml-4 group-hover:translate-x-2 transition-transform" />
      </Link>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
