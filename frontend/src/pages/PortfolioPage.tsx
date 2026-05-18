import { useEffect, useState } from 'react';
import { portfolioService, PortfolioItem } from '../services/portfolio';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

/* ─── helpers ─────────────────────────────────────────── */
const API = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');
const imgSrc = (url?: string) => (!url ? '' : url.startsWith('http') ? url : `${API}${url}`);

export function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  /* Disable right-click globally on this page */
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', block);
    return () => document.removeEventListener('contextmenu', block);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      portfolioService.getAll(),
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/categories`).then(r => r.data)
    ])
    .then(([portfolioData, cats]) => {
      setItems(portfolioData.filter(i => i.isActive));
      setCategories(cats);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  /* Filter items by category */
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.categoryId === selectedCategory || item.categoryObject?.name?.toLowerCase() === selectedCategory.toLowerCase());

  /* Flatten: cover + gallery images into one list from filtered projects */
  const allPhotos: { url: string; key: string }[] = [];
  filteredItems.forEach(item => {
    if (item.coverUrl) allPhotos.push({ url: item.coverUrl, key: `${item.id}-cover` });
    item.galleryUrls?.filter(Boolean).forEach((u, i) =>
      allPhotos.push({ url: u, key: `${item.id}-g${i}` })
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="mt-5 text-gray-400 font-bold uppercase tracking-[0.25em] text-[10px]">
          Chargement de la galerie...
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white min-h-screen"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
    >
      {/* ── HEADER ─────────────────────────────────────── */}
      <section className="pt-20 pb-8 text-center">
        <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-3">
          L Benna Production · Depuis 1988
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight mb-3">
          Nos Réalisations
        </h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          {allPhotos.length} photos · {filteredItems.length} projets
        </p>
      </section>

      {/* ── FILTERS ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12 px-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
            selectedCategory === 'all' 
              ? 'bg-gray-950 text-white border-gray-950 shadow-lg shadow-gray-200' 
              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
          }`}
        >
          Tout voir
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-100'
                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── MOSAIC ─ */}
      {allPhotos.length === 0 ? (
        <div className="text-center py-32 text-gray-300 border-t border-gray-50 mt-8">
          <p className="font-bold uppercase tracking-widest text-sm">Aucune réalisation dans cette catégorie</p>
        </div>
      ) : (
        <div
          style={{
            columnCount: 4,
            columnGap: '3px',
            padding: '3px',
          }}
          className="sm:[column-count:3] md:[column-count:4] border-t border-gray-50 pt-3"
        >
          {allPhotos.map(({ url, key }, index) => (
            <ProtectedPhoto key={key} url={url} idx={index} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Protected photo tile ────────────────────────────── */
function ProtectedPhoto({ url, idx }: { url: string; idx: number }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        breakInside: 'avoid',
        marginBottom: '3px',
        position: 'relative',
        display: 'block',
        pointerEvents: 'none',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.6s ease-out ${idx * 0.05}s, transform 0.6s ease-out ${idx * 0.05}s`,
      }}
    >
      <img
        src={imgSrc(url)}
        alt=""
        draggable={false}
        onLoad={() => setLoaded(true)}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          pointerEvents: 'none',
          WebkitUserDrag: 'none',
        } as React.CSSProperties}
      />

      {/* Watermark overlay (L BENNA) */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ pointerEvents: 'none' }}
      >
        <span
          className="text-white font-black tracking-[0.5em] uppercase select-none opacity-[0.07] rotate-[-30deg] text-3xl sm:text-5xl md:text-6xl whitespace-nowrap drop-shadow-lg"
          style={{ mixBlendMode: 'overlay' }}
        >
          L Benna
        </span>
      </div>

      {/* Transparent overlay — blocks all interaction and disrupts screenshots */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'all',
          cursor: 'default',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(239,43,43,0.02) 50%, rgba(255,255,255,0.01) 100%)',
          mixBlendMode: 'overlay',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        } as React.CSSProperties}
        onContextMenu={e => e.preventDefault()}
        onMouseDown={e => e.preventDefault()}
        onDragStart={e => e.preventDefault()}
      />
    </div>
  );
}
