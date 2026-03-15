import { useState, useEffect } from 'react';
import { MailOutlined, UserOutlined, PhoneOutlined, CalendarOutlined, SearchOutlined, DeleteOutlined, ClockCircleOutlined, MessageOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { Modal, Input, message as antdMessage } from 'antd';
import { api } from '@/lib/api';

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ, ARCHIVED
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/messages');
            setMessages(response.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/messages/${id}/read`);
            setMessages(messages.map((m: any) => m.id === id ? { ...m, isRead: true } : m));
            if (selectedMessage?.id === id) setSelectedMessage({ ...selectedMessage, isRead: true });
        } catch (err) {
            console.error('Failed to mark message as read', err);
        }
    };

    const archiveMessage = async (id: string) => {
        try {
            await api.patch(`/messages/${id}/archive`);
            setMessages(messages.map((m: any) => m.id === id ? { ...m, isArchived: true } : m));
            antdMessage.success('Message archivé');
            if (selectedMessage?.id === id) setSelectedMessage({ ...selectedMessage, isArchived: true });
        } catch (err) {
            console.error('Failed to archive message', err);
            antdMessage.error('Erreur lors de l\'archivage');
        }
    };

    const submitReply = async () => {
        if (!replyContent.trim()) return;
        setIsSubmittingReply(true);
        try {
            await api.post(`/messages/${selectedMessage.id}/reply`, { content: replyContent });
            antdMessage.success('Réponse enregistrée');
            setMessages(messages.map((m: any) => m.id === selectedMessage.id ? { ...m, replyContent, repliedAt: new Date(), isRead: true } : m));
            setSelectedMessage({ ...selectedMessage, replyContent, repliedAt: new Date(), isRead: true });
            setIsReplyModalOpen(false);
            setReplyContent('');
        } catch (err) {
            console.error('Failed to reply', err);
            antdMessage.error('Erreur lors de l\'enregistrement de la réponse');
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
        try {
            await api.delete(`/messages/${id}`);
            setMessages(messages.filter((m: any) => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (err) {
            console.error('Failed to delete message', err);
        }
    };

    const filteredMessages = messages.filter((m: any) => {
        if (filter === 'ARCHIVED') return m.isArchived;
        if (m.isArchived && filter !== 'ARCHIVED') return false;
        if (filter === 'UNREAD') return !m.isRead;
        if (filter === 'READ') return m.isRead;
        return true;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <LoadingOutlined className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement de la messagerie...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-950 tracking-tight">Hub de Communication</h1>
                    <p className="text-gray-500 font-medium">Gérez les demandes de contact et prospects.</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 gap-1">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filter === 'ALL' ? 'bg-gray-950 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        TOUS ({messages.length})
                    </button>
                    <button
                        onClick={() => setFilter('UNREAD')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filter === 'UNREAD' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        NON LUS ({messages.filter((m: any) => !m.isRead).length})
                    </button>
                    <button
                        onClick={() => setFilter('READ')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filter === 'READ' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        LUS
                    </button>
                    <button
                        onClick={() => setFilter('ARCHIVED')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filter === 'ARCHIVED' ? 'bg-gray-400 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        ARCHIVÉS
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* List */}
                <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredMessages.length === 0 ? (
                        <div className="p-12 bg-white rounded-[2.5rem] border border-gray-100 text-center space-y-4">
                            <MessageOutlined style={{ fontSize: 48 }} className="text-gray-100 mx-auto" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Aucun message trouvé</p>
                        </div>
                    ) : (
                        filteredMessages.map((m: any) => (
                            <div
                                key={m.id}
                                onClick={() => { setSelectedMessage(m); if (!m.isRead) markAsRead(m.id); }}
                                className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative ${selectedMessage?.id === m.id ? 'bg-gray-950 border-gray-950 text-white shadow-xl translate-x-1' : 'bg-white border-gray-100 hover:shadow-lg'}`}
                            >
                                {!m.isRead && (
                                    <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary-600 rounded-full animate-pulse shadow-lg shadow-primary-500/50" />
                                )}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedMessage?.id === m.id ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-black truncate max-w-[120px] ${selectedMessage?.id === m.id ? 'text-white' : 'text-gray-950'}`}>{m.name}</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{m.subject || 'Sans objet'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-xs line-clamp-2 leading-relaxed ${selectedMessage?.id === m.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {m.content}
                                    </p>
                                    <div className="flex items-center gap-3 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <ClockCircleOutlined size={12} /> {new Date(m.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Content */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden animate-in slide-in-from-right-8 duration-500 h-full">
                            <div className="p-10 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-primary-100/30 text-primary-600 rounded-[1.5rem] flex items-center justify-center">
                                                <UserOutlined style={{ fontSize: 32 }} />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-gray-950 tracking-tight">{selectedMessage.name}</h2>
                                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{selectedMessage.subject || 'Demande de contact'}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500">
                                                <MailOutlined size={14} /> {selectedMessage.email}
                                            </div>
                                            {selectedMessage.phone && (
                                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500">
                                                    <PhoneOutlined size={14} /> {selectedMessage.phone}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500">
                                                <CalendarOutlined size={14} /> {new Date(selectedMessage.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <DeleteOutlined style={{ fontSize: 24 }} />
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-[2.5rem] p-10 space-y-6 border border-gray-100">
                                    <div className="flex items-center gap-3 text-primary-600">
                                        <MessageOutlined size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Message Reçu</span>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed font-outfit whitespace-pre-wrap">
                                        {selectedMessage.content}
                                    </p>
                                </div>

                                {selectedMessage.replyContent && (
                                    <div className="bg-primary-50 rounded-[2.5rem] p-10 space-y-6 border border-primary-100 italic">
                                        <div className="flex items-center gap-3 text-primary-600">
                                            <SendOutlined size={20} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Ma Réponse ({new Date(selectedMessage.repliedAt).toLocaleDateString()})</span>
                                        </div>
                                        <p className="text-lg text-primary-900 leading-relaxed font-outfit whitespace-pre-wrap">
                                            {selectedMessage.replyContent}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => { setReplyContent(selectedMessage.replyContent || ''); setIsReplyModalOpen(true); }}
                                        className="flex-1 py-5 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-600 transition-all flex items-center justify-center gap-3"
                                    >
                                        {selectedMessage.replyContent ? 'Modifier la réponse' : 'Répondre directement'} <SendOutlined size={18} />
                                    </button>
                                    <a
                                        href={`mailto:${selectedMessage.email}`}
                                        className="px-6 py-5 bg-white border-2 border-gray-100 text-gray-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-gray-900 transition-all flex items-center justify-center"
                                        title="Répondre par Email (Client Mail)"
                                    >
                                        <MailOutlined size={18} />
                                    </a>
                                    {!selectedMessage.isArchived && (
                                        <button
                                            onClick={() => archiveMessage(selectedMessage.id)}
                                            className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-gray-900 transition-all"
                                        >
                                            Archiver
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 p-20 text-center space-y-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-200">
                                <SearchOutlined style={{ fontSize: 40 }} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Sélectionnez un message</h3>
                                <p className="text-gray-400 font-medium max-w-xs mx-auto text-sm">Cliquez sur un message dans la liste pour voir le contenu complet et y répondre.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                title={<span className="font-black uppercase tracking-widest text-sm">Répondre au message</span>}
                open={isReplyModalOpen}
                onCancel={() => setIsReplyModalOpen(false)}
                onOk={submitReply}
                okText="Enregistrer la réponse"
                cancelText="Annuler"
                confirmLoading={isSubmittingReply}
                centered
                styles={{ content: { borderRadius: '2rem' } }}
            >
                <div className="py-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Message de {selectedMessage?.name}</p>
                    <div className="bg-gray-50 p-4 rounded-xl mb-6 text-xs text-gray-600 italic border-l-4 border-primary-500">
                        {selectedMessage?.content}
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Votre réponse</p>
                    <Input.TextArea
                        rows={6}
                        value={replyContent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyContent(e.target.value)}
                        placeholder="Écrivez votre réponse ici..."
                        style={{ borderRadius: '1rem' }}
                    />
                    <p className="text-[10px] text-gray-400 mt-2 italic">* Cette réponse sera stockée en base de données pour le suivi interne.</p>
                </div>
            </Modal>
        </div>
    );
}
