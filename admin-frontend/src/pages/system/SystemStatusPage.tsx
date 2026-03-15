import { useState, useEffect } from 'react';
import { DashboardOutlined, CloudServerOutlined, DatabaseOutlined, ClusterOutlined, HddOutlined, ReloadOutlined, CheckCircleOutlined, ClockCircleOutlined, GlobalOutlined, LineChartOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function SystemStatusPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // 30s
        return () => clearInterval(interval);
    }, []);

    const fetchStatus = async () => {
        setRefreshing(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/health`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus(response.data);
        } catch (err) {
            console.error('Failed to fetch system status', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <LineChartOutlined className="w-10 h-10 text-primary-600 animate-pulse mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Analyse du système...</p>
        </div>
    );

    const memoryUsagePercent = status ? Math.round((parseInt(status.memory.used) / parseInt(status.memory.total)) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                        <DashboardOutlined className="text-primary-600" /> Moniteur Système
                    </h1>
                    <p className="text-gray-500 font-medium font-outfit">État de santé et performance du serveur en temps réel.</p>
                </div>
                <Button
                    onClick={fetchStatus}
                    className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-primary-600 transition-all font-bold text-xs uppercase tracking-widest"
                >
                    <ReloadOutlined size={16} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Actualisation...' : 'Actualiser maintenant'}
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="État Global"
                    value={status?.status === 'healthy' ? 'OPÉRATIONNEL' : 'ATTENTION'}
                    subtitle="Serveur Principal"
                    icon={<CloudServerOutlined size={24} />}
                    color={status?.status === 'healthy' ? 'text-green-500' : 'text-red-500'}
                    bg={status?.status === 'healthy' ? 'bg-green-50' : 'bg-red-50'}
                />
                <StatCard
                    title="Base de Données"
                    value={status?.database.status === 'connected' ? 'CONNECTÉ' : 'ERREUR'}
                    subtitle={`Latence: ${status?.database.responseTime}`}
                    icon={<DatabaseOutlined size={24} />}
                    color="text-blue-500"
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Uptime Process"
                    value={formatUptime(status?.uptime)}
                    subtitle="Depuis le dernier redémarrage"
                    icon={<ClockCircleOutlined size={24} />}
                    color="text-purple-500"
                    bg="bg-purple-50"
                />
                <StatCard
                    title="Environnement"
                    value={status?.environment.toUpperCase()}
                    subtitle={`Node ${status?.nodeVersion}`}
                    icon={<GlobalOutlined size={24} />}
                    color="text-orange-500"
                    bg="bg-orange-50"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-xl p-10 space-y-10">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black tracking-tight text-gray-950 uppercase">Ressources Matérielles</h3>
                        <DashboardOutlined className="text-gray-200" size={32} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* CPU */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-950 shadow-sm">
                                    <ClusterOutlined size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Charge CPU</p>
                                    <p className="text-2xl font-black text-gray-950">{status?.system.cpus} Cores</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Load Average</span>
                                    <span>{status?.system.load[0].toFixed(2)}%</span>
                                </div>
                                <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-600 transition-all duration-1000"
                                        style={{ width: `${Math.min(status?.system.load[0] * 10, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Memory */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-950 shadow-sm">
                                    <HddOutlined size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mémoire RAM (Heap)</p>
                                    <p className="text-2xl font-black text-gray-950">{status?.memory.used} / {status?.memory.total}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Utilisation Heap</span>
                                    <span>{memoryUsagePercent}%</span>
                                </div>
                                <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-600 transition-all duration-1000"
                                        style={{ width: `${memoryUsagePercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-6">
                        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                <CloudServerOutlined size={14} className="text-primary-600" /> Système d'Exploitation
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">Plateforme</span>
                                    <span className="text-xs font-black text-gray-900 uppercase">{status?.platform}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">Architecture</span>
                                    <span className="text-xs font-black text-gray-900 uppercase">{status?.arch}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">Total System RAM</span>
                                    <span className="text-xs font-black text-gray-900">{status?.system.totalMemory}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                <DashboardOutlined size={14} className="text-primary-600" /> Process Info
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">Allocated RSS</span>
                                    <span className="text-xs font-black text-gray-900">{status?.memory.rss}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">Heap Total</span>
                                    <span className="text-xs font-black text-gray-900">{status?.memory.total}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">Free RAM (OS)</span>
                                    <span className="text-xs font-black text-green-600">{status?.system.freeMemory}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-950 rounded-[3rem] p-10 text-white flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary-600/30 transition-all" />

                    <div className="relative z-10 space-y-8">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary-500 shadow-inner">
                            <DashboardOutlined size={32} />
                        </div>
                        <h3 className="text-4xl font-black tracking-tight leading-tight">Le système fonctionne <br /><span className="text-primary-500">à plein potentiel.</span></h3>
                        <p className="text-gray-400 font-medium font-outfit text-lg">Aucune anomalie détectée dans les logs de production. Les serveurs de tirage sont en ligne et prêts.</p>
                    </div>

                    <div className="relative z-10 pt-10">
                        <div className="flex items-center gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                            <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                                <CheckCircleOutlined size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dernier Check</p>
                                <p className="text-sm font-bold">{new Date(status?.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon, color, bg }: any) {
    return (
        <div className={`p-8 rounded-[2.5rem] ${bg} border border-transparent hover:border-white transition-all shadow-sm`}>
            <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center ${color} mb-6 shadow-sm`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <h4 className={`text-xl font-black tracking-tight ${color} leading-none mb-2`}>{value}</h4>
            <p className="text-[10px] font-bold text-gray-500/60 uppercase tracking-widest leading-none">{subtitle}</p>
        </div>
    );
}

function formatUptime(seconds: number) {
    if (!seconds) return '0s';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}j ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${Math.floor(seconds % 60)}s`;
}

function Button({ children, onClick, className }: any) {
    return (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    );
}
