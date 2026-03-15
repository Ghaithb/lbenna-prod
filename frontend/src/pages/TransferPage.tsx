import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Download, Loader, AlertTriangle, CheckCircle } from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function TransferPage() {
    const { token } = useParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            fetchBooking();
        }
    }, [token]);

    const fetchBooking = async () => {
        try {
            const response = await axios.get(`${API_URL}/bookings/transfer/${token}`);
            setBooking(response.data);
        } catch (err) {
            setError('Ce lien de transfert est invalide ou a expiré.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (booking?.transferFileUrl) {
            // Create a temporary link to force download
            const link = document.createElement('a');
            link.href = booking.transferFileUrl;
            link.setAttribute('download', `LBenna_Production_${booking.customerName.replace(/\s+/g, '_')}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader className="text-white animate-spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
                <AlertTriangle size={64} className="text-red-500 mb-6" />
                <h1 className="text-3xl font-bold mb-4">Lien Expiré</h1>
                <p className="text-gray-400 text-center max-w-md">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 relative overflow-hidden flex flex-col">
            {/* Background with blur */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover blur-sm"
                />
            </div>

            {/* Header */}
            <header className="relative z-20 p-6 md:p-10 flex justify-center md:justify-start">
                <div className="scale-75 origin-top-left">
                    <AnimatedLogo />
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-20 flex-1 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[2.5rem] max-w-2xl w-full shadow-2xl text-center">

                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-bounce-slow">
                            <CheckCircle className="text-white w-10 h-10" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Vos fichiers sont prêts</h1>
                    <p className="text-xl text-gray-300 mb-8 font-light">
                        Bonjour <span className="font-bold text-white">{booking.customerName}</span>, voici les éléments de votre projet <span className="italic">"{booking.serviceOffer?.title}"</span>.
                    </p>

                    <div className="bg-black/30 rounded-2xl p-6 mb-10 flex items-center justify-between border border-white/10">
                        <div className="text-left">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Contenu</p>
                            <p className="text-white font-bold">Sélection Photos & Vidéos HD</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Date</p>
                            <p className="text-white font-bold">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="group w-full py-5 bg-white text-gray-900 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                        <Download className="group-hover:scale-110 transition-transform" />
                        Télécharger (ZIP)
                    </button>
                    <p className="mt-6 text-xs text-gray-500">
                        Lien valide 30 jours • L Benna Production • &copy; 1988-{new Date().getFullYear()}
                    </p>
                </div>
            </main>
        </div>
    );
}
