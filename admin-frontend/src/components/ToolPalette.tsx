import type { ToolType } from '@/types/planner';

const TOOLS: { type: ToolType; label: string }[] = [
  { type: 'camera', label: 'Caméra' },
  { type: 'tripod', label: 'Trépied' },
  { type: 'softbox', label: 'Softbox' },
  { type: 'umbrella', label: 'Parapluie' },
  { type: 'reflector', label: 'Réflecteur' },
  { type: 'continuous_light', label: 'Lumière continue' },
  { type: 'speedlight', label: 'Flash cobra' },
  { type: 'c_stand', label: 'C-Stand' },
  { type: 'backdrop_stand', label: 'Support fond' },
  { type: 'light_meter', label: 'Posemètre' },
];

export function ToolPalette({ onAdd }: { onAdd: (type: ToolType) => void }) {
  return (
    <div className="p-3 border rounded-lg bg-white shadow-sm space-y-2">
      <div className="font-medium">Outils photo</div>
      <div className="grid grid-cols-2 gap-2">
        {TOOLS.map((t) => (
          <button
            key={t.type}
            onClick={() => onAdd(t.type)}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
