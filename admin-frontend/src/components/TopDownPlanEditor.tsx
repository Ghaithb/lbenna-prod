import { useEffect, useRef, useState } from 'react';

export type LightItem = {
  key: string;
  type: 'softbox'|'umbrella'|'continuous_light'|'speedlight';
  angleDeg: number;   // -180..180 (0 = face caméra)
  intensity: number;  // 0..100
  distance?: number;  // m (0.5..4)
  hardness?: number;  // 0..100
  spreadDeg?: number; // 20..140
  cct?: number;       // Kelvin
  gel?: 'None'|'CTO'|'CTB'|'PlusGreen';
};

export default function TopDownPlanEditor({
  value,
  onChange,
  onExport,
}: {
  value: LightItem[];
  onChange: (next: LightItem[]) => void;
  onExport?: (blob: Blob) => void;
}) {
  const [lights, setLights] = useState<LightItem[]>(value || []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setLights(value || []); }, [JSON.stringify(value)]);
  useEffect(() => { onChange && onChange(lights); /* eslint-disable-next-line */ }, [JSON.stringify(lights)]);

  const draw = () => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return;
    const w = c.width, h = c.height; ctx.clearRect(0,0,w,h);
    // background stage
    const grad = ctx.createLinearGradient(0,0,w,h); grad.addColorStop(0,'#f8fafc'); grad.addColorStop(1,'#e2e8f0');
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
    const cx = Math.floor(w*0.5), cy = Math.floor(h*0.56);
    // camera
    ctx.fillStyle = '#111'; ctx.fillRect(cx-12, h-36, 24, 16); ctx.fillStyle = '#444'; ctx.fillRect(cx-8, h-40, 16, 8);
    // subject
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 48, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#334155'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Sujet', cx, cy+4);
    // lights
  lights.forEach((L: LightItem) => {
      const ang = (L.angleDeg * Math.PI)/180; const R = 120; const x = cx + Math.sin(ang)*R; const y = cy - Math.cos(ang)*R;
      // icon
      ctx.fillStyle = '#0ea5e9'; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI*2); ctx.fill();
      // beam
      const spread = Math.max(20, Math.min(140, L.spreadDeg ?? 90));
      const half = (spread/2) * Math.PI/180;
      const pwr = Math.max(0, Math.min(1, (L.intensity||0)/100));
      const rad = 90 + 40*pwr; // beam length
      ctx.fillStyle = 'rgba(14,165,233,0.15)';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, rad, -ang-half, -ang+half);
      ctx.closePath(); ctx.fill();
    });
    // label
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('Plan top‑down (éditeur)', w-10, 16);
  };

  useEffect(() => { draw(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [JSON.stringify(lights)]);

  const update = (idx: number, patch: Partial<LightItem>) => {
    setLights((prev: LightItem[]) => { const next = [...prev]; next[idx] = { ...next[idx], ...patch }; return next; });
  };

  const applyPreset = (name: 'Rembrandt'|'Butterfly') => {
    setLights((prev: LightItem[]) => prev.map((L: LightItem, i: number) => {
      if (name==='Rembrandt') {
        if (i===0) return { ...L, angleDeg: 45, intensity: Math.max(70, L.intensity) };
        if (i===1) return { ...L, angleDeg: -45, intensity: Math.min(40, L.intensity) };
        return { ...L };
      } else { // Butterfly
        if (i===0) return { ...L, angleDeg: 0, intensity: Math.max(80, L.intensity) };
        if (i===1) return { ...L, angleDeg: 180, intensity: Math.min(35, L.intensity) };
        return { ...L };
      }
    }));
  };

  const exportImage = async () => {
    const c = canvasRef.current; if (!c) return; setBusy(true);
    try {
      const blob: Blob = await new Promise((resolve: (b: Blob)=>void) => c.toBlob((b: Blob | null)=> resolve((b as Blob)), 'image/png'));
      onExport && onExport(blob);
    } finally { setBusy(false); }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">Éditeur</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Presets:</span>
            <button className="rounded border px-2 py-0.5 hover:bg-gray-50" onClick={()=>applyPreset('Rembrandt')}>Rembrandt</button>
            <button className="rounded border px-2 py-0.5 hover:bg-gray-50" onClick={()=>applyPreset('Butterfly')}>Butterfly</button>
          </div>
        </div>
        <canvas ref={canvasRef} width={640} height={360} className="w-full rounded border bg-white" />
        <div className="mt-2">
          <button disabled={busy} onClick={exportImage} className="rounded border px-3 py-1 hover:bg-gray-50 disabled:opacity-60">{busy? 'Export…' : 'Exporter en image'}</button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {lights.length === 0 && (
          <div className="text-sm text-gray-600">Aucun projecteur. Sélectionnez des outils (softbox, réflecteur, lumière continue, flash) pour initialiser des sources.</div>
        )}
  {lights.map((L: LightItem, idx: number) => (
          <div key={L.key} className="rounded border p-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium">{L.type}</div>
              <div className="text-xs text-gray-500">#{idx+1}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <label className="flex items-center gap-2 text-xs">∠
                <input type="range" min={-180} max={180} value={L.angleDeg} onChange={(e)=> update(idx, { angleDeg: Number(e.target.value) })} />
                <span className="w-10 text-right">{L.angleDeg}°</span>
              </label>
              <label className="flex items-center gap-2 text-xs">I
                <input type="range" min={0} max={100} value={L.intensity} onChange={(e)=> update(idx, { intensity: Number(e.target.value) })} />
                <span className="w-10 text-right">{L.intensity}</span>
              </label>
              <label className="flex items-center gap-2 text-xs">Dist
                <input type="range" min={0.5} max={4} step={0.1} value={L.distance ?? 1.2} onChange={(e)=> update(idx, { distance: Number(e.target.value) })} />
                <span className="w-10 text-right">{(L.distance ?? 1.2).toFixed(1)}m</span>
              </label>
              <label className="flex items-center gap-2 text-xs">Hard
                <input type="range" min={0} max={100} value={L.hardness ?? 40} onChange={(e)=> update(idx, { hardness: Number(e.target.value) })} />
                <span className="w-10 text-right">{L.hardness ?? 40}</span>
              </label>
              <label className="flex items-center gap-2 text-xs col-span-2">Spread
                <input type="range" className="flex-1" min={20} max={140} value={L.spreadDeg ?? 90} onChange={(e)=> update(idx, { spreadDeg: Number(e.target.value) })} />
                <span className="w-10 text-right">{Math.round(L.spreadDeg ?? 90)}°</span>
              </label>
              {L.type === 'continuous_light' && (
                <label className="flex items-center gap-2 text-xs col-span-2">CCT
                  <input type="range" className="flex-1" min={2500} max={8000} step={50} value={L.cct || 5600} onChange={(e)=> update(idx, { cct: Number(e.target.value) })} />
                  <span className="w-12 text-right">{Math.round(L.cct || 5600)}K</span>
                </label>
              )}
              <label className="flex items-center gap-2 text-xs col-span-2">Gel
                <select className="border rounded px-1 py-0.5 text-xs" value={L.gel || 'None'} onChange={(e)=> update(idx, { gel: e.target.value as any })}>
                  <option>None</option>
                  <option>CTO</option>
                  <option>CTB</option>
                  <option>PlusGreen</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
