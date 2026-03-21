import { useEffect, useState } from 'react';

export default function AnimatedLogo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
      <img 
        src="/logo-stacked.png" 
        alt="L Benna Production" 
        className="h-32 md:h-48 object-contain drop-shadow-2xl"
      />
    </div>
  );
}

// Version compacte pour le header
export function CompactLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <img 
        src="/logo-horizontal.png" 
        alt="L Benna Production" 
        className="h-14 md:h-16 object-contain group-hover:scale-105 transition-transform"
      />
    </div>
  );
}
