import { useEffect, useState } from 'react';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { salesService, Quote } from '../services/sales';

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        DRAFT: 'bg-gray-100 text-gray-800',
        SENT: 'bg-yellow-100 text-yellow-800',
        ACCEPTED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
        EXPIRED: 'bg-orange-100 text-orange-800',
    };
    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
};

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuotes();
    }, []);

    const loadQuotes = async () => {
        try {
            const data = await salesService.getQuotes();
            setQuotes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (id: string) => {
        if (!confirm('Send this quote to the client?')) return;
        try {
            await salesService.sendQuote(id);
            alert('Quote sent successfully');
            loadQuotes();
        } catch (error) {
            alert('Failed to send quote');
        }
    };

    const copyQuoteLink = (quoteNumber: string) => {
        const link = `${window.location.origin}/quotes/${quoteNumber}`;
        navigator.clipboard.writeText(link);
        alert('Quote link copied to clipboard!');
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quotations</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    New Quote
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 uppercase">
                        <tr>
                            <th className="p-4">Number</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Created</th>
                            <th className="p-4">Expiry</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={7} className="p-4 text-center">Loading...</td></tr>
                        ) : quotes.length === 0 ? (
                            <tr><td colSpan={7} className="p-4 text-center text-gray-500">No quotes found.</td></tr>
                        ) : (
                            quotes.map((quote: Quote) => (
                                <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                                    <td className="p-4 font-medium">{quote.quoteNumber}</td>
                                    <td className="p-4">
                                        <div>{quote.clientName || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{quote.clientEmail}</div>
                                    </td>
                                    <td className="p-4">{new Date(quote.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">{quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : '-'}</td>
                                    <td className="p-4 font-bold">{quote.total.toFixed(3)} TND</td>
                                    <td className="p-4"><StatusBadge status={quote.status} /></td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => handleSend(quote.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Send to Client"
                                        >
                                            <CheckCircleOutlined size={16} />
                                        </button>
                                        <button
                                            onClick={() => copyQuoteLink(quote.quoteNumber)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                                            title="Copy Public Link"
                                        >
                                            <FileTextOutlined size={16} />
                                        </button>
                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="View Details">
                                            <FileTextOutlined size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
