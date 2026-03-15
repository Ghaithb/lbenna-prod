import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Bar, Line } from 'react-chartjs-2';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

type Summary = {
  total: number;
  byType: Record<string, number>;
  top: Array<{ type: string; count: number }>;
  byDay: Array<{ date: string; count: number }>;
};

type EventRow = { t: number; type: string; props?: Record<string, any>; userId?: string };

export function AnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [s, e] = await Promise.all([
          api.get(`/analytics/summary`, { params: { days } }).then(r=>r.data),
          api.get(`/analytics/events`, { params: { limit: 250 } }).then(r=>r.data),
        ]);
        setSummary(s); setEvents(e);
      } catch (err: any) {
        setError(err?.message || 'Erreur analytics');
      } finally { setLoading(false); }
    })();
  }, [days]);

  const lineData = {
    labels: summary?.byDay.map((d: {date: string; count: number})=>d.date) || [],
    datasets: [
      {
        label: 'Événements/jour',
        data: summary?.byDay.map((d: {date: string; count: number})=>d.count) || [],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const barData = {
    labels: summary?.top.map((i: {type: string; count: number})=>i.type) || [],
    datasets: [
      {
        label: 'Top événements',
        data: summary?.top.map((i: {type: string; count: number})=>i.count) || [],
        backgroundColor: '#10b981',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytiques</h1>
        <div className="flex items-center gap-2 text-sm">
          <span>Période:</span>
          <select className="border rounded px-2 py-1" value={days} onChange={(e)=> setDays(Number(e.target.value)||7)}>
            <option value={7}>7 jours</option>
            <option value={14}>14 jours</option>
            <option value={30}>30 jours</option>
          </select>
        </div>
      </div>

      {error && (<div className="rounded border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>)}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Événements quotidiens</h2>
            <div className="text-sm text-gray-600">Total: {summary?.total ?? '—'}</div>
          </div>
          <div className="mt-4 h-64">
            {!loading && summary ? (<Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />) : (<div className="text-sm text-gray-500">Chargement…</div>)}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-medium">Top événements</h2>
          <div className="mt-4 h-64">
            {!loading && summary ? (<Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />) : (<div className="text-sm text-gray-500">Chargement…</div>)}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-medium">Événements récents</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Props</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 50).map((ev: EventRow, i: number)=> (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-3 whitespace-nowrap">{new Date(ev.t).toLocaleString()}</td>
                    <td className="py-2 pr-3 font-medium">{ev.type}</td>
                    <td className="py-2 pr-3 text-gray-700 max-w-[480px] truncate" title={JSON.stringify(ev.props)}>{JSON.stringify(ev.props)}</td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td className="py-3 text-gray-500" colSpan={3}>Aucun événement encore.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}