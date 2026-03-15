import { useEffect, useState } from 'react';

export default function AnimatedLogo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Effet de lueur en arrière-plan */}
      <div className="absolute inset-0 blur-xl opacity-50 animate-glow">
        <div className="w-full h-full bg-gradient-fire rounded-full"></div>
      </div>

      {/* Logo principal */}
      <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <h1 className="text-5xl md:text-7xl font-bold">
          {/* L avec animation */}
          <span className="inline-block animate-slide-in-left bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            L
          </span>

          {/* Espace */}
          <span className="inline-block w-4"></span>

          {/* Benna avec animation lettre par lettre */}
          <span className="inline-block">
            {['B', 'e', 'n', 'n', 'a'].map((letter, index) => (
              <span
                key={index}
                className="inline-block animate-fade-in-up bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent"
                style={{
                  animationDelay: `${0.1 * (index + 1)}s`,
                  animationFillMode: 'both',
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        </h1>

        {/* Sous-titre animé */}
        <div className="mt-2 overflow-hidden">
          <p className={`text-2xl md:text-4xl text-gray-600 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <span className="bg-gradient-sunset bg-clip-text text-transparent font-semibold">
              Production
            </span>
          </p>
        </div>

        {/* Ligne décorative animée */}
        <div className={`mt-4 h-1 bg-gradient-fire rounded-full transition-all duration-1000 delay-1000 ${isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
      </div>
    </div>
  );
}

// Version compacte pour le header
export function CompactLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      {/* Icône avec effet de lueur */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-fire rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <div className="relative w-8 h-8 bg-gradient-fire rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
          L
        </div>
      </div>

      {/* Texte */}
      <div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            L
          </span>
          <span className="text-lg font-bold bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
            Benna
          </span>
        </div>
        <div className="text-[12px] font-bold text-gray-600 -mt-1 tracking-[0.1em] uppercase">Production</div>
      </div>
    </div>
  );
}
