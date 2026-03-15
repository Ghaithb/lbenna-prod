import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function PaymentFailPage() {
  const location = useLocation();

  useEffect(() => {
    // Optionnel: envoyer un event analytics d'échec
  }, [location.search]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl text-center p-8 bg-white rounded-xl shadow">
        <div className="text-2xl font-semibold mb-2">Paiement annulé ❌</div>
        <div className="text-gray-600 mb-4">Votre paiement n'a pas abouti. Vous pouvez réessayer.</div>
        <div className="flex items-center justify-center gap-3">
          <Link to="/subscribe" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">Réessayer</Link>
          <Link to="/" className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">Accueil</Link>
        </div>
      </div>
    </div>
  );
}
