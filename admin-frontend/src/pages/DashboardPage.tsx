import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { UserOutlined, ProjectOutlined, CalendarOutlined, LoadingOutlined, MessageOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, eventsRes, upcomingRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/events?limit=5'),
          api.get('/analytics/upcoming?limit=5')
        ]);
        setStats(summaryRes.data);
        setEvents(eventsRes.data);
        setUpcoming(upcomingRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingOutlined className="w-10 h-10 text-primary-600 animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-bold text-[10px]">Lbenna Production • Vue d'ensemble</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Chiffre d'Affaires Réel</p>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <DollarOutlined className="text-emerald-600" />
            <span className="text-xl font-black text-emerald-700">
              {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(stats?.totalRevenue || 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-500 relative overflow-hidden group">
          <div className="absolute right-[-10px] bottom-[-10px] text-blue-500/10 group-hover:rotate-12 transition-transform">
            <UserOutlined style={{ fontSize: '5rem' }} />
          </div>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clients Actifs</h2>
          <p className="mt-2 text-3xl font-black text-gray-950">{stats?.totalUsers || 0}</p>
        </Card>

        <Card className="hover:shadow-lg transition-all border-l-4 border-l-orange-500 relative overflow-hidden group">
          <div className="absolute right-[-10px] bottom-[-10px] text-orange-500/10 group-hover:rotate-12 transition-transform">
            <CalendarOutlined style={{ fontSize: '5rem' }} />
          </div>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Réservations</h2>
          <p className="mt-2 text-3xl font-black text-gray-950">{stats?.totalBookings || 0}</p>
        </Card>

        <Card className="hover:shadow-lg transition-all border-l-4 border-l-indigo-500 relative overflow-hidden group">
          <div className="absolute right-[-10px] bottom-[-10px] text-indigo-500/10 group-hover:rotate-12 transition-transform">
            <ProjectOutlined style={{ fontSize: '5rem' }} />
          </div>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Projets Galerie</h2>
          <p className="mt-2 text-3xl font-black text-gray-950">{stats?.totalProjects || 0}</p>
        </Card>

        <Card className="hover:shadow-lg transition-all border-l-4 border-l-green-500 relative overflow-hidden group">
          <div className="absolute right-[-10px] bottom-[-10px] text-green-500/10 group-hover:rotate-12 transition-transform">
            <MessageOutlined style={{ fontSize: '5rem' }} />
          </div>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Messages Non-Archive</h2>
          <p className="mt-2 text-3xl font-black text-gray-950">{stats?.totalMessages || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Prochaines Réservations */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <ClockCircleOutlined className="text-orange-500" />
              Prochaines Réservations
            </h2>
            <Link to="/services/calendar" className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest">
              Calendrier complet
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-[10px] font-black text-gray-400 uppercase tracking-tighter">Client</th>
                  <th className="text-left py-3 text-[10px] font-black text-gray-400 uppercase tracking-tighter">Service</th>
                  <th className="text-left py-3 text-[10px] font-black text-gray-400 uppercase tracking-tighter">Date</th>
                  <th className="text-right py-3 text-[10px] font-black text-gray-400 uppercase tracking-tighter">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {upcoming.length > 0 ? (
                  upcoming.map((booking: any) => (
                    <tr key={booking.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <p className="text-sm font-bold text-gray-900">{booking.customerName}</p>
                        <p className="text-[10px] text-gray-400">{booking.customerPhone}</p>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {booking.serviceOffer?.title}
                        </span>
                      </td>
                      <td className="py-4 text-xs font-bold text-gray-500">
                        {format(new Date(booking.bookingDate), 'PPp', { locale: fr })}
                      </td>
                      <td className="py-4 text-right">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${booking.status === 'CONFIRMED' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400 italic">Aucune réservation à venir.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Activité</h2>
            </div>
            <div className="space-y-4">
              {events.length > 0 ? (
                events.map((event: any, idx: number) => (
                  <div key={idx} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                      <span className="text-[10px] font-black text-gray-400 italic">{event.action.substring(0, 1).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {event.user ? `${event.user.firstName}` : 'Système'}
                        <span className="text-gray-400 font-normal"> : {event.action.split('_').join(' ')}</span>
                      </p>
                      <p className="text-[9px] font-medium text-gray-400">
                        {format(new Date(event.timestamp), 'HH:mm', { locale: fr })} • {event.resource}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-400 italic text-center py-4">Rien à signaler.</p>
              )}
            </div>
          </Card>

          <Card className="bg-primary-600 border-none relative overflow-hidden">
            <div className="relative z-10 text-white">
              <h3 className="text-sm font-black uppercase tracking-wider">Besoin d'aide ?</h3>
              <p className="text-xs text-primary-100 mt-2">Accédez à la documentation ou contactez le support technique.</p>
              <button className="mt-4 bg-white text-primary-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-50 transition-colors">
                Support
              </button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] text-primary-500/20">
              <ClockCircleOutlined style={{ fontSize: '8rem' }} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
