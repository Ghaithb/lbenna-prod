import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Camera } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 text-center bg-white">
      {/* Decorative number */}
      <div className="relative mb-8 select-none">
        <span
          className="text-[10rem] md:text-[14rem] font-black leading-none"
          style={{
            backgroundImage: 'linear-gradient(135deg, #f1f1f1 0%, #e5e5e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
            <Camera className="w-10 h-10 text-primary-500" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl md:text-4xl font-black text-gray-950 mb-4">
        Page introuvable
      </h1>
      <p className="text-gray-400 font-medium mb-10 max-w-sm leading-relaxed">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-fire text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary-200 transition-all"
        >
          <Home size={16} />
          Retour à l'accueil
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
        >
          <ArrowLeft size={16} />
          Page précédente
        </button>
      </div>

      <p className="mt-12 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
        L Benna Production · Studio Audiovisuel
      </p>
    </div>
  );
}
