import { useState, useEffect } from 'react';
import { AuditOutlined, ClockCircleOutlined, SearchOutlined, ExclamationCircleOutlined, LoadingOutlined, DatabaseOutlined, DeleteOutlined, EditOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface AuditLog {
    id: string;
    action: string;
    resource: string;
    payload: any;
    timestamp: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    } | null;
}

export default function AuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/audit-logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
        } catch (err) {
            console.error('Failed to fetch audit logs', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'POST': return 'bg-green-100 text-green-700 border-green-200';
            case 'PATCH':
            case 'PUT': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'POST': return <PlusOutlined size={14} />;
            case 'PATCH':
            case 'PUT': return <EditOutlined size={14} />;
            case 'DELETE': return <DeleteOutlined size={14} />;
            default: return <InfoCircleOutlined size={14} />;
        }
    };

    const filteredLogs = logs.filter((log: AuditLog) =>
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <LoadingOutlined className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement des journaux...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                        <AuditOutlined className="text-primary-600" /> Sécurité & Audit
                    </h1>
                    <p className="text-gray-500 font-medium">Historique complet des actions administratives.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une action, ressource ou utilisateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:border-primary-600 transition-all font-medium text-gray-900"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Horodateur</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ressource</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredLogs.map((log: AuditLog) => (
                                <tr key={log.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <ClockCircleOutlined size={16} />
                                            <span className="text-xs font-bold font-outfit">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {log.user ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px] font-black">
                                                    {log.user.firstName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 leading-none mb-1">{log.user.firstName} {log.user.lastName}</p>
                                                    <p className="text-[10px] font-medium text-gray-400">{log.user.email}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Système / Inconnu</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                                            {getActionIcon(log.action)}
                                            {log.action}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <DatabaseOutlined size={14} className="text-gray-300" />
                                            <span className="text-xs font-bold text-gray-600 font-mono truncate max-w-[200px]" title={log.resource}>
                                                {log.resource}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => console.log('Payload:', log.payload)}
                                            className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all shadow-sm"
                                        >
                                            JSON Payload
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredLogs.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <ExclamationCircleOutlined size={48} className="text-gray-100 mx-auto" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Aucun journal d'activité trouvé</p>
                    </div>
                )}
            </div>
        </div>
    );
}
