import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { CompactLogo } from './AnimatedLogo';
import { settingsService, PublicSettings } from '../services/settings';

export function Footer() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);

  useEffect(() => {
    settingsService.getPublic().then(setSettings).catch(console.error);
  }, []);

  const phone = settings?.contact_phone || '+216 71 000 000';
  const email = settings?.contact_email || 'contact@lbennaproduction.tn';
  const address = settings?.contact_address || 'Cyberpark, El Ghazala, Tunis, Tunisie';

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section remains the same */}
      <div className="bg-gradient-fire py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Restez informé de nos actualités
            </h3>
            <p className="text-white/90 mb-6">
              Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives
            </p>
            <form className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <CompactLogo />
            </div>
            <p className="text-sm mb-4">
              Votre partenaire pour le tirage photo professionnel, la formation en photographie et la production événementielle.
            </p>
            <div className="flex gap-3">
              {settings?.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-fire transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-fire transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-fire transition-all">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {settings?.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-fire transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Services Links remains the same */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Nos Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/production" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Réservation Studio
                </Link>
              </li>
              {/* ... other links ... */}
              <li>
                <Link to="/services" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Production Vidéo
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Reportage Mariage
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Portfolio Artistique
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations Links remains the same */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Informations</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-primary-400 transition-colors flex items-center gap-2">À propos</Link></li>
              <li><Link to="/faq" className="hover:text-primary-400 transition-colors flex items-center gap-2">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors flex items-center gap-2">Contact</Link></li>
              <li><Link to="/cgv" className="hover:text-primary-400 transition-colors flex items-center gap-2">CGV</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors flex items-center gap-2">Politique de confidentialité</Link></li>
            </ul>
          </div>

          {/* Contact - Dynamized */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contactez-nous</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-primary-400 transition-colors">
                    {phone}
                  </a>
                  <p className="text-xs text-gray-500">Lun-Sam 9h-19h</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${email}`} className="hover:text-primary-400 transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} L Benna Production. Tous droits réservés.</p>
            <ul className="flex gap-6">
              <li><Link to="/portfolio" className="hover:text-primary-400 transition-colors">Galerie</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">À Propos</Link></li>
              <li><Link to="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors">Espace Client</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
