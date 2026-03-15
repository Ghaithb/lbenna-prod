import { useEffect, useState } from 'react';
import { portfolioService, PortfolioItem } from '../services/portfolio';
import { X, Play, Image as ImageIcon, ExternalLink, Calendar, Tag, ChevronRight, Loader2 } from 'lucide-react';
import { categoriesService, Category } from '../services/categories';

export function PortfolioPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [portfolioData, cats] = await Promise.all([
                portfolioService.getAll(),
                categoriesService.getAll()
            ]);
            setItems(portfolioData.filter(i => i.isActive));
            // Only keep categories that have portfolio items
            const relCats = cats.filter((c: Category) => portfolioData.some(i => i.categoryId === c.id));
            setCategories(relCats);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = filter === 'ALL'
        ? items
        : items.filter(item => item.categoryId === filter || item.category === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement de la galerie...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gray-50/50 -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-6xl font-black text-gray-950 tracking-tight mb-6">
                        L'Art de <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Capturer</span> l'Instant
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Chaque projet est une histoire unique. Explorez notre sélection de réalisations audiovisuelles d'exception.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {/* Filter Bar */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${filter === 'ALL'
                            ? 'bg-gray-950 text-white shadow-xl shadow-gray-200 scale-105'
                            : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        TOUTE LA GALERIE
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${filter === cat.id
                                ? 'bg-gray-950 text-white shadow-xl shadow-gray-200 scale-105'
                                : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            {cat.name.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredItems.map((item, idx) => (
                        <div
                            key={item.id}
                            className="group relative cursor-pointer aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-8"
                            style={{ animationDelay: `${idx * 100}ms` }}
                            onClick={() => setSelectedItem(item)}
                        >
                            {/* Image */}
                            <img
                                src={item.coverUrl?.startsWith('http') ? item.coverUrl : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${item.coverUrl}`}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <div className="space-y-4">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                        <Tag size={12} /> {(item as any).cat?.name || item.category}
                                    </span>
                                    <div>
                                        <h3 className="text-2xl font-black text-white mb-2 leading-tight">{item.title}</h3>
                                        <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="w-10 h-10 rounded-full bg-white text-gray-950 flex items-center justify-center transform transition-transform group-hover:scale-110">
                                            {item.videoUrl ? <Play size={18} fill="currentColor" /> : <ImageIcon size={18} />}
                                        </div>
                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Voir le projet</span>
                                    </div>
                                </div>
                            </div>

                            {/* Initial Badge */}
                            {!item.videoUrl && (
                                <div className="absolute top-6 right-6 opacity-80 group-hover:opacity-0 transition-opacity">
                                    <div className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-900 border border-white/50">
                                        <ImageIcon size={20} />
                                    </div>
                                </div>
                            )}
                            {item.videoUrl && (
                                <div className="absolute top-6 right-6 opacity-80 group-hover:opacity-0 transition-opacity">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600/80 backdrop-blur-md flex items-center justify-center text-white border border-blue-400/50">
                                        <Play size={20} fill="currentColor" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-24 bg-gray-50 rounded-[3rem]">
                        <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Aucun projet dans cette catégorie</p>
                    </div>
                )}
            </div>

            {/* Immersive Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-2xl" onClick={() => setSelectedItem(null)} />

                    <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white md:text-gray-400 md:hover:text-gray-900 rounded-full flex items-center justify-center transition-all border border-white/20 md:border-gray-100"
                        >
                            <X size={24} />
                        </button>

                        {/* Media Section */}
                        <div className="w-full md:w-2/3 bg-gray-50 flex items-center justify-center overflow-hidden">
                            {selectedItem.videoUrl ? (
                                <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-12">
                                    <div className="relative group/play">
                                        <img src={selectedItem.coverUrl?.startsWith('http') ? selectedItem.coverUrl : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${selectedItem.coverUrl}`} alt="Video Preview" className="max-h-[60vh] object-contain rounded-2xl shadow-2xl transition-all group-hover/play:scale-[1.02] group-hover/play:brightness-50" />
                                        <a href={selectedItem.videoUrl} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl transform transition-transform group-hover/play:scale-125">
                                                <Play size={40} fill="currentColor" />
                                            </div>
                                        </a>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Cinématique</p>
                                        <a href={selectedItem.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xl font-black text-gray-900 hover:text-blue-600 transition-colors">
                                            Regarder la réalisation sur YouTube <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 w-full h-full overflow-y-auto scrollbar-hide">
                                    <div className="grid grid-cols-1 gap-8">
                                        <img src={selectedItem.coverUrl?.startsWith('http') ? selectedItem.coverUrl : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${selectedItem.coverUrl}`} alt="Project Main" className="w-full rounded-2xl shadow-xl hover:scale-[1.01] transition-transform duration-500" />
                                        {selectedItem.galleryUrls?.map((url, idx) => (
                                            <img key={idx} src={url?.startsWith('http') ? url : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${url}`} alt={`Detail ${idx}`} className="w-full rounded-2xl shadow-lg hover:scale-[1.01] transition-transform duration-500" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="w-full md:w-1/3 p-12 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100">
                            <div className="space-y-10">
                                <div>
                                    <span className="inline-block px-4 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">
                                        Étude de cas • {selectedItem.category}
                                    </span>
                                    <h2 className="text-4xl font-black text-gray-950 leading-[1.1] mb-6">
                                        {selectedItem.title}
                                    </h2>
                                    <p className="text-gray-500 leading-relaxed font-medium">
                                        {selectedItem.description}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date de réalisation</p>
                                            <p className="text-sm font-black text-gray-900">Décembre 2025</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                            <Tag size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégorie</p>
                                            <p className="text-sm font-black text-gray-900">{(selectedItem as any).cat?.name || selectedItem.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10">
                                <button className="w-full group flex items-center justify-between p-6 bg-gray-50 rounded-3xl hover:bg-gray-900 hover:text-white transition-all duration-500">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 group-hover:text-gray-500">Un projet similaire ?</p>
                                        <p className="text-sm font-black uppercase tracking-widest mt-1">Contactez-nous</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white group-hover:bg-white/10 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-none transition-all group-hover:translate-x-1">
                                        <ChevronRight size={20} className="text-gray-900 group-hover:text-white" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
