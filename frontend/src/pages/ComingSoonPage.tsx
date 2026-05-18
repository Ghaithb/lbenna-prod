import { Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';

export function ComingSoonPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-20 text-center bg-white relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[100px] pointer-events-none opacity-50" />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
            <Clock className="w-10 h-10 text-primary-500 animate-[spin_4s_linear_infinite]" />
          </div>
          <span className="absolute -top-3 -right-4 bg-gradient-fire text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            Prochainement
          </span>
        </div>

        <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-4">Mise à jour majeure</p>
        <h1 className="text-4xl md:text-6xl font-black text-gray-950 mb-6 leading-[1.1] tracking-tight">
          Réservations
          <span className="block text-gray-300">en cours de développement.</span>
        </h1>

        <p className="text-base text-gray-400 max-w-md mx-auto mb-10 font-medium">
          La plateforme de réservation est en cours de création. Une expérience fluide et intuitive arrive très vite.
        </p>

        {/* Back home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-base uppercase tracking-widest transition-colors mt-8"
        >
          <ArrowLeft size={18} />
          Retour au site
        </Link>
      </div>
    </div>
  );
}
