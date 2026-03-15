// @ts-nocheck
import { useRef, useState, useEffect, useCallback } from 'react';

export type PreviewModalProps = {
  open: boolean;
  onClose: () => void;
  preset: any | null;
};

export function PreviewModal({ open, onClose, preset }: PreviewModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [iso, setIso] = useState(400);
  const [aperture, setAperture] = useState(5.6);
  const [shutter, setShutter] = useState(125);
  const [wbK, setWbK] = useState(6500);

  const parseNum = (v: string, prev: number) => {
    if (typeof v !== 'string') return prev;
    const normalized = v.replace(',', '.').trim();
    const n = Number(normalized);
    return isNaN(n) ? prev : n;
  };

  // Normalize incoming preset: support legacy direct shape or new { planner, questions } and simple labs
  const normalized = ((): any => {
    if (preset && preset.kind === 'simple') {
      return preset;
    }
    if (preset && preset.planner) {
      const pl = preset.planner;
      const lights: any[] = Array.isArray(pl.items) ? pl.items
        .filter((it: any) => ['softbox','umbrella','continuous_light','speedlight'].includes(it.type))
        .map((it: any) => {
          const p = { x: it.position?.[0] ?? 0, y: it.position?.[1] ?? 1.5, z: it.position?.[2] ?? 0.5 };
          const params = it.params || {};
          if (it.type === 'softbox') return { type: 'rect', intensity: params.intensity ?? 15, width: params.width ?? 0.8, height: params.height ?? 0.6, color: '#ffffff', position: p };
          if (it.type === 'umbrella') return { type: 'spot', intensity: params.intensity ?? 5, angle: ((params.angle ?? (Math.PI/6)) * 180) / Math.PI, color: '#ffffff', position: p };
          if (it.type === 'continuous_light') return { type: 'point', intensity: params.intensity ?? 20, color: '#fff6e5', position: p };
          if (it.type === 'speedlight') return { type: 'spot', intensity: params.intensity ?? 30, angle: ((params.angle ?? (Math.PI/6)) * 180) / Math.PI, color: '#ffffff', position: p };
          return null;
        }).filter(Boolean) : [];
      return {
        scene: pl.environment || 'studio',
        // hdri removed from UI; kept here for legacy preset compatibility if present
        hdri: pl.hdri ? `/assets/hdri/${pl.hdri}` : undefined,
        subject: { type: pl.subject === 'portrait' ? 'box' : (pl.subject === 'group' ? 'box' : 'box') },
        render: { shadows: true },
        lights,
        overlays: { zebra: { enabled: false, threshold: 0.9 }, histogram: { enabled: false } },
        post: {},
        materials: { background: { color: '#222' }, subject: { color: '#cccccc' } },
        camera: { iso: 200, aperture: 4, shutter: 125, wbK: 5600 },
      };
    }
    return preset || {};
  })();

  useEffect(() => {
    if (!open) return;
    if (normalized?.camera) {
      if (typeof normalized.camera.iso === 'number') setIso(normalized.camera.iso);
      if (typeof normalized.camera.aperture === 'number') setAperture(normalized.camera.aperture);
      if (typeof normalized.camera.shutter === 'number') setShutter(normalized.camera.shutter);
      if (typeof normalized.camera.wbK === 'number') setWbK(normalized.camera.wbK);
    }
  }, [open, normalized]);

  const render = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const w = c.width, h = c.height;
    const g = ctx.createLinearGradient(0, 0, w, h);
    const tint = Math.max(2000, Math.min(12000, wbK));
    const t = (tint - 2000) / 10000;
    g.addColorStop(0, `rgba(${Math.round(255*(1-t))}, ${Math.round(200+40*t)}, ${Math.round(255*t)}, 1)`);
    g.addColorStop(1, '#111');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '14px sans-serif';
    ctx.fillText(`ISO ${iso}  f/${aperture}  1/${shutter}  WB ${wbK}K`, 16, 26);
    ctx.fillText(`Scene: ${normalized?.scene || 'studio'}`, 16, 46);
  }, [iso, aperture, shutter, wbK, normalized]);

  useEffect(() => { if (open) render(); }, [open, render]);

  if (!open) return null;

  // Simple preview only (3D retiré)
  if (open && normalized?.kind === 'simple') {
    const tools: Array<{ type: string; quantity?: number; notes?: string; imgUrl?: string }> = Array.isArray(normalized.tools) ? normalized.tools : [];
    const imgFor = (type: string) => `/assets/tools/${type}.svg`;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-4xl rounded bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Aperçu du lab</h3>
            <button className="rounded border px-3 py-1 hover:bg-gray-50" onClick={onClose}>Fermer</button>
          </div>
          {normalized.planImageUrl ? (
            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Plan / schéma</div>
              <img src={normalized.planImageUrl} alt="plan" className="w-full max-h-72 object-contain rounded border" />
            </div>
          ) : null}
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded border p-3 bg-white">
              <div className="text-sm text-gray-600">Contexte</div>
              <div className="mt-2 text-sm">
                <div><span className="text-gray-500">Thème:</span> <span className="font-medium">{normalized.theme}</span></div>
                <div><span className="text-gray-500">Arrière-plan:</span> <span className="font-medium">{normalized.backgroundPreset || '—'}</span></div>
                <div><span className="text-gray-500">HDRI:</span> <span className="font-medium">{normalized.hdri || '—'}</span></div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-600">Scénario / Sujet</div>
                <div className="text-sm"><span className="font-medium">{normalized.scenario || '—'}</span></div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium">Problème à résoudre</div>
                <div className="mt-1 whitespace-pre-wrap text-sm">{normalized.problem || '—'}</div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium">Information à apprendre</div>
                <div className="mt-1 whitespace-pre-wrap text-sm">{normalized.info || '—'}</div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-600">Questions ({(normalized.questions||[]).length})</div>
                <ul className="mt-1 list-disc pl-5 text-sm max-h-40 overflow-auto">
                  {(normalized.questions||[]).map((q: any, i: number)=> (<li key={q.id||i}>{q.prompt || '(Sans énoncé)'}</li>))}
                </ul>
              </div>
            </div>
            <div className="rounded border p-3 bg-white">
              <div className="text-sm font-medium mb-2">Outils sélectionnés</div>
              {tools.length === 0 ? (
                <div className="text-sm text-gray-500">Aucun outil sélectionné.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {tools.map((t, idx) => (
                    <div key={`${t.type}-${idx}`} className="rounded border overflow-hidden bg-white">
                      <div className="h-28 bg-gray-100 flex items-center justify-center">
                        <img src={t.imgUrl || imgFor(t.type)} alt={t.type} className="max-h-24 object-contain" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = imgFor(t.type); }} />
                      </div>
                      <div className="p-2 text-sm">
                        <div className="font-medium">{t.type}</div>
                        <div className="text-xs text-gray-600">Quantité: {t.quantity ?? 1}</div>
                        {t.notes && (<div className="mt-1 text-xs text-gray-600">{t.notes}</div>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback simple aperçu (pas 3D)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl rounded bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Aperçu du Lab (2D)</h3>
          <button className="rounded border px-3 py-1 hover:bg-gray-50" onClick={onClose}>Fermer</button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded border p-3 bg-white">
            <div className="text-sm text-gray-600">Réglages</div>
            <label className="block text-sm">ISO <input className="ml-2 rounded border px-2 py-1 w-28" inputMode="decimal" type="text" value={String(iso)} onChange={(e)=>{ const v = parseNum(e.target.value, iso); setIso(v); render(); }} /></label>
            <label className="block text-sm">f/ <input className="ml-2 rounded border px-2 py-1 w-28" inputMode="decimal" type="text" value={String(aperture)} onChange={(e)=>{ const v = parseNum(e.target.value, aperture); setAperture(v); render(); }} /></label>
            <label className="block text-sm">1/ <input className="ml-2 rounded border px-2 py-1 w-28" inputMode="decimal" type="text" value={String(shutter)} onChange={(e)=>{ const v = parseNum(e.target.value, shutter); setShutter(v); render(); }} /></label>
            <label className="block text-sm">WB K <input className="ml-2 rounded border px-2 py-1 w-28" inputMode="decimal" type="text" value={String(wbK)} onChange={(e)=>{ const v = parseNum(e.target.value, wbK); setWbK(v); render(); }} /></label>
          </div>
          <div className="rounded border p-3 bg-white">
            <canvas ref={canvasRef} width={640} height={360} className="w-full rounded border bg-black" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
// 3D alias removed to fully drop 3D naming
