
import { Card } from '@/components/ui/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'];

const revenueData = {
  labels: monthLabels,
  datasets: [
    {
      label: 'Revenus mensuels',
      data: [65, 59, 80, 81, 56, 55, 72],
      borderColor: 'rgb(37, 99, 235)',
      backgroundColor: 'rgba(37, 99, 235, 0.5)',
    },
  ],
};

const userActivityData = {
  labels: monthLabels,
  datasets: [
    {
      label: 'Nouveaux utilisateurs',
      data: [28, 48, 40, 19, 86, 27, 90],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    },
    {
      label: 'Utilisateurs actifs',
      data: [65, 59, 80, 81, 56, 55, 72],
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenus</h3>
          <Line options={options} data={revenueData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activité utilisateurs</h3>
          <Bar options={options} data={userActivityData} />
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques détaillées</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Taux de conversion</h4>
              <p className="mt-2 text-3xl font-semibold text-gray-900">3.2%</p>
              <p className="mt-1 text-sm text-green-600">+0.4% vs mois dernier</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Temps moyen de session</h4>
              <p className="mt-2 text-3xl font-semibold text-gray-900">24m</p>
              <p className="mt-1 text-sm text-red-600">-2m vs mois dernier</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Taux de rétention</h4>
              <p className="mt-2 text-3xl font-semibold text-gray-900">68%</p>
              <p className="mt-1 text-sm text-green-600">+5% vs mois dernier</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}