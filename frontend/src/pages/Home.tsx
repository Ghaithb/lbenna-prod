
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, Shield, Zap, Check, ArrowRight,
  Briefcase, Heart, Users, Award, Sparkles, ShieldCheck,
  CalendarDays, Image
} from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';
import ServicesCarousel from '../components/ServicesCarousel';
import ReviewSection from '../components/ReviewSection';
import { categoriesService, Category } from '../services/categories';
import UniversesCarousel from '../components/UniversesCarousel';
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
      {/* ── 0. Barre de promotions ── */}
      <PromoCarousel />

      {/* ── 1. HERO : Identité + Univers ── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-white border-b border-gray-100">
        {/* Background photographique pro et attrayant */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Overlay dégradé pour garder le texte ultra lisible */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/95 z-10 backdrop-blur-[2px]"></div>
          
          {/* Photos de fond */}
          <div className="absolute inset-0 opacity-40 z-0">
            {/* Top Left */}
            <div className="absolute -top-[10%] -left-[5%] w-[30rem] h-[25rem] rounded-[3rem] overflow-hidden -rotate-12 transform scale-95 opacity-80 blur-[2px]">
              <img src={portfolioItems[0]?.coverUrl || "https://images.unsplash.com/photo-1603574670812-d2456088add4?q=80&w=1200&auto=format&fit=crop"} alt="Production" className="w-full h-full object-cover" />
            </div>
            {/* Top Right */}
            <div className="absolute top-[5%] -right-[15%] w-[35rem] h-[22rem] rounded-[3rem] overflow-hidden rotate-12 transform scale-110 opacity-70 blur-[1px]">
              <img src={portfolioItems[1]?.coverUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"} alt="Studio" className="w-full h-full object-cover" />
            </div>
            {/* Bottom Left */}
            <div className="absolute -bottom-[20%] left-[5%] w-[40rem] h-[28rem] rounded-[3rem] overflow-hidden rotate-6 transform scale-105 opacity-60 blur-[3px]">
              <img src={portfolioItems[2]?.coverUrl || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop"} alt="Event" className="w-full h-full object-cover" />
            </div>
            {/* Center Right */}
            <div className="absolute bottom-[20%] -right-[5%] w-[25rem] h-[25rem] rounded-[3rem] overflow-hidden -rotate-6 transform scale-90 opacity-80 blur-[1px]">
              <img src={portfolioItems[3]?.coverUrl || "https://images.unsplash.com/photo-1554046949-b0037a3fb9bf?q=80&w=1200&auto=format&fit=crop"} alt="Stage" className="w-full h-full object-cover" />
            </div>
          </div>
          
          {/* Effet d'éclairage subtil (en remplacement des anciens blobs) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 z-0">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-8">
              <AnimatedLogo />
            </div>

            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary-500 text-white mb-8 shadow-xl animate-fade-in ring-4 ring-primary-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase">
                {content.hero?.badge || "Production Audiovisuelle & Événementielle • Depuis 1988"}
              </span>
            </div>

            <h1 className="text-6xl md:text-[9rem] font-black text-gray-950 mb-6 tracking-tighter leading-[0.85] flex flex-col items-center">
              <span className="opacity-90 drop-shadow-lg">{content.hero?.title_fixed || "L'Art de"}</span>
              <TypewriterTitle words={content.hero?.title_words || ["Capturer", "Sublimer", "Raconter", "Célébrer", "Éterniser"]} />
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
              {content.hero?.description
                ? <span>{content.hero.description}</span>
                : <>Depuis 1988, <strong>L Benna Production</strong> écrit votre histoire par l'image. <br className="hidden md:block" /> Mariages d'exception, films corporate et studio de création.</>
              }
            </p>

            {/* Un seul CTA principal clair */}
            <Link
              to="/production"
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-primary-500/40 transform hover:scale-105 transition-all duration-300"
            >
              <CalendarDays size={24} />
              Réserver un Projet
            </Link>
          </div>

          {/* Univers / Catégories (si disponibles) */}
          {universesCount > 0 && (
            <div className="mt-14 backdrop-blur-sm bg-white/30 p-2 rounded-[3.5rem] border border-white/50 shadow-2xl">
              <UniversesCarousel />
            </div>
          )}
        </div>
      </section>

      {/* ── 2. SERVICES : Catalogue complet avec CTA réservation ── */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <span className="text-primary-500 font-bold tracking-wider uppercase text-sm">Expertise Studio & Terrain</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4 tracking-tighter">Nos Services</h2>
          <p className="text-gray-500 text-lg">Des prestations haut de gamme, adaptées à votre vision.</p>
        </div>

        <ServicesCarousel />

        {/* Deux actions distinctes : découvrir PLUS ou réserver directement */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 px-4">
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-primary-400 text-gray-700 hover:text-primary-600 rounded-2xl font-semibold text-base transition-all duration-300"
          >
            Voir tous les services <ArrowRight size={18} />
          </Link>
          <Link
            to="/production"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-primary-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <CalendarDays size={18} />
            Réserver maintenant
          </Link>
        </div>
      </section>

      {/* ── 3. PORTFOLIO : Une galerie unifiée ── */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <div>
              <span className="text-primary-400 font-bold tracking-wider uppercase text-sm">Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter mt-1">Nos Réalisations</h2>
              <p className="text-gray-400 text-lg">Chaque projet raconte une histoire unique</p>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-primary-400 font-bold border-b-2 border-primary-400/30 hover:border-primary-400 transition pb-1 whitespace-nowrap"
            >
              <Image size={18} /> Explorer toute la galerie
            </Link>
          </div>

          {/* Grille de photos (si disponibles) */}
          {portfolioItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {portfolioItems.map((item, idx) => (
                <Link
                  key={item.id}
                  to="/portfolio"
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                  style={{ aspectRatio: idx === 0 ? '1/1' : '4/3' }}
                >
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Camera size={36} className="text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="text-white font-bold text-sm">{item.title}</p>
                      {item.categoryObject && <span className="text-white/60 text-xs">{item.categoryObject.name}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Fallback: carrousel de projets si pas encore de portfolio photos
            <div className="text-center py-16 text-gray-500">
              <Camera size={60} className="mx-auto mb-4 opacity-30" />
              <p>Galerie en cours de chargement...</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. POUR QUI : Personas ── */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Pour qui ?</h2>
            <p className="text-xl text-gray-500">Un parcours adapté à vos besoins spécifiques</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {(content.personas || [
              { title: "Un particulier", description: "Capturez vos moments précieux, réservez un photographe pour vos événements familiaux.", cta: "Voir les services", link: "/services", icon_name: "Heart" },
              { title: "Une entreprise", description: "Communication visuelle, couverture d'événements pro ou packshots produits de haute qualité.", cta: "Découvrir l'offre Pro", link: "/services", icon_name: "Briefcase" }
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

      {/* ── 5. CONFIANCE : Chiffres & Garanties ── */}
      <section className="py-24 bg-gray-50">
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
              <FeatureCard key={idx} icon={<DynamicIcon name={feature.icon_name} className="w-10 h-10 text-primary-500" />} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. AVIS CLIENTS ── */}
      <section className="py-24 bg-white">
        <ReviewSection />
      </section>

      {/* ── 7. CTA FINAL : appel à l'action unique et distinct du Hero ── */}
      <section className="py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-5 p-12">
          <Camera size={500} />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <span className="text-primary-400 font-bold tracking-wider uppercase text-sm">Prêt à commencer ?</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 mt-3 tracking-tighter">
            {content.cta_final?.title || "Transformons votre vision en chef-d'œuvre"}
          </h2>
          <p className="text-lg mb-10 text-gray-400 leading-relaxed">
            {content.cta_final?.description || "Contactez-nous pour un devis personnalisé — réponse sous 24h."}
          </p>
          {/* CTA différent du Hero : orienté contact / devis */}
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-400 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-primary-500/40 transform hover:scale-105 transition-all duration-300"
          >
            Demander un devis gratuit <ArrowRight size={22} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function PersonaCard({ icon, title, description, cta, link }: any) {
  return (
    <div className="group bg-white p-12 rounded-[3.5rem] shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-3 h-0 group-hover:h-full bg-primary-500 transition-all duration-700"></div>
      <div className="relative text-primary-500 mb-10 bg-primary-50 p-10 rounded-[2.5rem] group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-md">
        {icon}
      </div>
      <h3 className="text-3xl font-black mb-4 text-gray-900 tracking-tighter text-center">{title}</h3>
      <p className="text-gray-500 mb-10 leading-relaxed text-lg text-center">{description}</p>
      <Link to={link} className="mt-auto inline-flex items-center px-8 py-3 bg-gray-50 group-hover:bg-gray-900 group-hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 shadow-sm">
        {cta} <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="text-center group p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300">
      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
