import { useEffect, useState } from 'react';
import { serviceOffersService, ServiceOffer } from '../services/serviceOffers';
import { bookingsService, CreateBookingDto } from '../services/bookings';
import { portfolioService, PortfolioItem } from '../services/portfolio';
import {
  Clock, Check, X, Sparkles, Loader2,
  Camera, Video,
  Zap, ShieldCheck, Star, Users
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { SectionHeader } from '../components/SectionHeader';
import { Link } from 'react-router-dom';

export function ServicesPage() {
  const [offers, setOffers] = useState<ServiceOffer[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<ServiceOffer | null>(null);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateBookingDto>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [offersData, portfolioData] = await Promise.all([
        serviceOffersService.getAll(),
        portfolioService.getAll()
      ]);
      setOffers(offersData.filter((o: ServiceOffer) => o.isActive));
      setPortfolio(portfolioData.filter((i: PortfolioItem) => i.isActive));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pillars = [
    {
      id: 'events',
      title: 'Production Événementielle',
      badge: 'Reportage & Cinéma',
      icon: Video,
      description: 'Capture cinématographique de mariages et couverture corporate. Borne Photobooth haut de gamme.',
      keywords: ['mariage', 'wedding', 'événement', 'drone', 'vidéo', 'film', 'photobooth', 'location']
    },
    {
      id: 'studio',
      title: 'Studio de Création',
      badge: 'Lumière & Mise en Scène',
      icon: Camera,
      description: 'Portraits d\'art, shootings mode et packshots produits dans notre studio professionnel tout équipé.',
      keywords: ['shooting', 'portrait', 'mode', 'profil', 'studio', 'packshot']
    }
  ];

  const onSubmit = async (data: CreateBookingDto) => {
    if (!selectedOffer) return;
    try {
      await bookingsService.create({
        ...data,
        serviceOfferId: selectedOffer.id,
        bookingDate: new Date(data.bookingDate).toISOString()
      });
      setSuccess(true);
      reset();
    } catch (err) {
      console.error('Booking failed', err);
    }
  };

  const closeModal = () => {
    setSelectedOffer(null);
    setSuccess(false);
    reset();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement de l'univers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950 to-gray-950" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            title="Nos Pôles d'Expertise"
            subtitle="Explorez nos deux univers : du studio de création à la production événementielle d'envergure."
            badge="Savoir-Faire & Excellence"
            icon={Sparkles}
            dark
          />
          <div className="flex justify-center gap-8 mt-12 flex-wrap text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2"><Zap size={14} className="text-yellow-500" /> Vitesse d'exécution</span>
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-green-500" /> Qualité Garantie</span>
            <span className="flex items-center gap-2"><Users size={14} className="text-blue-500" /> Équipe d'Experts</span>
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="py-24 space-y-32">
        {pillars.map((pillar, pillarIndex) => {
          const pillarOffers = offers.filter(o =>
            pillar.keywords.some(kw => o.title.toLowerCase().includes(kw) || o.description?.toLowerCase().includes(kw))
          );
          const pillarProjects = portfolio.filter(p => (p.categoryObject?.slug || p.category || '').toLowerCase().includes(pillar.id)).slice(0, 3);
          const isEven = pillarIndex % 2 === 0;

          return (
            <section key={pillar.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex flex-col lg:flex-row gap-16 items-start ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                {/* Intro Side */}
                <div className="lg:w-1/3 space-y-8 sticky top-32">
                  <div className={`w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-950 shadow-xl shadow-gray-100 ${!isEven ? 'ml-auto text-right' : ''}`}>
                    <pillar.icon size={32} />
                  </div>
                  <div className={!isEven ? 'text-right' : 'text-left'}>
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 block">{pillar.badge}</span>
                    <h2 className="text-4xl font-black text-gray-950 mb-6">{pillar.title}</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">{pillar.description}</p>
                  </div>

                  {/* Proof Side (Portfolio integration) */}
                  {pillarProjects.length > 0 && (
                    <div className="pt-8 border-t border-gray-50">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Nos dernières réalisations</p>
                      <div className="grid grid-cols-3 gap-2">
                        {pillarProjects.map(proj => (
                          <div key={proj.id} className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer">
                            <img src={proj.coverUrl?.startsWith('http') ? proj.coverUrl : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${proj.coverUrl}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                            <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Star size={14} className="text-white fill-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Offers Grid */}
                <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">
                  {pillarOffers.length > 0 ? (
                    pillarOffers.map((offer) => (
                      <div key={offer.id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-50 hover:border-purple-100 hover:shadow-2xl hover:shadow-purple-50 transition-all duration-500 flex flex-col">
                        <div className="relative h-48 mb-8 rounded-[2rem] overflow-hidden">
                          {offer.imageUrl ? (
                            <img src={offer.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={offer.title} />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
                              <pillar.icon size={48} />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-gray-950 font-black text-xs shadow-lg">
                            {offer.price ? `${offer.price} TND` : 'Sur Mesure'}
                          </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-950 mb-3 group-hover:text-purple-600 transition-colors">{offer.title}</h3>
                        <p className="text-gray-400 text-sm font-medium line-clamp-3 mb-8 flex-1 leading-relaxed">
                          {offer.description || 'Prestation professionnelle réalisée avec le plus grand soin technique.'}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Clock size={12} className="text-purple-500" /> {offer.duration || 60} min
                          </span>
                          {offer.title.toLowerCase().includes('tirage') ? (
                            <Link
                              to="/catalog?category=tirage-impression"
                              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 ring-2 ring-purple-100 ring-offset-2"
                            >
                              Commander
                            </Link>
                          ) : offer.title.toLowerCase().includes('photobooth') ? (
                            <Link
                              to="/photobooth"
                              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 ring-2 ring-blue-100 ring-offset-2"
                            >
                              Louer / Réserver
                            </Link>
                          ) : (offer.title.toLowerCase().includes('mariage') || offer.title.toLowerCase().includes('vidéo') || offer.title.toLowerCase().includes('film') || offer.title.toLowerCase().includes('corporate') || offer.title.toLowerCase().includes('drone')) ? (
                            <Link
                              to="/production"
                              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 ring-2 ring-primary-100 ring-offset-2"
                            >
                              Explorer & Réserver
                            </Link>
                          ) : (
                            <button
                              onClick={() => setSelectedOffer(offer)}
                              className="bg-gray-950 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg shadow-gray-200 hover:shadow-purple-100"
                            >
                              Réserver
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-12 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Aucune prestation spécifique pour le moment</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Trust & Process Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Comment ça marche ?"
            subtitle="Un processus simple et transparent pour des résultats professionnels."
            badge="Méthodologie"
            centered
          />
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', text: 'On définit vos besoins ensemble.' },
              { step: '02', title: 'Planification', text: 'On organise la logistique et le studio.' },
              { step: '03', title: 'Production', text: 'Phase de capture ou d\'impression.' },
              { step: '04', title: 'Livraison', text: 'Retrait en boutique ou livraison sécurisée.' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all">
                <span className="text-5xl font-black text-purple-500/10 block mb-4">{s.step}</span>
                <h4 className="text-lg font-bold text-gray-950 mb-2">{s.title}</h4>
                <p className="text-sm text-gray-500 font-medium">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Modal Booking */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-lg" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-8 md:p-10 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block mb-2">Réservation</span>
                <h3 className="text-2xl md:text-3xl font-black text-gray-950 line-clamp-1">{selectedOffer.title}</h3>
              </div>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 transition-all shrink-0 ml-4"><X size={20} /></button>
            </div>

            <div className="p-8 md:p-10">
              {success ? (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100/50"><Check size={40} strokeWidth={4} /></div>
                  <h4 className="text-3xl font-black text-gray-950">Confirmé !</h4>
                  <p className="text-gray-500 font-medium max-w-sm mx-auto">Votre demande de réservation a été enregistrée. L'équipe L Benna Production vous contactera sous peu.</p>
                  <button onClick={closeModal} className="w-full py-4 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all">Fermer</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Date souhaitée</label>
                      <input type="datetime-local" {...register('bookingDate', { required: 'Date requise' })} className="w-full px-5 py-4 rounded-xl border-gray-200 bg-gray-50 focus:border-purple-600 focus:bg-white transition-all font-bold text-gray-900" />
                      {errors.bookingDate && <span className="text-red-500 text-[10px] font-bold px-2">{errors.bookingDate.message}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Nom Complet</label>
                      <input type="text" {...register('customerName', { required: 'Nom requis' })} className="w-full px-5 py-4 rounded-xl border-gray-200 bg-gray-50 focus:border-purple-600 focus:bg-white transition-all font-bold text-gray-900" placeholder="Ex: Ahmed Benna" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email</label>
                      <input type="email" {...register('customerEmail', { required: 'Email requis' })} className="w-full px-5 py-4 rounded-xl border-gray-200 bg-gray-50 focus:border-purple-600 focus:bg-white transition-all font-bold text-gray-900" placeholder="votre@email.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Téléphone</label>
                      <input type="tel" {...register('customerPhone', { required: 'Téléphone requis' })} className="w-full px-5 py-4 rounded-xl border-gray-200 bg-gray-50 focus:border-purple-600 focus:bg-white transition-all font-bold text-gray-900" placeholder="20 000 000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Votre Projet / Remarques</label>
                    <textarea {...register('notes')} rows={3} className="w-full px-5 py-4 rounded-xl border-gray-200 bg-gray-50 focus:border-purple-600 focus:bg-white transition-all font-bold text-gray-900 resize-none" placeholder="Décrivez brièvement votre besoin..." />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <span>Confirmer la réservation</span>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
