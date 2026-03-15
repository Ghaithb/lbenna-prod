import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { ChartBarIcon, UserGroupIcon, AcademicCapIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { analyticsService } from '@/services/analytics';
import { message, Spin } from 'antd';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sum, rev] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getRevenueByMonth()
      ]);
      setSummary(sum);
      setRevenueData(rev);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      message.error('Erreur lors du chargement des données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const statCards = [
    { name: 'Total Utilisateurs', stat: summary?.totalUsers || 0, icon: UserGroupIcon },
    { name: 'Cours/Tutos Actifs', stat: summary?.totalTutorials || 0, icon: AcademicCapIcon },
    { name: 'Licences Actives', stat: summary?.activeLicenses || 0, icon: KeyIcon },
    { name: 'Revenu Total', stat: `${(summary?.totalRevenue || 0).toLocaleString()} TND`, icon: ChartBarIcon },
  ];

  const chartData = {
    labels: revenueData.map((d: any) => d.month),
    datasets: [
      {
        label: 'Revenus (TND)',
        data: revenueData.map((d: any) => d.revenue),
        backgroundColor: 'rgba(249, 115, 22, 0.5)', // Orange color to match theme
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Aperçu des performances annuelles',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Tableau de Bord
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded">Live Data</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <Card key={item.name} className="px-4 py-5 border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-6 w-6 text-slate-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-bold text-slate-500 truncate uppercase tracking-wider">{item.name}</dt>
                  <dd>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-black text-slate-900">{item.stat}</p>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="p-6 border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Aperçu des revenus</h3>
          <div className="mt-5">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </Card>

        <Card className="p-6 border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Activité récente</h3>
          <div className="mt-5 space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
              <p className="text-sm font-bold text-slate-400">Dernières commandes et inscriptions</p>
              <p className="text-xs text-slate-400">Données persistées en temps réel</p>
            </div>
            {summary?.totalOrders === 0 && (
              <p className="text-sm text-slate-500 italic text-center">Aucune commande récente à afficher.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
