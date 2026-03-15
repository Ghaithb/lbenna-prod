import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, Settings, ChevronDown, Calendar, Zap, Video } from 'lucide-react';
import { CompactLogo } from './AnimatedLogo';
import { useAuth } from '../context';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const isAuth = !!user;

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // E-commerce category logic removed (Prod project)

  // Removed local auth effect as we use useAuth()

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-fire text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+21612345678" className="flex items-center gap-2 hover:text-white/80 transition">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+216 12 345 678</span>
              </a>
              <a href="mailto:contact@lbenna.tn" className="flex items-center gap-2 hover:text-white/80 transition">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">contact@lbenna.tn</span>
              </a>
            </div>
            <div className="text-xs sm:text-sm">
              Studio de Production Audiovisuelle • Tunis
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="w-full px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="transform hover:scale-105 transition-transform">
              <CompactLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group">
                Accueil
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-fire group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Enhanced Événementiel Dropdown */}
              <EventDropdown
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              />

              <Link to="/portfolio" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group">
                Galerie & Portfolio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-fire group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link to="/about" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group">
                À Propos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-fire group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link to="/contact" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-fire group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Cart removed (Prod project) */}

              {/* CTA Button */}
              {isAuth ? (
                <div className="flex items-center gap-3">
                  {user?.role === 'ADMIN' && (
                    <a
                      href="http://localhost:5174"
                      className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all border border-gray-700"
                    >
                      <Settings size={18} className="animate-spin-slow" />
                      Administration
                    </a>
                  )}
                  <Link
                    to="/dashboard"
                    className="hidden md:inline-flex items-center px-4 py-2 bg-gradient-fire text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all"
                  >
                    Tableau de bord
                  </Link>
                </div>
              ) : (
                <Link
                  to="/register"
                  className="hidden md:inline-flex items-center px-4 py-2 bg-gradient-fire text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all"
                >
                  Créer un compte
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-primary-500 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white animate-fade-in-down">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors font-medium"
              >
                Accueil
              </Link>
              {/* Mobile Product links removed (Prod project) */}

              <Link
                to="/production"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors font-medium"
              >
                Réservations & Studio
              </Link>
              <Link
                to="/portfolio"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors font-medium"
              >
                Galerie & Portfolio
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors font-medium"
              >
                Contact
              </Link>
              {isAuth ? (
                <div className="space-y-2">
                  {user?.role === 'ADMIN' && (
                    <a
                      href="http://localhost:5174"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold text-center hover:bg-gray-800 transition-all"
                    >
                      Administration
                    </a>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 bg-gradient-fire text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all"
                  >
                    Tableau de bord
                  </Link>
                </div>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 bg-gradient-fire text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all"
                >
                  Créer un compte
                </Link>
              )}
            </div>
          </div>
        )}
      </header >
    </>
  );
}

function EventDropdown({ activeDropdown, setActiveDropdown }: any) {
  const events = [
    { title: 'Réserver un Projet', desc: 'Accès direct au brief personnalisé', icon: Calendar, link: '/production' },
    { title: 'Photobooth', desc: 'Location de bornes interactives', icon: Zap, link: '/photobooth' },
    { title: 'Catalogue Services', desc: 'Liste complète des prestations', icon: Video, link: '/services' },
  ];

  return (
    <div
      className="relative group py-8"
      onMouseEnter={() => setActiveDropdown('events')}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button className="flex items-center gap-1.5 text-gray-700 hover:text-primary-500 font-medium transition-colors">
        <Video size={18} className="text-gray-400" />
        Réservations & Studio
        <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'events' ? 'rotate-180' : ''}`} />
      </button>

      <div className={`absolute top-full left-0 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 p-4 transition-all duration-300 origin-top transform ${activeDropdown === 'events' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}>
        <div className="space-y-1">
          {events.map((ev, idx) => (
            <Link
              key={idx}
              to={ev.link}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item text-left"
            >
              <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center group-hover/item:bg-primary-500 group-hover/item:text-white transition-colors">
                <ev.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-gray-950 leading-tight mb-0.5">{ev.title}</p>
                <p className="text-[10px] text-gray-400 font-medium">{ev.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


