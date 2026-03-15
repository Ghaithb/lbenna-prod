import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-700">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
            <CheckCircle size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-black text-gray-950 mb-4 tracking-tighter">Paiement Réussi !</h2>
        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
          Votre paiement a été traité avec succès. Nous vous remercions pour votre confiance. <br />
          Un email de confirmation vous a été envoyé.
        </p>
        <div className="space-y-4">
          <Link
            to="/portfolio"
            className="block w-full py-4 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
          >
            Voir notre Portfolio
          </Link>
          <Link
            to="/"
            className="block w-full py-4 bg-white text-gray-500 border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
          >
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
