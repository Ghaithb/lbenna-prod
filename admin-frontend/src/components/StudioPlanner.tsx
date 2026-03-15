import { useEffect, useState } from 'react';
import type { PlannerItemBase, PlannerState, ToolType } from '@/types/planner';
import TopDownPlanEditor, { type LightItem } from './TopDownPlanEditor';

export interface StudioPlannerProps {
  state: PlannerState;
  onChange: (next: PlannerState) => void;
}

const LIGHT_TYPES: ToolType[] = ['softbox', 'umbrella', 'continuous_light', 'speedlight'];

function toLightItems(items: PlannerItemBase[]): LightItem[] {
  const out: LightItem[] = [];
  for (const it of items) {
    if (!LIGHT_TYPES.includes(it.type as ToolType)) continue;
    const p = it.params || {};
    const angDeg = typeof p.angleDeg === 'number' ? p.angleDeg : (typeof p.angle === 'number' ? Math.round((p.angle * 180) / Math.PI) : 45);
    out.push({
      key: it.id,
      type: it.type as any,
      angleDeg: angDeg,
      intensity: Number(p.intensity ?? 50),
      distance: typeof p.distance === 'number' ? p.distance : 1.2,
      hardness: typeof p.hardness === 'number' ? p.hardness : 40,
      spreadDeg: typeof p.spreadDeg === 'number' ? p.spreadDeg : 90,
      cct: typeof p.cct === 'number' ? p.cct : undefined,
      gel: p.gel || 'None',
    });
  }
  return out;
}

function mergeLightItems(orig: PlannerItemBase[], lights: LightItem[]): PlannerItemBase[] {
  const base = orig.filter((it) => !LIGHT_TYPES.includes(it.type as ToolType));
  const mapped: PlannerItemBase[] = lights.map((L) => ({
    id: L.key,
    type: L.type as any,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    params: {
      intensity: L.intensity,
      distance: L.distance,
      hardness: L.hardness,
      spreadDeg: L.spreadDeg,
      angleDeg: L.angleDeg,
      angle: (L.angleDeg * Math.PI) / 180,
      cct: L.cct,
      gel: L.gel,
    },
  }));
  return [...base, ...mapped];
}

export function StudioPlanner({ state, onChange }: StudioPlannerProps) {
  const [lights, setLights] = useState<LightItem[]>(() => toLightItems(state.items || []));
  // keep lights synced if external state changes (e.g. preset load)
  useEffect(() => {
    setLights(toLightItems(state.items || []));
  }, [JSON.stringify(state.items)]);
  const [local, setLocal] = useState<LightItem[]>(lights);

  const sync = (next: LightItem[]) => {
    setLocal(next);
    onChange({ ...state, items: mergeLightItems(state.items || [], next) });
  };

  const add = (type: LightItem['type']) => {
    const key = Math.random().toString(36).slice(2, 10);
    const L: LightItem = { key, type, angleDeg: 45, intensity: 60, distance: 1.2, hardness: 40, spreadDeg: 90, cct: type==='continuous_light'?3200:5600, gel: 'None' };
    sync([...(local || []), L]);
  };

  const remove = (key: string) => {
    sync((local || []).filter((l: LightItem) => l.key !== key));
  };

  return (
    <div className="space-y-3">
      <div className="rounded border bg-white p-3">
        <div className="font-medium mb-2">Plan d'éclairage (2D)</div>
        <div className="flex flex-wrap gap-2 mb-3">
          <button className="btn btn-secondary" onClick={() => add('softbox')}>+ Softbox</button>
          <button className="btn btn-secondary" onClick={() => add('umbrella')}>+ Parapluie</button>
          <button className="btn btn-secondary" onClick={() => add('continuous_light')}>+ Lumière continue</button>
          <button className="btn btn-secondary" onClick={() => add('speedlight')}>+ Flash cobra</button>
        </div>
        <TopDownPlanEditor value={local} onChange={sync} />
        {local && local.length > 0 && (
          <div className="mt-3">
            <div className="text-sm text-gray-600 mb-1">Sources</div>
            <div className="flex flex-wrap gap-2">
              {local.map((l: LightItem) => (
                <div key={l.key} className="flex items-center gap-2 rounded border px-2 py-1 text-xs bg-white">
                  <span className="font-medium">{l.type}</span>
                  <span className="text-gray-500">∠ {l.angleDeg}°</span>
                  <button className="rounded border px-2 py-0.5 hover:bg-red-50" onClick={() => remove(l.key)}>Supprimer</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudioPlanner;
