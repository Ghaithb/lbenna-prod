import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, Shield, Zap, Check, ArrowRight,
  Briefcase, Heart, Users, Award, Sparkles, ShieldCheck,
  CalendarDays, Image, PlayCircle
} from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';
import ServicesCarousel from '../components/ServicesCarousel';
import ReviewSection from '../components/ReviewSection';
import { categoriesService, Category } from '../services/categories';
import UniversesCarousel from '../components/UniversesCarousel';
import VisualShowcase from '../components/VisualShowcase';
import { TypewriterTitle } from '../components/TypewriterTitle';
import PromoCarousel from '../components/PromoCarousel';
import { pagesService, Page } from '../services/pages';
import { portfolioService, PortfolioItem } from '../services/portfolio';
import { partnersService, Partner } from '../services/partners';

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

      {/* ── 1. HERO : Identité + Univers + Bande Démo CTA ── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-25">
            <div className="absolute top-0 -left-24 w-[40rem] h-[40rem] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
            <div className="absolute top-0 -right-24 w-[35rem] h-[35rem] bg-blue-100 rounded-full mix-blend-multiply filter blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-32 left-20 w-[45rem] h-[45rem] bg-primary-100 rounded-full mix-blend-multiply filter blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10">
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/production"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-primary-500/40 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                <CalendarDays size={24} />
                Réserver un Projet
              </Link>
              {/* ── SHOWREEL CTA ── */}
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-gray-900/40 transition-all duration-300 w-full sm:w-auto"
              >
                <PlayCircle size={24} />
                Voir la Bande Démo
              </Link>
            </div>
          </div>

          {universesCount > 0 && (
            <div className="mt-14 backdrop-blur-sm bg-white/30 p-2 rounded-[3.5rem] border border-white/50 shadow-2xl">
              <UniversesCarousel />
            </div>
          )}
        </div>
      </section>

      {/* ── 2. TRUST : Ils nous font confiance (Logos) ── */}
      <ClientLogos />

      {/* ── 3. SERVICES : Catalogue complet ── */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <span className="text-primary-500 font-bold tracking-wider uppercase text-sm">Expertise Studio & Terrain</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4 tracking-tighter">Nos Services</h2>
          <p className="text-gray-500 text-lg">Des prestations haut de gamme, adaptées à votre vision.</p>
        </div>

        <ServicesCarousel />

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

      {/* ── 4. BANNIÈRE PHOTOBOOTH ── */}
      <PhotoboothBanner />

      {/* ── 5. PORTFOLIO : Une galerie unifiée ── */}
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
            <div className="text-center py-16 text-gray-500">
              <Camera size={60} className="mx-auto mb-4 opacity-30" />
              <p>Galerie en cours de chargement...</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 6. VISUAL SHOWCASE (Oubli Réintégré) ── */}
      <div className="border-b border-gray-100">
        <VisualShowcase />
      </div>

      {/* ── 7. L'ÉQUIPE (About Teaser) ── */}
      <AboutTeaser />

      {/* ── 8. POUR QUI : Personas ── */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Pour qui ?</h2>
            <p className="text-xl text-gray-500">Un parcours adapté à vos besoins spécifiques</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {(content.personas || [
              { title: "Un particulier", description: "Capturez vos moments précieux, réservez un photographe pour vos événements familiaux.", cta: "Voir les services", link: "/services", icon_name: "Heart" },
              { title: "Une entreprise", description: "Communication visuelle, capture d'événements pro ou packshots en haute qualité.", cta: "Découvrir l'offre Pro", link: "/services", icon_name: "Briefcase" }
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

      {/* ── 9. CONFIANCE : Chiffres & Garanties ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi nous faire confiance ?</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {(content.features || [
              { icon_name: "Shield", title: "Qualité Certifiée", description: "Savoir-faire artisanal pour des résultats d'exception." },
              { icon_name: "Zap", title: "Rapidité", description: "Production optimisée pour vos projets pressants." },
              { icon_name: "Users", title: "Équipe d'Experts", description: "Des créatifs et techniciens passionnés à votre écoute." },
              { icon_name: "Check", title: "Satisfaction Garantie", description: "Votre vision, sublimée par notre expertise." }
            ]).map((feature: any, idx: number) => (
              <FeatureCard key={idx} icon={<DynamicIcon name={feature.icon_name} className="w-10 h-10 text-primary-500" />} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. AVIS CLIENTS ── */}
      <section className="py-24 bg-white">
        <ReviewSection />
      </section>

      {/* ── 11. CTA FINAL ── */}
      <section className="py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-5 p-12 pointer-events-none">
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

// ── COMPOSANTS INTERNES UTILITAIRES ──

function ClientLogos() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    partnersService.getAll()
      .then(data => {
        setPartners(data.filter(p => p.isActive));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load partners', err);
        setLoading(false);
      });
  }, []);

  const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');

  if (loading) return <div className="py-16 bg-white border-b border-gray-100 min-h-[200px]"></div>;
  if (partners.length === 0) return null;

  return (
    <div className="py-16 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-10">
        <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Ils nous confient leur image</p>
      </div>
      <div className="flex justify-center flex-wrap gap-x-16 gap-y-10 md:gap-x-24 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500 px-6">
        {partners.map(partner => {
          const logoSrc = partner.logoUrl?.startsWith('http')
            ? partner.logoUrl
            : `${BASE_URL}${partner.logoUrl}`;
          return (
            <div key={partner.id} className="flex items-center justify-center" title={partner.name}>
              {partner.logoUrl ? (
                <img
                  src={logoSrc}
                  alt={partner.name}
                  className="h-[2cm] w-auto max-w-[200px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-2xl md:text-3xl font-black font-serif tracking-tight text-gray-800">{partner.name}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}

function PhotoboothBanner() {
  return (
    <section className="py-20 bg-primary-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440502-863a1523bb8e?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl text-center md:text-left">
          <span className="text-primary-200 font-bold uppercase tracking-[0.2em] text-sm mb-3 block">Animation Événementielle</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Mettez du fun dans votre événement !</h2>
          <p className="text-lg text-primary-100 mb-8 leading-relaxed">
            Découvrez notre solution <strong>Photobooth</strong> : tirage immédiat, qualité studio, et souvenirs inoubliables pour vos mariages ou soirées d'entreprise.
          </p>
          <Link to="/photobooth" className="inline-flex items-center justify-center gap-3 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
            Découvrir le Photobooth <ArrowRight size={20} />
          </Link>
        </div>

        <div className="relative flex-shrink-0 animate-float hidden md:flex">
          <div className="w-56 h-56 md:w-72 md:h-72 bg-gradient-to-br from-white/20 to-white/5 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl relative">
            <Camera size={90} className="text-white drop-shadow-lg" />
            <div className="absolute -bottom-6 -right-4 bg-white text-primary-600 font-black px-6 py-3 rounded-xl shadow-2xl rotate-[-10deg] transform hover:rotate-0 transition-transform duration-300">
              Tirage Pro 10s !
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutTeaser() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1">
            <div className="aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
              <img src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=1000&auto=format&fit=crop" alt="Equipe de production" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 animate-blob"></div>
            <div className="absolute top-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white flex justify-center items-center text-xs font-bold text-white">+5</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Créatifs</p>
                  <p className="text-sm font-black text-gray-900">Passionnés</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-primary-500 font-bold uppercase tracking-[0.2em] text-sm mb-2 block">Côté Coulisses</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
              L'humain au cœur de <br /><span className="text-primary-500">votre image.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Derrière chaque réalisation d'exception se cache une équipe technique et créative dévouée. Vidéastes, photographes, télépilotes de drone, directeurs artistiques : unis pour sublimer votre histoire.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-gray-700 font-semibold text-lg hover:text-primary-600 transition-colors">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500"><Check size={14} strokeWidth={3} /></div>
                Plus de 35 ans de savoir-faire (depuis 1988)
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-semibold text-lg hover:text-primary-600 transition-colors">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500"><Check size={14} strokeWidth={3} /></div>
                Matériel Cinéma dernière génération
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-semibold text-lg hover:text-primary-600 transition-colors">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500"><Check size={14} strokeWidth={3} /></div>
                Accompagnement artistique sur-mesure
              </li>
            </ul>
            <Link to="/about" className="group inline-flex items-center gap-2 text-primary-600 font-black text-lg border-b-2 border-primary-600/30 pb-1 hover:border-primary-600 transition-all">
              Découvrir notre équipe <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
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
    <div className="text-center group p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
