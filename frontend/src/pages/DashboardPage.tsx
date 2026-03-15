import { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, FileText } from 'lucide-react';
import { bookingsService } from '../services/bookings';

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingsService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error("Bookings load failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter italic">Tableau de Bord</h1>
            <p className="text-gray-500 text-xl font-medium">
              Bienvenue, <span className="text-blue-600 font-black">{user?.firstName} {user?.lastName}</span>.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/portfolio" className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">Portfolio</Link>
            <Link to="/services" className="px-6 py-3 bg-gray-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">Nouveauté</Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content: Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                  <CalendarIcon className="text-blue-600" size={28} />
                  Mes Rendez-vous
                </h2>
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  {bookings.length} Session{bookings.length > 1 ? 's' : ''}
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-medium mb-6">Vous n'avez pas encore de réservations.</p>
                  <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest border-b-2 border-blue-600/20 hover:border-blue-600 transition-all pb-1">Réserver maintenant</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="group bg-gray-50 hover:bg-white p-6 rounded-3xl border border-transparent hover:border-gray-200 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex gap-5 items-center">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                            <Clock size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900 text-lg tracking-tight">{booking.serviceOffer?.title || 'Prestation Studio'}</h4>
                            <p className="text-gray-500 text-sm font-medium">{new Date(booking.bookingDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {new Date(booking.bookingDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' :
                            booking.status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                              booking.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' :
                                'bg-gray-100 text-gray-400'
                            }`}>
                            {booking.status === 'CONFIRMED' ? 'Confirmé' : booking.status === 'PENDING' ? 'En attente' : booking.status === 'COMPLETED' ? 'Terminé' : booking.status}
                          </span>

                          {booking.deliveryUrl && (
                            <a
                              href={booking.deliveryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
                            >
                              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                              Télécharger
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Profile Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50"></div>
              <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight">
                <User className="text-blue-600" size={24} />
                Mon Profil
              </h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Téléphone</p>
                    <p className="text-sm font-bold text-gray-900">{(user as any)?.phone || 'Non renseigné'}</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-10 py-4 border-2 border-dashed border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-all">
                Modifier mes informations
              </button>
            </div>

            {/* Quotes/Invoices placeholder */}
            <div className="bg-gray-950 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200 text-white">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 tracking-tight text-white">
                <FileText className="text-orange-400" size={24} />
                Documents
              </h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Retrouvez vos devis et factures relatifs à vos prestations studio et projets vidéo.</p>
              <Link to="/quotes" className="block w-full text-center py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest">
                Accéder aux documents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}